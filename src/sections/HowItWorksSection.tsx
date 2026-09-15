import { CheckCircleIcon, DownloadIcon, ScanFaceIcon, SendSwapIcon, WalletAddIcon } from '../components/icons';

const STEPS = [
  {
    icon: DownloadIcon,
    title: 'Download the app',
    desc: 'Get Comet Wallet free from the App Store or Google Play — no fees to install or hold an account.',
  },
  {
    icon: ScanFaceIcon,
    title: 'Verify your identity',
    desc: 'Quick, secure KYC checks confirm it’s really you, so your account and funds stay protected.',
  },
  {
    icon: WalletAddIcon,
    title: 'Add money',
    desc: 'Top up instantly via M-Pesa, bank transfer, or card — in the currency you already use.',
  },
  {
    icon: SendSwapIcon,
    title: 'Send, swap & pay',
    desc: 'Move money, swap currencies, pay bills, and buy airtime — all free, all from one app.',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="how wrap" id="how-it-works">
      <div className="section-head">
        <span className="how-badge">
          <CheckCircleIcon />
          Free to use — always
        </span>
        <h2>How Comet Wallet Works</h2>
        <p>No monthly plans, no subscription tiers. Create an account and start moving money in minutes.</p>
      </div>
      <div className="how-steps">
        {STEPS.map(({ icon: Icon, title, desc }, i) => (
          <div className="how-step" key={title}>
            <span className="num">{String(i + 1).padStart(2, '0')}</span>
            <div className="ic">
              <Icon />
            </div>
            <h3>{title}</h3>
            <p>{desc}</p>
          </div>
        ))}
      </div>
      <p className="how-foot">
        <strong>Comet Wallet is 100% free to download and use.</strong> We only ever charge a small, clearly
        disclosed fee on select transactions — shown before you confirm, every time.
      </p>
    </section>
  );
}
