import { ArrowRight } from '../components/icons';

export default function CtaSection() {
  return (
    <section className="cta-section">
      <div className="cta-banner">
        <div className="cta-copy">
          <h2>Ready to Take Control of Your Money?</h2>
          <p>
            Join thousands of users who trust Comet Wallet for everyday payments, savings, and transfers. It&apos;s
            free to get started.
          </p>
          <div className="cta-actions">
            <a className="btn btn-dark" href="#how-it-works">
              Create Free Account
              <ArrowRight />
            </a>
            <a className="btn btn-green" href="#features">
              See What It Can Do
            </a>
          </div>
        </div>
        <svg className="cta-visual" viewBox="0 0 160 160" fill="none">
          <rect x="18" y="46" width="108" height="70" rx="14" fill="#0c2419" stroke="#18e08a" strokeOpacity=".5" />
          <rect x="18" y="46" width="108" height="18" rx="14" fill="#18e08a" fillOpacity=".22" />
          <circle cx="44" cy="94" r="12" fill="#18e08a" fillOpacity=".8" />
          <circle cx="60" cy="94" r="12" fill="#33f5a4" fillOpacity=".55" />
          <rect x="86" y="86" width="30" height="8" rx="4" fill="#e7f5ee" fillOpacity=".5" />
          <rect x="86" y="98" width="20" height="6" rx="3" fill="#e7f5ee" fillOpacity=".3" />
        </svg>
      </div>
    </section>
  );
}
