import LegalPage from '../components/LegalPage';
import source from '../content/cookie-policy.md?raw';

export default function CookiePolicy() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Cookie Policy"
      pageTitle="Cookie Policy — Comet Wallet"
      source={source}
    />
  );
}
