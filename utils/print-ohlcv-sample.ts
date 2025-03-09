export function printOhlcvSample(
  ohlcv: {
    timestamp: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }[]
) {
  console.table([
    ...ohlcv.slice(0, 5),
    { timestamp: "...", open: "...", high: "...", low: "...", close: "...", volume: "..." },
    ...ohlcv.slice(-5),
  ]);
}
