export interface DataPoint {
  month: string;
  actual: number | null;
  predicted?: number | null;
  forecastMin?: number | null;
  forecastMax?: number | null;
}

export function generateForecast(
  historicalData: { month: string; actual: number }[],
  futureMonths: string[]
): DataPoint[] {
  const n = historicalData.length;
  if (n === 0) return [];

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  historicalData.forEach((point, i) => {
    const x = i;
    const y = point.actual;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  });

  const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const b = (sumY - m * sumX) / n;

  // Calculate standard error for the band
  let sumSqErr = 0;
  historicalData.forEach((point, i) => {
    const x = i;
    const y = point.actual;
    const predictedY = m * x + b;
    sumSqErr += Math.pow(y - predictedY, 2);
  });
  const stdErr = Math.sqrt(sumSqErr / (n > 2 ? n - 2 : 1));
  const margin = stdErr * 1.5; // 1.5 std dev for the band

  const result: DataPoint[] = [];

  // Add historical data
  historicalData.forEach((point, i) => {
    const isLast = i === n - 1;
    result.push({
      month: point.month,
      actual: point.actual,
      // Connect the predicted line and band to the last actual point
      predicted: isLast ? point.actual : null,
      forecastMin: isLast ? point.actual : null,
      forecastMax: isLast ? point.actual : null,
    });
  });

  // Add future predictions
  futureMonths.forEach((month, i) => {
    const x = n + i;
    const predictedY = m * x + b;
    // Ensure we don't predict negative values if inappropriate, but let's keep it simple
    const pred = Math.max(0, Math.round(predictedY));
    const min = Math.max(0, Math.round(predictedY - margin));
    const max = Math.max(0, Math.round(predictedY + margin));
    
    result.push({
      month,
      actual: null,
      predicted: pred,
      forecastMin: min,
      forecastMax: max,
    });
  });

  return result;
}
