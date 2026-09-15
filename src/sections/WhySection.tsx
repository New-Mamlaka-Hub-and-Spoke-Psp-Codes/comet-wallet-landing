import { BoltIcon, IdCardIcon, ShieldCheckIcon, StackIcon } from '../components/icons';

const FEATURES = [
  {
    icon: StackIcon,
    title: 'Multicurrency Wallet',
    desc: 'Hold, send, and convert between fiat and stablecoins in one wallet, with real-time exchange rates.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Bank-Grade Security',
    desc: 'Biometric login, PIN protection, and end-to-end encryption keep your funds and data safe around the clock.',
  },
  {
    icon: BoltIcon,
    title: 'Instant Transfers',
    desc: 'Send money to mobile wallets, bank accounts, or contacts in seconds — locally and across borders.',
  },
  {
    icon: IdCardIcon,
    title: 'Verified & Compliant',
    desc: 'Every account is identity-verified and continuously screened, so you can transact with confidence.',
  },
];

export default function WhySection() {
  return (
    <section className="why wrap" id="features">
      <div className="section-head">
        <h2>Why Comet Wallet?</h2>
        <p>
          Built for people who want more control over their money. Comet Wallet combines secure infrastructure with
          a simple, everyday experience.
        </p>
      </div>
      <div className="cards-4">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div className="feature-card" key={title}>
            <div className="feature-icon">
              <Icon />
            </div>
            <h3>{title}</h3>
            <p>{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
