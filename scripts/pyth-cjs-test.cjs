const { Connection } = require('@solana/web3.js');
const { PythConnection } = require('@pythnetwork/client');

const programKey = new (require('@solana/web3.js').PublicKey)('FsJ3A3u2vn5cTVofAjvy6y5kwABJAqYWpe4975bi2epH');

(async () => {
  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
  const pythConnection = new PythConnection(connection, programKey);
  const hits = [];
  await new Promise((resolve, reject) => {
    const t = setTimeout(() => { pythConnection.stop(); reject(new Error('timeout')); }, 30000);
    pythConnection.onPriceChange((product, price) => {
      const sym = String(product.symbol || '');
      if (/AAPL|AAPLX|AAPLON|NVDA|TSLA|MSFT/.test(sym)) {
        hits.push({ symbol: sym, price: price.price, conf: price.confidence, status: price.status, slot: price.slot });
      }
    });
    pythConnection.start();
    setTimeout(() => { pythConnection.stop(); clearTimeout(t); resolve(); }, 10000);
  });
  console.log(JSON.stringify(hits, null, 1));
})().catch((e) => { console.error('FATAL', e.message); process.exit(1); });