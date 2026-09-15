import { ClockIcon, ShieldCheckIcon, UserShieldIcon } from '../components/icons';

export default function EnterpriseSection() {
  return (
    <section className="enterprise" id="security">
      <div className="enterprise-glow" />
      <svg className="enterprise-badge" viewBox="0 0 100 100" fill="none" stroke="rgba(24,224,138,.5)" strokeWidth="1">
        <circle cx="50" cy="50" r="34" />
        <circle cx="50" cy="50" r="24" />
        <path d="M50 6v10M50 84v10M6 50h10M84 50h10M17 17l7 7M76 76l7 7M83 17l-7 7M24 76l-7 7" />
      </svg>
      <div className="wrap enterprise-grid">
        <div className="enterprise-copy">
          <h2>
            Enterprise-Grade
            <br />
            Security &amp; Compliance
          </h2>
          <p>
            Comet Wallet is built on regulated financial infrastructure. We partner with licensed banking and
            payment providers to keep every transaction safe, monitored, and compliant.
          </p>
        </div>
        <div className="enterprise-cards">
          <div className="enterprise-card ec-1">
            <span className="ic">
              <ShieldCheckIcon />
            </span>
            <div>
              <h4>Licensed &amp; Regulated</h4>
              <p>
                Funds are safeguarded through a CBK-licensed commercial bank and a registered payment service
                provider.
              </p>
            </div>
          </div>
          <div className="enterprise-card ec-2">
            <span className="ic">
              <ClockIcon />
            </span>
            <div>
              <h4>24/7 Fraud Monitoring</h4>
              <p>Every transaction is screened in real time for fraud, sanctions risk, and suspicious activity.</p>
            </div>
          </div>
          <div className="enterprise-card ec-3">
            <span className="ic">
              <UserShieldIcon />
            </span>
            <div>
              <h4>Verified Identity</h4>
              <p>Bank-level KYC checks confirm every user before they can send or receive money.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
