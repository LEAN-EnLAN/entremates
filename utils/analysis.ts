interface CravingLog {
    timestamp: string;
    intensity: number;
}

export function findPeakCravingHour(cravings: CravingLog[]): number | null {
    if (cravings.length < 3) return null; // Need some data

    const hourCounts: Record<number, number> = {};

    cravings.forEach(log => {
        const date = new Date(log.timestamp);
        const hour = date.getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    let maxCount = 0;
    let peakHour = -1;

    Object.entries(hourCounts).forEach(([hour, count]) => {
        if (count > maxCount) {
            maxCount = count;
            peakHour = Number(hour);
        }
    });

    return peakHour;
}
