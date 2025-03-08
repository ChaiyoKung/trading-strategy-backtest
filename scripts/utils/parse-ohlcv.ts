import type { OHLCV } from "ccxt";
import { z } from "zod";

const ohlcvSchema = z.array(
  z.tuple([
    z.number(), // timestamp
    z.number(), // open
    z.number(), // high
    z.number(), // low
    z.number(), // close
    z.number(), // volume
  ])
);

export function parseOhlcv(ohlcv: OHLCV[]) {
  return ohlcvSchema.parse(ohlcv).map((candle) => ({
    timestamp: new Date(candle[0]).toISOString(),
    open: candle[1],
    high: candle[2],
    low: candle[3],
    close: candle[4],
    volume: candle[5],
  }));
}
