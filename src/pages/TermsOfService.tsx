import LegalPage from '../components/LegalPage';
import source from '../content/terms-of-service.md?raw';

export default function TermsOfService() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Use"
      pageTitle="Terms of Service — Comet Wallet"
      source={source}
    />
  );
}
