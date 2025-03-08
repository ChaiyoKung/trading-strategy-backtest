import { bingx } from "ccxt";
import { parseOhlcv } from "./utils/parse-ohlcv";
import { write } from "bun";
import { printOhlcvSample } from "./utils/print-ohlcv-sample";

const symbol = "BTC/USDT:USDT";
const timeframe = "1d";

const exchange = new bingx();
const maxLimit = 1440;
const ohlcv = await exchange.fetchOHLCV(symbol, timeframe, 0, maxLimit);
const parsedOhlcv = parseOhlcv(ohlcv);

printOhlcvSample(parsedOhlcv);

const fileName = `data/${symbol.replace("/", "-").replace(":", "-")}-${timeframe}.json`;
await write(fileName, JSON.stringify(parsedOhlcv));
