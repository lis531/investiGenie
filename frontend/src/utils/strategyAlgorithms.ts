// Investment strategy algorithms ported from Python backend

export type OrderType = "buy" | "none";

export interface StrategyAlgorithm {
    (i: number, prices: number[], startCash: number, monthlyCash: number, cash: number): OrderType;
}

export const buyAfter3ConsecutiveDownDays: StrategyAlgorithm = (i, prices) => {
    if (i >= 3) {
        const price = prices[i];
        const threeDaysAgo = prices[i - 3];
        const twoDaysAgo = prices[i - 2];
        const yesterday = prices[i - 1];
        if (threeDaysAgo > twoDaysAgo && twoDaysAgo > yesterday && yesterday > price) {
            return "buy";
        }
    }
    return "none";
};

export const buyEveryday: StrategyAlgorithm = () => {
    return "buy";
};

export const buyAndHold: StrategyAlgorithm = (i, _prices, _startCash, monthlyCash, cash) => {
    const isContributionDay = monthlyCash > 0 && i > 0 && i % 21 === 0;
    if (i === 0 || (isContributionDay && cash > 0)) {
        return "buy";
    }
    return "none";
};

export const buyTheDip: StrategyAlgorithm = (i, prices, _startCash, _monthlyCash, _cash, dipThreshold = 0.05, lookbackWindow = 10) => {
    if (i < 1) {
        return "none";
    }
    const recentSlice = prices.slice(Math.max(0, i - lookbackWindow), i);
    const recentHigh = Math.max(...recentSlice);
    const price = prices[i];
    if (price < recentHigh * (1 - dipThreshold)) {
        return "buy";
    }
    return "none";
};

export const strategyAlgorithms: Record<string, StrategyAlgorithm> = {
    "buy_and_hold": buyAndHold,
    "buy_everyday": buyEveryday,
    "buy_after_3_down": buyAfter3ConsecutiveDownDays,
    "buy_the_dip": buyTheDip
};
