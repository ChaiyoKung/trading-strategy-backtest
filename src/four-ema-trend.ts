import { EMA } from "technicalindicators";
import ohlcv from "../data/BTC-USDT-USDT-1d.json";
import { printOhlcvSample } from "../utils/print-ohlcv-sample";

let timestamps = ohlcv.map((candle) => candle.timestamp);
let closes = ohlcv.map((candle) => candle.close);
let shortestEmas = EMA.calculate({ values: closes, period: 20 });
let shortEmas = EMA.calculate({ values: closes, period: 50 });
let longEmas = EMA.calculate({ values: closes, period: 100 });
let longestEmas = EMA.calculate({ values: closes, period: 200 });

const minLenght = Math.min(
  timestamps.length,
  closes.length,
  shortestEmas.length,
  shortEmas.length,
  longEmas.length,
  longestEmas.length
);

timestamps = timestamps.slice(-minLenght);
closes = closes.slice(-minLenght);
shortestEmas = shortestEmas.slice(-minLenght);
shortEmas = shortEmas.slice(-minLenght);
longEmas = longEmas.slice(-minLenght);
longestEmas = longestEmas.slice(-minLenght);

printOhlcvSample(ohlcv.slice(-minLenght));

let balace = 1_000_000;
type Position = "none" | "long" | "short";
let position: Position = "none";
let entryPrice = 0;

const historical = [];
for (let i = 1; i < minLenght; i++) {
  const timestamp = timestamps[i];

  const close = closes[i];
  const shortestEma = shortestEmas[i];
  const shortEma = shortEmas[i];
  const longEma = longEmas[i];
  const longestEma = longestEmas[i];

  const prevClose = closes[i - 1];
  const prevShortestEma = shortestEmas[i - 1];
  const prevShortEma = shortEmas[i - 1];
  const prevLongEma = longEmas[i - 1];
  const prevLongestEma = longestEmas[i - 1];

  historical.push({
    date: timestamp,
    close: parseFloat(close.toFixed(1)),
    shortestEma: parseFloat(shortestEma.toFixed(1)),
    shortEma: parseFloat(shortEma.toFixed(1)),
    longEma: parseFloat(longEma.toFixed(1)),
    longestEma: parseFloat(longestEma.toFixed(1)),
  });

  const isUpTrend = shortestEma > shortEma && shortEma > longEma && longEma > longestEma;
  const isPrevUpTrend = prevShortestEma > prevShortEma && prevShortEma > prevLongEma && prevLongEma > prevLongestEma;

  const isDownTrend = shortestEma < shortEma && shortEma < longEma && longEma < longestEma;
  const isPrevDownTrend = prevShortestEma < prevShortEma && prevShortEma < prevLongEma && prevLongEma < prevLongestEma;

  /**
   * open long position if:
   * - prev is not up trend
   * - latest is up trend
   * - latest close price is higher than latest shortest ema
   */
  if (!isPrevUpTrend && isUpTrend && close > shortestEma) {
    position = "long";
    entryPrice = prevClose;
    console.log(`[${timestamp}] Opening long position at ${entryPrice}`);
    continue;
  }

  /**
   * close long position if:
   * - prev is up trend
   * - latest is up trend
   * - prev close price is lower than prev shortest ema
   */
  if (position === "long" && isPrevUpTrend && isUpTrend && prevClose < prevShortestEma) {
    const profit = (prevClose - entryPrice) / entryPrice;
    balace *= 1 + profit;
    position = "none";
    console.log(`[${timestamp}] Closing long position at ${prevClose} with profit ${(profit * 100).toFixed(2)}%`);
    continue;
  }

  /**
   * open short position if:
   * - prev is not down trend
   * - latest is down trend
   * - latest close price is lower than latest shortest ema
   */
  if (!isPrevDownTrend && isDownTrend && close < shortestEma) {
    position = "short";
    entryPrice = prevClose;
    console.log(`[${timestamp}] Opening short position at ${entryPrice}`);
    continue;
  }

  /**
   * close short position if:
   * - prev is down trend
   * - latest is down trend
   * - prev close price is higher than prev shortest ema
   */
  if (position === "short" && isPrevDownTrend && isDownTrend && prevClose > prevShortestEma) {
    const profit = (entryPrice - prevClose) / entryPrice;
    balace *= 1 + profit;
    position = "none";
    console.log(`[${timestamp}] Closing short position at ${prevClose} with profit ${(profit * 100).toFixed(2)}%`);
    continue;
  }
}

console.log(`Final balance: ${balace.toLocaleString("th-TH", { style: "currency", currency: "THB" })}`);
