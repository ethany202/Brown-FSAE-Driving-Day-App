export const CHARTS = {
    LINE_CHART: "Line Chart",
    SCATTER_CHART: "Scatter Chart"
} as const;
export type ChartCategory = typeof CHARTS[keyof typeof CHARTS]