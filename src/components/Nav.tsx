import { Link } from 'react-router-dom';
import { ArrowRight, CometLogo } from './icons';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/#features' },
  { label: 'Assets', href: '/#assets' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Support', href: 'mailto:support@cometagri.com' },
];

export default function Nav() {
  return (
    <header className="wrap site-nav">
      <Link className="brand" to="/">
        <CometLogo className="brand-mark" />
        Comet Wallet
      </Link>
      <nav className="nav-links">
        {NAV_LINKS.map((link) => (
          <a key={link.label} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
      <a className="btn btn-nav" href="/#how-it-works">
        Get Started
        <ArrowRight />
      </a>
    </header>
  );
}
