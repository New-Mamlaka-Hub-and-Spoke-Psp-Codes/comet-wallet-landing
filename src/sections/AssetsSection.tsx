const ASSETS = [
  { code: 'BTC', name: 'Bitcoin', symbol: '₿', bg: '#f7931a22', fg: '#f7931a' },
  { code: 'ETH', name: 'Ethereum', symbol: 'Ξ', bg: '#8a8fdc22', fg: '#a5a9ff' },
  { code: 'USDT', name: 'Tether', symbol: '₮', bg: '#26a17b22', fg: '#26a17b' },
  { code: 'USDC', name: 'USD Coin', symbol: '$', bg: '#2775ca22', fg: '#5aa9f7' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'K', bg: '#18e08a22', fg: '#18e08a' },
  { code: 'USD', name: 'US Dollar', symbol: '$', bg: '#ffffff17', fg: '#e7e7e7' },
  { code: 'EUR', name: 'Euro', symbol: '€', bg: '#ffd27017', fg: '#e8b84b' },
  { code: 'GBP', name: 'British Pound', symbol: '£', bg: '#ff8a8a17', fg: '#e88585' },
  { code: 'USDA', name: 'Comet USDA', symbol: 'U', bg: '#18e08a22', fg: '#18e08a' },
  { code: 'ARTM', name: 'Comet ARTM', symbol: 'A', bg: '#18e08a22', fg: '#18e08a' },
];

export default function AssetsSection() {
  return (
    <section className="assets wrap" id="assets">
      <div className="section-head">
        <h2>Supported Assets</h2>
        <p>Manage the currencies and assets you use every day, all from a single Comet Wallet balance.</p>
      </div>
      <div className="assets-grid">
        {ASSETS.map((asset) => (
          <div className="asset-item" key={asset.code}>
            <span className="asset-icon" style={{ background: asset.bg, color: asset.fg }}>
              {asset.symbol}
            </span>
            <span className="asset-text">
              <div className="code">{asset.code}</div>
              <div className="name">{asset.name}</div>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
