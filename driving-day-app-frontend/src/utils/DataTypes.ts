export const CATEGORIES = {
    BR_PRESSURE_FRONT: "Brake Pressure Front",
    BR_PRESSURE_BACK: "Brake Pressure Back",
    COOL_TEMP: "Coolant Temperature",
    ENG_OIL_PRESSURE: "Engine Oil Pressure"
} as const;
export type DataCategory = typeof CATEGORIES[keyof typeof CATEGORIES]

// Prefixed with 'H' indicates highest
// Prefixed with 'L' indicates lowest


export interface ReusableChartProps{
    // Frequency in terms of seconds: i.e. 1 = 1 second, 5 = every five seconds
    frequency: number,
    categoryName: string,
    verticalLabel: string,
    horizontalLabel: string,
    chartPoints: any[],
}




