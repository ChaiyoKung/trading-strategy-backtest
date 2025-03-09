# trading-strategy-backtest

## Getting Started

> This project was created using `bun init` in bun v1.2.2. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

Install dependencies:

```bash
bun install
```

Run for create historical data:

```bash
# bun run ./scripts/create-historical-data.ts "<symbol>" "<timeframe>"
bun run ./scripts/create-historical-data.ts "BTC/USDT:USDT" "1d"
bun run ./scripts/create-historical-data.ts "BTC/USDT:USDT" "4h"
bun run ./scripts/create-historical-data.ts "BTC/USDT:USDT" "15m"
```
