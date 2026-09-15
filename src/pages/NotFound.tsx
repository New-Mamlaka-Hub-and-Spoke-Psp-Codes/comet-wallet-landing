import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  useEffect(() => {
    document.title = 'Page Not Found — Comet Wallet';
  }, []);

  return (
    <div className="not-found wrap">
      <h1>404</h1>
      <p>We couldn&apos;t find that page.</p>
      <Link className="btn btn-green" to="/">
        Back to Home
      </Link>
    </div>
  );
}
