import LegalPage from '../components/LegalPage';
import source from '../content/account-deletion.md?raw';

export default function AccountDeletion() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Account & Data Deletion"
      pageTitle="Account & Data Deletion — Comet Wallet"
      source={source}
    />
  );
}
