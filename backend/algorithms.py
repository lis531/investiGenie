def buy_after_3_consecutive_down_days(i:int, prices: list[float], start_cash: float, monthly_cash: float, cash:float):
    if i >= 3:
        price = prices[i]
        three_days_ago = prices[i - 3]
        two_days_ago = prices[i - 2]
        yesterday = prices[i - 1]
        if three_days_ago > two_days_ago > yesterday > price:
            return "buy"
    return "none"

def buy_everyday(i:int, prices: list[float], start_cash: float, monthly_cash: float, cash:float):
    return "buy"

def buy_and_hold(i:int, prices: list[float], start_cash: float, monthly_cash: float, cash:float):
    if i==0:
        return "buy"
    return "none"

def buy_the_dip(i:int, prices:list[float], start_cash:float, monthly_cash:float, cash:float,  dip_threshold:float=0.05, lookback_window:int=10):
    if i < 1:
        return "none", 0
    recent_high = max(prices[max(0, i - lookback_window):i])
    price = prices[i]
    if price < recent_high * (1 - dip_threshold):
        return "buy"
    return "none"