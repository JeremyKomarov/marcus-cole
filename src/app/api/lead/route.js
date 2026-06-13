'use strict';

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongo';

// In-memory rate limit: ip → { count, resetAt }
const rateMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (entry.count >= 5) return true;
  entry.count++;
  return false;
}

export async function POST(req) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { name, phone, email, intent, hp } = body;

  // Honeypot
  if (hp) return NextResponse.json({ ok: true });

  // Basic validation
  if (!name?.trim() || !phone?.trim() || !email?.trim()) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const lead = {
    name: String(name).trim().slice(0, 120),
    phone: String(phone).trim().slice(0, 40),
    email: String(email).trim().slice(0, 200),
    intent: ['buy', 'sell', 'both'].includes(intent) ? intent : 'sell',
    source: 'marcus-cole',
    createdAt: new Date(),
    ip,
  };

  const results = await Promise.allSettled([
    saveMongo(lead),
    sendEmail(lead),
  ]);

  const anyOk = results.some((r) => r.status === 'fulfilled');
  if (!anyOk) {
    console.error('All lead handlers failed:', results);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

async function saveMongo(lead) {
  const db = await getDb();
  await db.collection('leads').insertOne({ ...lead, project: 'marcus-cole' });
}

async function sendEmail(lead) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'leads@marcuscolegroup.com',
      to: process.env.LEAD_EMAIL ?? 'marcus@marcuscolegroup.com',
      subject: `New Lead — ${lead.name} (${lead.intent})`,
      text: `Name: ${lead.name}\nPhone: ${lead.phone}\nEmail: ${lead.email}\nIntent: ${lead.intent}\nTime: ${lead.createdAt.toISOString()}`,
    }),
  });

  if (!res.ok) throw new Error(`Resend error ${res.status}`);
}
