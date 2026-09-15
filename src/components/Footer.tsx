import { Link } from 'react-router-dom';
import { CometMark, InstagramIcon, TelegramIcon, XIcon } from './icons';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer wrap">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="brand">
            <CometMark className="brand-mark" />
            Comet Wallet
          </div>
          <p>
            A secure, multicurrency digital wallet for sending money, paying bills, and managing your finances — all
            in one free app.
          </p>
          <div className="footer-social">
            <a href="#" aria-label="X / Twitter">
              <XIcon />
            </a>
            <a href="#" aria-label="Telegram">
              <TelegramIcon />
            </a>
            <a href="#" aria-label="Instagram">
              <InstagramIcon />
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Product</h4>
          <ul>
            <li>
              <a href="/#features">Features</a>
            </li>
            <li>
              <a href="/#how-it-works">How It Works</a>
            </li>
            <li>
              <a href="/#assets">Supported Assets</a>
            </li>
            <li>
              <a href="/#security">Security</a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Resources</h4>
          <ul>
            <li>
              <a href="mailto:support@cometagri.com">Help Center</a>
            </li>
            <li>
              <a href="#">FAQs</a>
            </li>
            <li>
              <a href="#">Send Money Guide</a>
            </li>
            <li>
              <a href="#">Community</a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li>
              <a href="#">About Us</a>
            </li>
            <li>
              <a href="#">Blog</a>
            </li>
            <li>
              <a href="#">Careers</a>
            </li>
            <li>
              <a href="mailto:info@cometagri.com">Contact</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {year} Comet Wallet. All rights reserved.</span>
        <div className="footer-legal">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/cookies">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  );
}
