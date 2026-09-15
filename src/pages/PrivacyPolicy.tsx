import LegalPage from '../components/LegalPage';
import source from '../content/privacy-policy.md?raw';

export default function PrivacyPolicy() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      pageTitle="Privacy Policy — Comet Wallet"
      source={source}
    />
  );
}
