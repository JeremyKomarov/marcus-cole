"use client";

import { useState, useEffect, useRef } from "react";
import FieldRow from "./FieldRow";
import ArrayEditor from "./ArrayEditor";
import HrefField from "./HrefField";
import LeadsTab from "./LeadsTab";
import VisitorsTab from "./VisitorsTab";
import SitesTab from "./SitesTab";

function setNestedValue(obj, path, value) {
  const segments = path.replace(/\[(\d+)\]/g, ".$1").split(".");
  const result = { ...obj };
  let cur = result;
  for (let i = 0; i < segments.length - 1; i++) {
    const key = segments[i];
    cur[key] = Array.isArray(cur[key]) ? [...cur[key]] : { ...cur[key] };
    cur = cur[key];
  }
  cur[segments[segments.length - 1]] = value;
  return result;
}

function EyeIcon({ off }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {off ? (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );
}

function Section({ label, id, open, onToggle, visible, onToggleVisible, children }) {
  const hidden = visible === false;
  return (
    <div className={`admin-section${open ? " admin-section--open" : ""}${hidden ? " admin-section--hidden" : ""}`}>
      <div className="admin-section__header">
        <button type="button" className="admin-section__title" onClick={onToggle} aria-expanded={open}>
          {label}
          <span className="admin-section__chevron">▼</span>
        </button>
        {onToggleVisible && (
          <button
            type="button"
            className={`admin-section__eye${hidden ? " admin-section__eye--off" : ""}`}
            onClick={() => onToggleVisible(hidden)}
            title={hidden ? "Hidden on site — click to show" : "Shown on site — click to hide"}
            aria-label={hidden ? `Show ${label} on site` : `Hide ${label} on site`}
            aria-pressed={!hidden}
          >
            <EyeIcon off={hidden} />
          </button>
        )}
      </div>
      {open && <div className="admin-section__body">{children}</div>}
    </div>
  );
}

export default function Editor({ hasGoogleReviews, role }) {
  const [content, setContent]   = useState(null);
  const [saved, setSaved]       = useState(null);
  const [dirty, setDirty]       = useState(false);
  const [saving, setSaving]     = useState(false);
  const [saveMsg, setSaveMsg]   = useState(null);
  const [openSection, setOpenSection] = useState(null);
  const [activeTab, setActiveTab]     = useState("content");
  const [viewport, setViewport]       = useState("desktop");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [syncingReviews, setSyncingReviews] = useState(false);
  const iframeRef = useRef(null);

  function writeDraft(data) {
    try { localStorage.setItem('__preview_draft', JSON.stringify(data)); } catch {}
    try {
      iframeRef.current?.contentWindow?.postMessage(
        { type: '__preview_draft', data },
        window.location.origin,
      );
    } catch {}
  }

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then((d) => { setContent(d); setSaved(JSON.stringify(d)); });
  }, []);

  useEffect(() => {
    if (!content) return;
    setDirty(JSON.stringify(content) !== saved);
    writeDraft(content);
  }, [content, saved]);

  // Re-send draft when switching back to Content tab (browsers may throttle hidden iframes).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (activeTab === 'content' && content) writeDraft(content); }, [activeTab]);

  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") { e.preventDefault(); handleSave(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    if (!dirty) return;
    function onUnload(e) { e.preventDefault(); e.returnValue = ""; }
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, [dirty]);

  function change(path, value) {
    setContent((prev) => setNestedValue(prev, path, value));
  }

  function arrChange(key, index, field, value) {
    setContent((prev) => {
      const arr = [...(prev[key] || [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [key]: arr };
    });
  }

  function arrAdd(key, template) {
    setContent((prev) => ({ ...prev, [key]: [...(prev[key] || []), { ...template }] }));
  }

  function arrRemove(key, index) {
    setContent((prev) => {
      const arr = [...(prev[key] || [])];
      arr.splice(index, 1);
      return { ...prev, [key]: arr };
    });
  }

  function nestedArrChange(path, index, field, value) {
    setContent((prev) => {
      const segments = path.split(".");
      const result = { ...prev };
      let cur = result;
      for (let i = 0; i < segments.length - 1; i++) {
        cur[segments[i]] = { ...cur[segments[i]] };
        cur = cur[segments[i]];
      }
      const lastKey = segments[segments.length - 1];
      const arr = [...(cur[lastKey] || [])];
      arr[index] = { ...arr[index], [field]: value };
      cur[lastKey] = arr;
      return result;
    });
  }

  function nestedArrAdd(path, template) {
    setContent((prev) => {
      const segments = path.split(".");
      const result = { ...prev };
      let cur = result;
      for (let i = 0; i < segments.length - 1; i++) {
        cur[segments[i]] = { ...cur[segments[i]] };
        cur = cur[segments[i]];
      }
      const lastKey = segments[segments.length - 1];
      cur[lastKey] = [...(cur[lastKey] || []), { ...template }];
      return result;
    });
  }

  function nestedArrRemove(path, index) {
    setContent((prev) => {
      const segments = path.split(".");
      const result = { ...prev };
      let cur = result;
      for (let i = 0; i < segments.length - 1; i++) {
        cur[segments[i]] = { ...cur[segments[i]] };
        cur = cur[segments[i]];
      }
      const lastKey = segments[segments.length - 1];
      const arr = [...(cur[lastKey] || [])];
      arr.splice(index, 1);
      cur[lastKey] = arr;
      return result;
    });
  }

  function toggleSection(id) {
    setOpenSection((prev) => (prev === id ? null : id));
  }

  async function handleSave() {
    if (!dirty || saving) return;
    setSaving(true);
    setSaveMsg(null);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = await res.json();
      if (data.ok) {
        setSaved(JSON.stringify(content));
        setDirty(false);
        setSaveMsg({ type: "ok", text: "Published — site rebuilding (~60s)" });
        iframeRef.current?.contentWindow?.location?.reload();
      } else {
        setSaveMsg({ type: "fail", text: data.error || "Save failed" });
      }
    } catch {
      setSaveMsg({ type: "fail", text: "Network error" });
    }
    setSaving(false);
  }

  function handleReset() {
    if (!saved) return;
    setContent(JSON.parse(saved));
    setDirty(false);
    setSaveMsg(null);
  }

  async function syncGoogleReviews() {
    setSyncingReviews(true);
    try {
      const res = await fetch("/api/admin/reviews");
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      const reviews = await res.json();
      setContent((prev) => ({ ...prev, REVIEWS: reviews }));
      setSaveMsg({ type: "info", text: `${reviews.length} reviews synced — publish to save` });
    } catch (err) {
      setSaveMsg({ type: "fail", text: `Sync failed: ${err.message}` });
    }
    setSyncingReviews(false);
  }

  if (!content) return <div className="admin-loading">Loading…</div>;

  const { SITE, HERO, STATS, LISTINGS, VALUE_PROPS, REVIEWS, ABOUT, MARKET, PROCESS, LEAD_FORM, FAQ, FOOTER, SECTIONS } = content;

  return (
    <div className={`admin-split${sidebarOpen ? "" : " admin-split--collapsed"}${activeTab !== "content" ? " admin-split--no-preview" : ""}`}>

      {/* ── SIDEBAR ── */}
      <div className="admin-split__sidebar">

        {/* Save bar */}
        <div className="admin-save-bar">
          <div className="admin-save-bar__actions">
            <button className="admin-btn admin-btn--primary admin-btn--sm" onClick={handleSave} disabled={saving || !dirty}>
              {saving ? "Publishing…" : "Publish Live"}
            </button>
            <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={handleReset} disabled={!dirty}>
              Reset
            </button>
          </div>
          {saveMsg && (
            <span className={`admin-save-msg admin-save-msg--${saveMsg.type}`}>{saveMsg.text}</span>
          )}
        </div>

        {/* Tab bar */}
        <div className="admin-tabs">
          {[
            ["content", "Content"],
            ["leads", "Leads"],
            ["visitors", "Visitors"],
            ...(role === "dreamrise_dev" ? [["sites", "All Sites"]] : []),
          ].map(([id, label]) => (
            <button key={id} className={`admin-tab${activeTab === id ? " admin-tab--active" : ""}`} onClick={() => setActiveTab(id)}>
              {label}
            </button>
          ))}
        </div>

        {/* Content tab */}
        <div style={{ display: activeTab === "content" ? "block" : "none" }}>

          {/* Business Info */}
          <Section label="Business Info" id="site" open={openSection === "site"} onToggle={() => toggleSection("site")}>
            <FieldRow label="Business Name" value={SITE.name} onChange={(v) => change("SITE.name", v)} />
            <FieldRow label="Phone" value={SITE.phone} onChange={(v) => change("SITE.phone", v)} type="tel" />
            <FieldRow label="Phone Href" value={SITE.phoneHref} onChange={(v) => change("SITE.phoneHref", v)} hint='Format: tel:5125550101' />
            <FieldRow label="Email" value={SITE.email} onChange={(v) => change("SITE.email", v)} type="email" />
            <FieldRow label="License" value={SITE.license} onChange={(v) => change("SITE.license", v)} />
            <FieldRow label="City" value={SITE.city} onChange={(v) => change("SITE.city", v)} />
            <FieldRow label="State" value={SITE.state} onChange={(v) => change("SITE.state", v)} />
            <p className="admin-section__group-label">Address</p>
            <FieldRow label="Street" value={SITE.address?.street} onChange={(v) => change("SITE.address.street", v)} />
            <div className="admin-field__row">
              <FieldRow label="City" value={SITE.address?.city} onChange={(v) => change("SITE.address.city", v)} />
              <FieldRow label="State" value={SITE.address?.state} onChange={(v) => change("SITE.address.state", v)} />
            </div>
            <FieldRow label="ZIP" value={SITE.address?.zip} onChange={(v) => change("SITE.address.zip", v)} />
          </Section>

          {/* Hero */}
          <Section label="Hero" id="hero" open={openSection === "hero"} onToggle={() => toggleSection("hero")}>
            <FieldRow label="Eyebrow" value={HERO.eyebrow} onChange={(v) => change("HERO.eyebrow", v)} />
            <FieldRow label="Headline" value={HERO.headline} onChange={(v) => change("HERO.headline", v)} />
            <FieldRow label="Headline Emphasis" value={HERO.headlineEm} onChange={(v) => change("HERO.headlineEm", v)} />
            <FieldRow label="Sub-headline" value={HERO.sub} onChange={(v) => change("HERO.sub", v)} type="textarea" rows={3} />
            <FieldRow label="Primary CTA" value={HERO.ctaPrimary} onChange={(v) => change("HERO.ctaPrimary", v)} />
            <FieldRow label="Secondary CTA" value={HERO.ctaSecondary} onChange={(v) => change("HERO.ctaSecondary", v)} />
            <p className="admin-section__group-label">Listing Badge</p>
            <FieldRow label="Price" value={HERO.imageBadgePrice} onChange={(v) => change("HERO.imageBadgePrice", v)} />
            <FieldRow label="Address" value={HERO.imageBadgeAddress} onChange={(v) => change("HERO.imageBadgeAddress", v)} />
          </Section>

          {/* Stats Bar */}
          <Section label="Stats Bar" id="stats" open={openSection === "stats"} onToggle={() => toggleSection("stats")}>
            <ArrayEditor
              items={STATS}
              onAdd={() => arrAdd("STATS", { value: "", label: "" })}
              onRemove={(i) => arrRemove("STATS", i)}
              addLabel="Add Stat"
              getLabel={(item) => item.label || item.value}
              renderItem={(item, i) => (
                <>
                  <FieldRow label="Value" value={item.value} onChange={(v) => arrChange("STATS", i, "value", v)} />
                  <FieldRow label="Label" value={item.label} onChange={(v) => arrChange("STATS", i, "label", v)} />
                </>
              )}
            />
          </Section>

          {/* Featured Listings */}
          <Section label="Featured Listings" id="listings" open={openSection === "listings"} onToggle={() => toggleSection("listings")} visible={SECTIONS?.listings} onToggleVisible={(v) => change("SECTIONS.listings", v)}>
            <ArrayEditor
              items={LISTINGS}
              onAdd={() => arrAdd("LISTINGS", { price: "", address: "", cityState: "Austin, TX", beds: 3, baths: "2", sqft: "", status: "Active" })}
              onRemove={(i) => arrRemove("LISTINGS", i)}
              addLabel="Add Listing"
              getLabel={(item) => item.address || item.price}
              renderItem={(item, i) => (
                <>
                  <FieldRow label="Price" value={item.price} onChange={(v) => arrChange("LISTINGS", i, "price", v)} />
                  <FieldRow label="Address" value={item.address} onChange={(v) => arrChange("LISTINGS", i, "address", v)} />
                  <FieldRow label="City, State ZIP" value={item.cityState} onChange={(v) => arrChange("LISTINGS", i, "cityState", v)} />
                  <div className="admin-field__row">
                    <FieldRow label="Beds" value={String(item.beds ?? "")} onChange={(v) => arrChange("LISTINGS", i, "beds", v)} />
                    <FieldRow label="Baths" value={String(item.baths ?? "")} onChange={(v) => arrChange("LISTINGS", i, "baths", v)} />
                  </div>
                  <div className="admin-field__row">
                    <FieldRow label="Sq Ft" value={item.sqft} onChange={(v) => arrChange("LISTINGS", i, "sqft", v)} />
                    <FieldRow label="Status" value={item.status} onChange={(v) => arrChange("LISTINGS", i, "status", v)} hint="Active / Pending / Sold" />
                  </div>
                </>
              )}
            />
          </Section>

          {/* Why Marcus Cole */}
          <Section label="Why Marcus Cole" id="value-props" open={openSection === "value-props"} onToggle={() => toggleSection("value-props")} visible={SECTIONS?.valueProp} onToggleVisible={(v) => change("SECTIONS.valueProp", v)}>
            <FieldRow label="Section Label" value={VALUE_PROPS.sectionLabel} onChange={(v) => change("VALUE_PROPS.sectionLabel", v)} />
            <FieldRow label="Headline" value={VALUE_PROPS.headline} onChange={(v) => change("VALUE_PROPS.headline", v)} />
            <FieldRow label="Body Copy" value={VALUE_PROPS.copy} onChange={(v) => change("VALUE_PROPS.copy", v)} type="textarea" rows={4} />
            <FieldRow label="CTA Text" value={VALUE_PROPS.cta} onChange={(v) => change("VALUE_PROPS.cta", v)} />
            <p className="admin-section__group-label">Value Pillars</p>
            <ArrayEditor
              items={VALUE_PROPS.pillars || []}
              onAdd={() => nestedArrAdd("VALUE_PROPS.pillars", { number: "04", title: "", body: "" })}
              onRemove={(i) => nestedArrRemove("VALUE_PROPS.pillars", i)}
              addLabel="Add Pillar"
              getLabel={(item) => item.title || item.number}
              renderItem={(item, i) => (
                <>
                  <FieldRow label="Number" value={item.number} onChange={(v) => nestedArrChange("VALUE_PROPS.pillars", i, "number", v)} />
                  <FieldRow label="Title" value={item.title} onChange={(v) => nestedArrChange("VALUE_PROPS.pillars", i, "title", v)} />
                  <FieldRow label="Body" value={item.body} onChange={(v) => nestedArrChange("VALUE_PROPS.pillars", i, "body", v)} type="textarea" rows={3} />
                </>
              )}
            />
          </Section>

          {/* Client Reviews */}
          <Section label="Client Reviews" id="reviews" open={openSection === "reviews"} onToggle={() => toggleSection("reviews")} visible={SECTIONS?.reviews} onToggleVisible={(v) => change("SECTIONS.reviews", v)}>
            {hasGoogleReviews && (
              <div className="admin-sync-bar">
                <div className="admin-sync-bar__info">
                  <strong>Google Reviews</strong>
                  <span>Pull latest from Google Business Profile</span>
                </div>
                <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={syncGoogleReviews} disabled={syncingReviews}>
                  {syncingReviews ? "Syncing…" : "Sync from Google"}
                </button>
              </div>
            )}
            <ArrayEditor
              items={REVIEWS}
              onAdd={() => arrAdd("REVIEWS", { quote: "", name: "", context: "" })}
              onRemove={(i) => arrRemove("REVIEWS", i)}
              addLabel="Add Review"
              getLabel={(item) => item.name || "Review"}
              renderItem={(item, i) => (
                <>
                  <FieldRow label="Quote" value={item.quote} onChange={(v) => arrChange("REVIEWS", i, "quote", v)} type="textarea" rows={4} />
                  <FieldRow label="Client Name" value={item.name} onChange={(v) => arrChange("REVIEWS", i, "name", v)} />
                  <FieldRow label="Context (e.g. Barton Hills · Sold $34k over ask)" value={item.context} onChange={(v) => arrChange("REVIEWS", i, "context", v)} />
                </>
              )}
            />
          </Section>

          {/* About the Agent */}
          <Section label="About the Agent" id="about" open={openSection === "about"} onToggle={() => toggleSection("about")}>
            <FieldRow label="Section Label" value={ABOUT.sectionLabel} onChange={(v) => change("ABOUT.sectionLabel", v)} />
            <FieldRow label="Headline" value={ABOUT.headline} onChange={(v) => change("ABOUT.headline", v)} />
            <FieldRow label="Body" value={ABOUT.body} onChange={(v) => change("ABOUT.body", v)} type="textarea" rows={5} />
            <FieldRow label="CTA Text" value={ABOUT.cta} onChange={(v) => change("ABOUT.cta", v)} />
            <p className="admin-section__group-label">Credentials</p>
            <ArrayEditor
              items={(ABOUT.credentials || []).map((c) => ({ text: c }))}
              onAdd={() => {
                setContent((prev) => ({
                  ...prev,
                  ABOUT: { ...prev.ABOUT, credentials: [...(prev.ABOUT.credentials || []), ""] },
                }));
              }}
              onRemove={(i) => {
                setContent((prev) => {
                  const arr = [...(prev.ABOUT.credentials || [])];
                  arr.splice(i, 1);
                  return { ...prev, ABOUT: { ...prev.ABOUT, credentials: arr } };
                });
              }}
              addLabel="Add Credential"
              getLabel={(item) => item.text}
              renderItem={(item, i) => (
                <FieldRow
                  label={`Credential ${i + 1}`}
                  value={ABOUT.credentials[i]}
                  onChange={(v) => {
                    setContent((prev) => {
                      const arr = [...(prev.ABOUT.credentials || [])];
                      arr[i] = v;
                      return { ...prev, ABOUT: { ...prev.ABOUT, credentials: arr } };
                    });
                  }}
                />
              )}
            />
          </Section>

          {/* Market Stats */}
          <Section label="Market Stats" id="market" open={openSection === "market"} onToggle={() => toggleSection("market")} visible={SECTIONS?.market} onToggleVisible={(v) => change("SECTIONS.market", v)}>
            <FieldRow label="Section Label" value={MARKET.sectionLabel} onChange={(v) => change("MARKET.sectionLabel", v)} hint="Include the month/year, e.g. Austin Market · June 2026" />
            <FieldRow label="Headline" value={MARKET.headline} onChange={(v) => change("MARKET.headline", v)} />
            <FieldRow label="Data Source Note" value={MARKET.sub} onChange={(v) => change("MARKET.sub", v)} />
            <p className="admin-section__group-label">Stats</p>
            <ArrayEditor
              items={MARKET.stats || []}
              onAdd={() => nestedArrAdd("MARKET.stats", { value: "", label: "", sub: "" })}
              onRemove={(i) => nestedArrRemove("MARKET.stats", i)}
              addLabel="Add Stat"
              getLabel={(item) => item.label || item.value}
              renderItem={(item, i) => (
                <>
                  <FieldRow label="Value" value={item.value} onChange={(v) => nestedArrChange("MARKET.stats", i, "value", v)} />
                  <FieldRow label="Label" value={item.label} onChange={(v) => nestedArrChange("MARKET.stats", i, "label", v)} />
                  <FieldRow label="Sub-note" value={item.sub} onChange={(v) => nestedArrChange("MARKET.stats", i, "sub", v)} />
                </>
              )}
            />
          </Section>

          {/* Process */}
          <Section label="The Process" id="process" open={openSection === "process"} onToggle={() => toggleSection("process")} visible={SECTIONS?.process} onToggleVisible={(v) => change("SECTIONS.process", v)}>
            <FieldRow label="Section Label" value={PROCESS.sectionLabel} onChange={(v) => change("PROCESS.sectionLabel", v)} />
            <FieldRow label="Headline" value={PROCESS.headline} onChange={(v) => change("PROCESS.headline", v)} />
            <FieldRow label="CTA Text" value={PROCESS.cta} onChange={(v) => change("PROCESS.cta", v)} />
            <p className="admin-section__group-label">Steps</p>
            <ArrayEditor
              items={PROCESS.steps || []}
              onAdd={() => nestedArrAdd("PROCESS.steps", { number: "04", title: "", body: "" })}
              onRemove={(i) => nestedArrRemove("PROCESS.steps", i)}
              addLabel="Add Step"
              getLabel={(item) => item.title || `Step ${item.number}`}
              renderItem={(item, i) => (
                <>
                  <FieldRow label="Number" value={item.number} onChange={(v) => nestedArrChange("PROCESS.steps", i, "number", v)} />
                  <FieldRow label="Title" value={item.title} onChange={(v) => nestedArrChange("PROCESS.steps", i, "title", v)} />
                  <FieldRow label="Body" value={item.body} onChange={(v) => nestedArrChange("PROCESS.steps", i, "body", v)} type="textarea" rows={3} />
                </>
              )}
            />
          </Section>

          {/* Lead Form / Free Valuation */}
          <Section label="Lead Form / Free Valuation" id="lead-form" open={openSection === "lead-form"} onToggle={() => toggleSection("lead-form")}>
            <FieldRow label="Section Label" value={LEAD_FORM.sectionLabel} onChange={(v) => change("LEAD_FORM.sectionLabel", v)} />
            <FieldRow label="Headline" value={LEAD_FORM.headline} onChange={(v) => change("LEAD_FORM.headline", v)} />
            <FieldRow label="Body Copy" value={LEAD_FORM.body} onChange={(v) => change("LEAD_FORM.body", v)} type="textarea" rows={4} />
            <FieldRow label="Submit CTA" value={LEAD_FORM.submitCta} onChange={(v) => change("LEAD_FORM.submitCta", v)} />
            <FieldRow label="Success Message" value={LEAD_FORM.successMessage} onChange={(v) => change("LEAD_FORM.successMessage", v)} />
            <p className="admin-section__group-label">Trust Points</p>
            <ArrayEditor
              items={(LEAD_FORM.trustPoints || []).map((t) => ({ text: t }))}
              onAdd={() => {
                setContent((prev) => ({
                  ...prev,
                  LEAD_FORM: { ...prev.LEAD_FORM, trustPoints: [...(prev.LEAD_FORM.trustPoints || []), ""] },
                }));
              }}
              onRemove={(i) => {
                setContent((prev) => {
                  const arr = [...(prev.LEAD_FORM.trustPoints || [])];
                  arr.splice(i, 1);
                  return { ...prev, LEAD_FORM: { ...prev.LEAD_FORM, trustPoints: arr } };
                });
              }}
              addLabel="Add Trust Point"
              getLabel={(item) => item.text}
              renderItem={(item, i) => (
                <FieldRow
                  label={`Point ${i + 1}`}
                  value={LEAD_FORM.trustPoints[i]}
                  onChange={(v) => {
                    setContent((prev) => {
                      const arr = [...(prev.LEAD_FORM.trustPoints || [])];
                      arr[i] = v;
                      return { ...prev, LEAD_FORM: { ...prev.LEAD_FORM, trustPoints: arr } };
                    });
                  }}
                />
              )}
            />
          </Section>

          {/* FAQ */}
          <Section label="FAQ" id="faq" open={openSection === "faq"} onToggle={() => toggleSection("faq")} visible={SECTIONS?.faq} onToggleVisible={(v) => change("SECTIONS.faq", v)}>
            <FieldRow label="Section Label" value={FAQ.sectionLabel} onChange={(v) => change("FAQ.sectionLabel", v)} />
            <FieldRow label="Headline" value={FAQ.headline} onChange={(v) => change("FAQ.headline", v)} />
            <p className="admin-section__group-label">Questions</p>
            <ArrayEditor
              items={FAQ.items || []}
              onAdd={() => nestedArrAdd("FAQ.items", { q: "", a: "" })}
              onRemove={(i) => nestedArrRemove("FAQ.items", i)}
              addLabel="Add Question"
              getLabel={(item) => item.q}
              renderItem={(item, i) => (
                <>
                  <FieldRow label="Question" value={item.q} onChange={(v) => nestedArrChange("FAQ.items", i, "q", v)} />
                  <FieldRow label="Answer" value={item.a} onChange={(v) => nestedArrChange("FAQ.items", i, "a", v)} type="textarea" rows={4} />
                </>
              )}
            />
          </Section>

          {/* Footer */}
          <Section label="Footer" id="footer" open={openSection === "footer"} onToggle={() => toggleSection("footer")}>
            <p className="admin-section__group-label">Service Links</p>
            <ArrayEditor
              items={FOOTER.serviceLinks || []}
              onAdd={() => nestedArrAdd("FOOTER.serviceLinks", { label: "", href: "#" })}
              onRemove={(i) => nestedArrRemove("FOOTER.serviceLinks", i)}
              addLabel="Add Link"
              getLabel={(item) => item.label}
              renderItem={(item, i) => (
                <>
                  <FieldRow label="Label" value={item.label} onChange={(v) => nestedArrChange("FOOTER.serviceLinks", i, "label", v)} />
                  <div className="admin-field">
                    <label className="admin-field__label">Link</label>
                    <HrefField value={item.href} onChange={(v) => nestedArrChange("FOOTER.serviceLinks", i, "href", v)} />
                  </div>
                </>
              )}
            />
            <p className="admin-section__group-label">Page Links</p>
            <ArrayEditor
              items={FOOTER.pageLinks || []}
              onAdd={() => nestedArrAdd("FOOTER.pageLinks", { label: "", href: "#" })}
              onRemove={(i) => nestedArrRemove("FOOTER.pageLinks", i)}
              addLabel="Add Link"
              getLabel={(item) => item.label}
              renderItem={(item, i) => (
                <>
                  <FieldRow label="Label" value={item.label} onChange={(v) => nestedArrChange("FOOTER.pageLinks", i, "label", v)} />
                  <div className="admin-field">
                    <label className="admin-field__label">Link</label>
                    <HrefField value={item.href} onChange={(v) => nestedArrChange("FOOTER.pageLinks", i, "href", v)} />
                  </div>
                </>
              )}
            />
            <p className="admin-section__group-label">Social Links</p>
            <ArrayEditor
              items={FOOTER.socialLinks || []}
              onAdd={() => nestedArrAdd("FOOTER.socialLinks", { label: "", href: "https://" })}
              onRemove={(i) => nestedArrRemove("FOOTER.socialLinks", i)}
              addLabel="Add Social Link"
              getLabel={(item) => item.label}
              renderItem={(item, i) => (
                <>
                  <FieldRow label="Platform" value={item.label} onChange={(v) => nestedArrChange("FOOTER.socialLinks", i, "label", v)} />
                  <div className="admin-field">
                    <label className="admin-field__label">URL</label>
                    <HrefField value={item.href} onChange={(v) => nestedArrChange("FOOTER.socialLinks", i, "href", v)} />
                  </div>
                </>
              )}
            />
          </Section>

        </div>

        {/* Leads tab */}
        <div style={{ display: activeTab === "leads" ? "block" : "none" }}>
          <LeadsTab />
        </div>

        {/* Visitors tab */}
        <div style={{ display: activeTab === "visitors" ? "block" : "none" }}>
          <VisitorsTab />
        </div>

        {/* Sites tab — dreamrise_dev only */}
        {role === "dreamrise_dev" && (
          <div style={{ display: activeTab === "sites" ? "block" : "none" }}>
            <SitesTab />
          </div>
        )}

      </div>

      {/* ── PREVIEW ── */}
      <div className="admin-split__preview">
        <div className="admin-split__preview-bar">
          <button type="button" className="admin-panel-toggle" onClick={() => setSidebarOpen((v) => !v)} title="Toggle sidebar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/>
            </svg>
          </button>
          <span className="admin-split__preview-label">Live Preview</span>
          <div className="admin-vp-toggle">
            {[["desktop", "D"], ["mobile", "M"]].map(([v, l]) => (
              <button key={v} className={`admin-vp-btn${viewport === v ? " admin-vp-btn--on" : ""}`} onClick={() => setViewport(v)} title={v}>
                {l === "D" ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="17" r="1" fill="currentColor" stroke="none"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className={`admin-split__iframe-wrap${viewport === "mobile" ? " admin-split__iframe-wrap--mobile" : ""}`}>
          <iframe
            ref={iframeRef}
            src="/?preview=1"
            className="admin-split__iframe"
            title="Site preview"
          />
        </div>
      </div>

    </div>
  );
}
