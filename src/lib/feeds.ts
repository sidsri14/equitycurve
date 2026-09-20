export interface SponsoredFeed {
  alias: string
  id: string
  address: string
}

export const SPONSORED_FEEDS: SponsoredFeed[] = [
  { alias: 'SOL/USD', id: 'ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d', address: '7UVimffxr9ow1uXYxsr4LHAcV58mLzhmwaeKvJ1pjLiE' },
  { alias: 'MSOL/USD', id: 'c2289a6a43d2ce91c6f55caec370f4acc38a2ed477f58813334c6d03749ff2a4', address: '5CKzb9j4ChgLUt8Gfm5CNGLN6khXKiqMbnGAW4cgXgxK' },
  { alias: 'BSOL/USD', id: '89875379e70f8fbadc17aef315adf3a8d5d160b811435537e03c97e8aac97d9c', address: '5cN76Xm2Dtx9MnrQqBDeZZRsWruTTcw37UruznAdSvvE' },
  { alias: 'SSOL/SOL', id: 'add6499a420f809bbebc0b22fbf68acb8c119023897f6ea801688e0d6e391af4', address: '2doCYXwYNt2FhzfCdgpW4YAwczvdzB27xtJkzQd5Kre2' },
  { alias: 'BONK/USD', id: '72b021217ca3fe68922a19aaf990109cb9d84e9ad004b4d2025ad6f529314419', address: 'DBE3N8uNjhKPRHfANdwGvCZghWXyLPdqdSbEW2XFwBiX' },
  { alias: 'W/USD', id: 'eff7446475e218517566ea99e72a4abec2e1bd8498b43b7d8331e29dcb059389', address: 'BEMsCSQEGi2kwPA4mKnGjxnreijhMki7L4eeb96ypzF9' },
  { alias: 'MEW/USD', id: '514aed52ca5294177f20187ae883cec4a018619772ddce41efcc36a6448f5d5d', address: 'EF6U755BdHMXim8RBw6XSC6Yk6XaouTKpwcBZ7QkcanB' },
  { alias: 'USDC/USD', id: 'eaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a', address: 'Dpw1EAVrSB1ibxiDQyTAW6Zip3J4Btk2x4SgApQCeFbX' },
  { alias: 'BTC/USD', id: 'e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43', address: '4cSM2e6rvbGQUFiJbqytoVMi5GgghSMr8LwVrT9VPSPo' },
  { alias: 'USDT/USD', id: '2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b', address: 'HT2PLQBcG5EiCcNSaMHAjSgd9F98ecpATbk4Sk5oYuM' },
  { alias: 'JUP/USD', id: '0a0408d619e9380abad35060f9192039ed5042fa6f82301d0e48bb52be830996', address: '7dbob1psH1iZBS7qPsm3Kwbf5DzSXK8Jyg31CTgTnxH5' },
  { alias: 'ETH/USD', id: 'ff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace', address: '42amVS4KgzR9rA28tkVYqVXjq9Qa8dcZQMbH5EYFX6XC' },
  { alias: 'PYTH/USD', id: '0bbf28e9a841a1cc788f6a361b17ca072d0ea3098a1e5df1c3922d06719579ff', address: '8vjchtMuJNY4oFQdTi8yCe6mhCaNBFaUbktT482TpLPS' },
  { alias: 'HNT/USD', id: '649fdd7ec08e8e2a20f425729854e90293dcbe2376abc47197a14da6ff339756', address: '4DdmDswskDxXGpwHrXUfn2CNUm9rt21ac79GHNTN3J33' },
  { alias: 'ORCA/USD', id: '37505261e557e251290b8c8899453064e8d760ed5c65a779726f2490980da74c', address: '4CBshVeNBEXz24GZpoj8SrqP5L7VGG3qjGd6tCST1pND' },
  { alias: 'SAMO/USD', id: '49601625e1a342c1f90c3fe6a03ae0251991a1d76e480d2741524c29037be28a', address: '2eUVzcYccqXzsDU1iBuatUaDCbRKBjegEaPPeChzfocG' },
  { alias: 'WIF/USD', id: '4ca4beeca86f0d164160323817a4e42b10010a724c2217c6ee41b54cd4cc61fc', address: '6B23K3tkb51vLZA14jcEQVCA1pfHptzEHFA93V5dYwbT' },
  { alias: 'INF/USD', id: 'f51570985c642c49c2d6e50156390fdba80bb6d5f7fa389d2f012ced4f7d208f', address: 'Ceg5oePJv1a6RR541qKeQaTepvERA3i8SvyueX9tT8Sq' },
  { alias: 'MNDE/USD', id: '3607bf4d7b78666bd3736c7aacaf2fd2bc56caa8667d3224971ebe3c0623292a', address: 'GHKcxocPyzSjy7tWApQjKRkDNuVXd4Kk624zhuaR7xhC' },
  { alias: 'NEON/USD', id: 'd82183dd487bef3208a227bb25d748930db58862c5121198e723ed0976eb92b7', address: 'F2VfCymdNQiCa8Vyg5E7BwEv9UPwfm8cVN6eqQLqXiGo' },
  { alias: 'AUD/USD', id: '67a6f93030420c1c9e3fe37c1ab6b77966af82f995944a9fefce357a22854a80', address: '6pPXqXcgFFoLEcXfedWJy3ypNZVJ1F3mgipaDFsvZ1co' },
  { alias: 'GBP/USD', id: '84c2dde9633d93d1bcad84e7dc41c9d56578b7ec52fabedc1f335d673df0a7c1', address: 'G25Tm7UkVruTJ7mcbCxFm45XGWwsH72nJKNGcHEQw1tU' },
  { alias: 'EUR/USD', id: 'a995d00bb36a63cef7fd2c287dc105fc8f3d93779f062f09551b0af3e81ec30b', address: 'Fu76ChamBDjE8UuGLV6GP2AcPPSU6gjhkNhAyuoPm7ny' },
  { alias: 'XAG/USD', id: 'f2fb02c32b055c805e7238d628e5e9dadef274376114eb1f012337cabe93871e', address: 'H9JxsWwtDZxjSL6m7cdCVsWibj3JBMD9sxqLjadoZnot' },
  { alias: 'XAU/USD', id: '765d2ba906dbc32ca17cc11f5310a89e9ee1f6420508c63861f2f8ba4ee34bb2', address: '2uPQGpm8X4ZkxMHxrAW1QuhXcse1AHEgPih6Xp9NuEWW' },
  { alias: 'BLZE/USD', id: '93c3def9b169f49eed14c9d73ed0e942c666cf0e1290657ec82038ebb792c2a8', address: 'FFv5yoCGhEgWv6mXhwv4KX8A2dYcVAzi88a6Yu8Tf3iB' },
  { alias: 'JLP/USD', id: 'c811abc82b4bad1f9bd711a2773ccaa935b03ecef974236942cec5e0eb845a3a', address: '2TTGSRSezqFzeLUH8JwRUbtN66XLLaymfYsWRTMjfiMw' },
  { alias: 'WBTC/USD', id: 'c9d8b075a5c69303365ae23633d4e085199bf5c520a3b90fed1322a0342ffc33', address: '9gNX5vguzarZZPjTnE1hWze3s6UsZ7dsU3UnAmKPnMHG' },
  { alias: 'PENGU/USD', id: 'bed3097008b9b5e3c93bec20be79cb43986b85a996475589351a21e67bae9b61', address: '27zzC5wXCeZeuJ3h9uAJzV5tGn6r5Tzo98S1ZceYKEb8' },
  { alias: 'TRUMP/USD', id: '879551021853eec7a7dc827578e8e69da7e4fa8148339aa0d3d5296405be4b1a', address: '9vNb2tQoZ8bB4vzMbQLWViGwNaDJVtct13AGgno1wazp' },
  { alias: 'FARTCOIN/USD', id: '58cd29ef0e714c5affc44f269b2c1899a52da4169d7acc147b9da692e6953608', address: '2t8eUbYKjidMs3uSeYM9jXM9uudYZwGkSeTB4TKjmvnC' },
  { alias: 'ACRED/USD', id: '40ac3329933a6b5b65cf31496018c5764ac0567316146f7d0de00095886b480d', address: '6gyQ2TKvvV1JB5oWDobndv6BLRWcJzeBNk9PLQ5uPQms' },
  { alias: 'PUMP/USD', id: '7a01fca212788bba7c5bf8c9efd576a8a722f070d2c17596ff7bb609b8d5c3b9', address: 'HMm3GPbdnqGwbkTnUUqCFsH8AMHDdEC3Lg8gcPD3HJSH' },
  { alias: 'JUPSOL/SOL.RR', id: 'f8d8d6b6c866c8b2624fb5b679ae846738725e5fc887fa8e927c8d8645018a2b', address: 'D7UqeBmCEmhGXGYfi2y9RfoCa7t1Xw5iZLBeYZ3sxFSe' },
  { alias: 'NAV.USTB/USD', id: 'dea78edd10cd7ae4524cc1744216788746306623bc3553014eeab6062860795d', address: 'EqggHKbjePzmXAX6MW3EsgjiJ4mhkbb8j5s5KfGs1gLq' },
  { alias: 'NAV.USCC/USD', id: '5d73a5953dc86c4773adc778c30e8a6dfc94c5c3a74d7ebb56dd5e70350f044a', address: '823Y4cV7XH2TzkB9NdHfTRoCKLrqXv8EgQP5nzEG43Hp' },
  { alias: 'WTIZ5/USD', id: '0c62848c8afee091f2c132eef944e3075c6de476129efc872a4202d81ca34f99', address: '3MBVC4DW1KsJcH1CB61XNHMo7CPkKW21gFNUku1sJ33q' },
  { alias: 'ZBTC/USD', id: '3d824c7f7c26ed1c85421ecec8c754e6b52d66a4e45de20a9c9ea91de8b396f9', address: '7qFJxM2GefbY2td7cXb6bmXmwVqkeF7kYjaypgZWLBng' },
  { alias: 'LBTC/USD', id: '8f257aab6e7698bb92b15511915e593d6f8eae914452f781874754b03d0c612b', address: 'HENev4WeM2VhJ2b9tFCQsWdHGU6fTvgW68MsvBeYpxYn' },
  { alias: 'INF/SOL', id: '49e50653755fbf8018ab65a07be2f208ac8c4bdfc43200934304ca17ee663cab', address: '4MbCk4vH47K2gHee6nTg62KScpGu2bV3YDeTZtpQm3ro' },
  { alias: 'WTIX5/USD', id: '2e8c6b85cf4a79b6d8bce10be470eefb369810b642782cb6aa150f82362e65d1', address: '2SxsutiRd7TBmURrWW2tPR3xeHpJFuGVGAd4Wjddkk7D' },
  { alias: 'INDEX.FORD/USD', id: '84d8c84bfbe6f71af527493f9aaee09950ee3e09c8460b2b781ce65ea341c10a', address: 'GUq4JEVMgC5AmZpKxjh1aJsabB9X7mBwPavKSsnz11DS' },
  { alias: 'INDEX.GLXY/USD', id: 'c59735498fa594a63e36382c12656e4313a7269ea1a1ed8fa583008e277f9cdb', address: '84NBovYcdtTdbb9vw9U7YeGPssTuCxcAMexw3PWDzWhR' },
  { alias: 'SYRUPUSDC/USDC.RR', id: '2ad31d1c4a85fbf2156ce57fab4104124c5ef76a6386375ecfc8da1ed5ce1486', address: 'GWdwWDhYFUc8ZD6uCTtEAAwx97V1ZCsxPWGL7vhSha6w' },
  { alias: 'ORE/USD', id: '142b804c658e14ff60886783e46e5a51bdf398b4871d9d8f7c28aa1585cad504', address: 'GYYQ8gbX4Tndc4WMJ9jSjZTePTvbmgRRxByt54ZQYqvZ' },
  { alias: 'PST/USDC.RR', id: '675e36f84a6be779ed793c71eb5c03151e1866c125767f46933626e0610af84d', address: 'CBGwQddTeYn3KdvxGWtU95fqCcavzHK9XPFBLENDF5JR' },
]

const SPONSORED_BY_ALIAS = new Map(SPONSORED_FEEDS.map((f) => [f.alias, f]))
export const sponsoredFeed = (alias: string): SponsoredFeed | undefined => SPONSORED_BY_ALIAS.get(alias)

export interface EquityFeed {
  symbol: string
  pythSymbol: string
  id: string
  displaySymbol: string
}

export const EQUITY_FEEDS: EquityFeed[] = [
  { symbol: 'AAPL', pythSymbol: 'Equity.US.AAPL/USD', displaySymbol: 'AAPL', id: '49f6b65cb1de6b10eaf75e7c03ca029c306d0357e91b5311b175084a5ad55688' },
  { symbol: 'TSLA', pythSymbol: 'Equity.US.TSLA/USD', displaySymbol: 'TSLA', id: '16dad506d7db8da01c87581c87ca897a012a153557d4d578c3b9c9e1bc0632f1' },
  { symbol: 'MSFT', pythSymbol: 'Equity.US.MSFT/USD', displaySymbol: 'MSFT', id: 'd0ca23c1cc005e004ccf1db5bf76aeb6a49218f43dac3d4b275e92de12ded4d1' },
  { symbol: 'NVDA', pythSymbol: 'Equity.US.NVDA/USD', displaySymbol: 'NVDA', id: 'b1073854ed24cbc755dc527418f52b7d271f6cc967bbf8d8129112b18860a593' },
  { symbol: 'AMZN', pythSymbol: 'Equity.US.AMZN/USD', displaySymbol: 'AMZN', id: 'b5d0e0fa58a1f8b81498ae670ce93c872d14434b72c364885d4fa1b257cbb07a' },
  { symbol: 'GOOG', pythSymbol: 'Equity.US.GOOG/USD', displaySymbol: 'GOOG', id: 'e65ff435be42630439c96396653a342829e877e2aafaeaf1a10d0ee5fd2cf3f2' },
  { symbol: 'GOOGL', pythSymbol: 'Equity.US.GOOGL/USD', displaySymbol: 'GOOGL', id: '5a48c03e9b9cb337801073ed9d166817473697efff0d138874e0f6a33d6d5aa6' },
  { symbol: 'META', pythSymbol: 'Equity.US.META/USD', displaySymbol: 'META', id: '78a3e3b8e676a8f73c439f5d749737034b139bbbe899ba5775216fba596607fe' },
  { symbol: 'COIN', pythSymbol: 'Equity.US.COIN/USD', displaySymbol: 'COIN', id: 'fee33f2a978bf32dd6b662b65ba8083c6773b494f8401194ec1870c640860245' },
  { symbol: 'SPY', pythSymbol: 'Equity.US.SPY/USD', displaySymbol: 'SPY', id: '19e09bb805456ada3979a7d1cbb4b6d63babc3a0f8e8a9509f68afa5c4c11cd5' },
  { symbol: 'QQQ', pythSymbol: 'Equity.US.QQQ/USD', displaySymbol: 'QQQ', id: '9695e2b96ea7b3859da9ed25b7a46a920a776e2fdae19a7bcfdf2b219230452d' },
  { symbol: 'NFLX', pythSymbol: 'Equity.US.NFLX/USD', displaySymbol: 'NFLX', id: '8376cfd7ca8bcdf372ced05307b24dced1f15b1afafdeff715664598f15a3dd2' },
  { symbol: 'AMD', pythSymbol: 'Equity.US.AMD/USD', displaySymbol: 'AMD', id: '3622e381dbca2efd1859253763b1adc63f7f9abb8e76da1aa8e638a57ccde93e' },
  { symbol: 'PEP', pythSymbol: 'Equity.US.PEP/USD', displaySymbol: 'PEP', id: 'be230eddb16aad5ad273a85e581e74eb615ebf67d378f885768d9b047df0c843' },
  { symbol: 'KO', pythSymbol: 'Equity.US.KO/USD', displaySymbol: 'KO', id: '9aa471dccea36b90703325225ac76189baf7e0cc286b8843de1de4f31f9caa7d' },
  { symbol: 'BAC', pythSymbol: 'Equity.US.BAC/USD', displaySymbol: 'BAC', id: '21debc1718a4b76ff74dadf801c261d76c46afaafb74d9645b65e00b80f5ee3e' },
  { symbol: 'JPM', pythSymbol: 'Equity.US.JPM/USD', displaySymbol: 'JPM', id: '7f4f157e57bfcccd934c566df536f34933e74338fe241a5425ce561acdab164e' },
]

export const equityFeedBySymbol = (symbol: string): EquityFeed | undefined =>
  EQUITY_FEEDS.find((f) => f.symbol.toUpperCase() === symbol.toUpperCase() || f.displaySymbol.toUpperCase() === symbol.toUpperCase())

export interface PreStock {
  symbol: string
  name: string
  contractAddress: string
}

export const PRESTOCKS: PreStock[] = [
  { symbol: 'ANDURIL', name: 'Anduril PreStocks', contractAddress: 'PresTj4Yc2bAR197Er7wz4UUKSfqt6FryBEdAriBoQB' },
  { symbol: 'ANTHROPIC', name: 'Anthropic PreStocks', contractAddress: 'Pren1FvFX6J3E4kXhJuCiAD5aDmGEb7qJRncwA8Lkhw' },
  { symbol: 'FIGUREAI', name: 'Figure AI PreStocks', contractAddress: 'PreZad18qfPtbxNpMtMuAuX2zVpvkEU8DnJx56faCWd' },
  { symbol: 'KALSHI', name: 'Kalshi PreStocks', contractAddress: 'PreLWGkkeqG1s4HEfFZSy9moCrJ7btsHuUtfcCeoRua' },
  { symbol: 'NEURALINK', name: 'Neuralink PreStocks', contractAddress: 'PrekqLJvJ3qVdXmBGDiexvwUTF4rLFDa6HWS4HJbw9S' },
  { symbol: 'OPENAI', name: 'OpenAI PreStocks', contractAddress: 'PreweJYECqtQwBtpxHL171nL2K6umo692gTm7Q3rpgF' },
  { symbol: 'POLYMARKET', name: 'Polymarket PreStocks', contractAddress: 'Pre8AREmFPtoJFT8mQSXQLh56cwJmM7CFDRuoGBZiUP' },
  { symbol: 'SPACEX', name: 'SpaceX PreStocks', contractAddress: 'PreANxuXjsy2pvisWWMNB6YaJNzr7681wJJr2rHsfTh' },
]

export const preStockByMint = (mint: string): PreStock | undefined =>
  PRESTOCKS.find((p) => p.contractAddress.toLowerCase() === mint.toLowerCase())

export const XSTOCK_MINTS: Record<string, string> = {
  AAPLX: 'XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp',
}

export const SOL_MINT = 'So11111111111111111111111111111111111111112'
export const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
export const USDT_MINT = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'

export function resolveAssetLabel(mint: string): string | null {
  const byMint = new Map<string, string>([
    [SOL_MINT, 'SOL'],
    [USDC_MINT, 'USDC'],
    [USDT_MINT, 'USDT'],
  ])
  for (const [sym, addr] of Object.entries(XSTOCK_MINTS)) byMint.set(addr, sym)
  for (const p of PRESTOCKS) byMint.set(p.contractAddress, p.name.replace(' PreStocks', ''))
  return byMint.get(mint) ?? null
}