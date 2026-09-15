import { ArrowRight, CheckCircleIcon, CometMark, ShieldLockIcon } from '../components/icons';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-glow" />
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <h1>
            Borderless
            <br />
            Digital Money
            <br />
            <em>Wallet</em>
          </h1>
          <p>
            Send, receive, and manage money across currencies and crypto — all from one secure app. Comet Wallet is
            free to download and delivers instant transfers and bank-grade security for everyday life.
          </p>
          <div className="hero-actions">
            <a className="btn btn-dark" href="#how-it-works">
              Get Started Free
              <ArrowRight />
            </a>
            <a className="btn btn-green" href="#features">
              Explore Features
            </a>
          </div>
          <div className="hero-badges">
            <span className="hero-badge">
              <ShieldLockIcon />
              Bank-grade encryption
            </span>
            <span className="hero-divider" />
            <span className="hero-badge">
              <CheckCircleIcon />
              KYC &amp; AML compliant
            </span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="ring ring-2" />
          <div className="ring ring-1" />

          <div className="float-chip chip-1">
            <span className="ic">₿</span>
            <span>
              <span className="code">BTC</span>
              <br />
              <span className="name">Bitcoin</span>
            </span>
          </div>
          <div className="float-chip chip-2">
            <span className="ic">₮</span>
            <span>
              <span className="code">USDT</span>
              <br />
              <span className="name">Tether</span>
            </span>
          </div>
          <div className="float-chip chip-3">
            <span className="ic">K</span>
            <span>
              <span className="code">KES</span>
              <br />
              <span className="name">Shilling</span>
            </span>
          </div>

          <div className="phone">
            <div className="phone-screen">
              <div className="phone-status">
                <span>9:41</span>
                <span>●●●</span>
              </div>
              <div className="phone-brand">
                <CometMark />
                Comet Wallet
              </div>
              <div className="balance-card">
                <div className="label">Total Balance</div>
                <div className="value">$5,240.32</div>
                <div className="sub">▲ 2.4% today</div>
              </div>
              <div className="phone-actions">
                <span>Send</span>
                <span>Top Up</span>
              </div>
              <div className="phone-row">
                <span className="dot">↑</span>
                <span className="txt">
                  <div className="name">Sent to Amina</div>
                  <div className="sub">M-Pesa · Today</div>
                </span>
                <span className="amt">-1,200 KES</span>
              </div>
              <div className="phone-row">
                <span className="dot">↓</span>
                <span className="txt">
                  <div className="name">USDT Swap</div>
                  <div className="sub">Wallet · Today</div>
                </span>
                <span className="amt">+40 USDT</span>
              </div>
              <div className="phone-row">
                <span className="dot">⚡</span>
                <span className="txt">
                  <div className="name">Airtime Top Up</div>
                  <div className="sub">Safaricom</div>
                </span>
                <span className="amt">-200 KES</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
