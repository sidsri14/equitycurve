const { Connection } = require('@solana/web3.js');
const { DynamicBondingCurveClient } = require('@meteora-ag/dynamic-bonding-curve-sdk');

const POOLS = [
  '4VUFLWqDhUwecAKCAWU6nsz8oEB9hmpYF5DBPzbPRyZB',
  'J5tLuDVr4RRNkbEybZ3n1iAnybiuPvGQuUeUKqVLbv4h',
];

(async () => {
  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
  const client = await DynamicBondingCurveClient.create(connection, 'confirmed');
  for (const addr of POOLS) {
    try {
      const pool = await client.state.getPool(addr);
      if (!pool) { console.log('\n', addr, '-> null'); continue }
      const get = (k) => {
        const v = pool[k];
        if (!v) return null;
        if (typeof v.toBase58 === 'function') return v.toBase58();
        if (typeof v.toString === 'function') return v.toString();
        return v;
      };
      console.log('\n=== pool', addr, '===');
      for (const k of Object.keys(pool).filter((k) => !/markPrice|fees|volatilityTracker|curve/.test(k))) {
        console.log(' ', k, '=', get(k));
      }
    } catch (e) { console.log('\n', addr, 'ERR', e.message) }
  }
})().catch((e) => { console.error('FATAL', e.message); process.exit(1); });