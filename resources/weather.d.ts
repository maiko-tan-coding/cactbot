export declare const getWeather: (timeMs: number, zoneId: number) => string | undefined;
export declare const findNextWeather: (timeMs: number, zoneId: number, searchWeather: string, maxTimeMs?: number | undefined) => number | undefined;
export declare const findNextWeatherNot: (timeMs: number, zoneId: number, searchWeather: string, maxTimeMs?: number | undefined) => number | undefined;
export declare const findNextNight: (timeMs: number) => number;
export declare const findNextDay: (timeMs: number) => number;
export declare const isNightTime: (timeMs: number) => boolean;
export declare const isDayTime: (timeMs: number) => boolean;
//# sourceMappingURL=weather.d.ts.map