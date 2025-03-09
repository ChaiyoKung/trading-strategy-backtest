import { bingx, type OHLCV } from "ccxt";
import { parseOhlcv } from "../utils/parse-ohlcv";
import { write } from "bun";
import { printOhlcvSample } from "../utils/print-ohlcv-sample";
import { z } from "zod";

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: bun run ./scripts/create-historical-data.ts "<symbol>" "<timeframe>"');
  process.exit(1);
}

const symbol = args[0];
const timeframe = args[1];

const exchange = new bingx();
const maxLimit = 1440;
const ohlcvs: OHLCV[] = [];
let since: number = 0;
while (true) {
  const ohlcv = await exchange.fetchOHLCV(symbol, timeframe, since, maxLimit);
  const latestTimestamp = z.number().parse(ohlcv[ohlcv.length - 1][0]);
  if (latestTimestamp === since) break;
  ohlcvs.push(...ohlcv);
  since = latestTimestamp;
}
ohlcvs.pop(); // Remove the latest one because it's not closed yet

const parsedOhlcv = parseOhlcv(ohlcvs);

printOhlcvSample(parsedOhlcv);

const fileName = `data/${symbol.replace("/", "-").replace(":", "-")}-${timeframe}.json`;
await write(fileName, JSON.stringify(parsedOhlcv));
console.log(`Saved to "${fileName}"`);
