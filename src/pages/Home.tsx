import { useEffect } from 'react';
import Hero from '../sections/Hero';
import WhySection from '../sections/WhySection';
import AssetsSection from '../sections/AssetsSection';
import EnterpriseSection from '../sections/EnterpriseSection';
import HowItWorksSection from '../sections/HowItWorksSection';
import CtaSection from '../sections/CtaSection';

export default function Home() {
  useEffect(() => {
    document.title = 'Comet Wallet — Free Multicurrency Digital Wallet';
  }, []);

  return (
    <>
      <Hero />
      <WhySection />
      <AssetsSection />
      <EnterpriseSection />
      <HowItWorksSection />
      <CtaSection />
    </>
  );
}
