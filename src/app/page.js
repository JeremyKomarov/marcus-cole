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
    <>
      <JsonLd />
      <SessionTracker />
      <Header />
      <main>
        <Hero />
        <Listings />
        <ValueProps />
        <Reviews />
        <About />
        <Market />
        <Process />
        <LeadForm />
        <Faq />
      </main>
      <Footer />
      <SectionNav />
      <MobileCtaBar />
      <ScrollReveal />
    </>
  );
}
