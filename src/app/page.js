import { ContentProvider } from '@/contexts/ContentContext';
import SectionGate from '@/components/SectionGate/SectionGate';
import JsonLd from '@/components/JsonLd/JsonLd';
import SessionTracker from '@/components/SessionTracker/SessionTracker';
import Header from '@/components/Header/Header';
import Hero from '@/components/Hero/Hero';
import Listings from '@/components/Listings/Listings';
import ValueProps from '@/components/ValueProps/ValueProps';
import Reviews from '@/components/Reviews/Reviews';
import About from '@/components/About/About';
import Market from '@/components/Market/Market';
import Process from '@/components/Process/Process';
import LeadForm from '@/components/LeadForm/LeadForm';
import Faq from '@/components/Faq/Faq';
import Footer from '@/components/Footer/Footer';
import SectionNav from '@/components/SectionNav/SectionNav';
import MobileCtaBar from '@/components/MobileCtaBar/MobileCtaBar';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';

export default function Home() {
  return (
    <ContentProvider>
      <JsonLd />
      <SessionTracker />
      <Header />
      <main>
        <Hero />
        <SectionGate section="listings"><Listings /></SectionGate>
        <SectionGate section="valueProp"><ValueProps /></SectionGate>
        <SectionGate section="reviews"><Reviews /></SectionGate>
        <About />
        <SectionGate section="market"><Market /></SectionGate>
        <SectionGate section="process"><Process /></SectionGate>
        <LeadForm />
        <SectionGate section="faq"><Faq /></SectionGate>
      </main>
      <Footer />
      <SectionNav />
      <MobileCtaBar />
      <ScrollReveal />
    </ContentProvider>
  );
}
