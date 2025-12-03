import numpy as np
def buy_after_3_consecutive_down_days(i:int, prices: list[float]):
    if i >= 3:
        price = prices[i]
        three_days_ago = prices[i - 3]
        two_days_ago = prices[i - 2]
        yesterday = prices[i - 1]
        if three_days_ago > two_days_ago > yesterday > price:
            return "buy",
    return "hold",

def buy_everyday(i:int, prices: list[float]):
    return "buy",

def buy_and_hold(i:int, prices: list[float]):
    if i==0:
        return "buy",
    return "hold",

def buy_the_dip(i:int, prices:list[float], dip_threshold:float=0.05, lookback_window:int=10):
    if i < 1:
        return "hold",
    recent_high = max(prices[max(0, i - lookback_window):i])
    price = prices[i]
    if price < recent_high * (1 - dip_threshold):
        return "buy",
    return "hold",

def moving_average_crossover(current_day: int, prices: list[float], lookback_windows: tuple[int, int] = (20, 5)):
    longer_avg_len = max(lookback_windows)
    shorter_avg_len = min(lookback_windows)

    if current_day >= longer_avg_len:
        # previous averages (shifted one day earlier)
        previous_longer_avg = sum(prices[current_day - longer_avg_len - 1 : current_day - 1]) / longer_avg_len
        previous_shorter_avg = sum(prices[current_day - shorter_avg_len - 1 : current_day - 1]) / shorter_avg_len

        # current averages
        longer_avg = sum(prices[current_day - longer_avg_len : current_day]) / longer_avg_len
        shorter_avg = sum(prices[current_day - shorter_avg_len : current_day]) / shorter_avg_len

        # crossover condition
        if previous_longer_avg > previous_shorter_avg and longer_avg < shorter_avg:  # shift to uptrend
            return "buy",


    return "hold",
def reversal_after_a_decline(current_day:int, prices: list[float], downtrend_length:int = 5):
    if current_day >= downtrend_length:
        price = prices[current_day]
        previous_prices = prices[current_day - downtrend_length : current_day]
        is_downtrend = False
        for i in range(1, len(previous_prices)):
            if previous_prices[i] >= previous_prices[i - 1]:
                break
        else:
            is_downtrend = True
        if is_downtrend and price > previous_prices[-1]:
            return "buy",
    return "hold",


