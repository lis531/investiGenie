def buy_after_3_consecutive_down_days(i:int, prices: list[float], start_cash: float, monthly_cash: float, cash:float):
    if i >= 3:
        price = prices[i]
        three_days_ago = prices[i - 3]
        two_days_ago = prices[i - 2]
        yesterday = prices[i - 1]
        if three_days_ago > two_days_ago > yesterday > price:
            return "buy", monthly_cash / price
    return "none", 0

def buy_one_everyday(i:int, prices: list[float], start_cash: float, monthly_cash: float, cash:float):
    return "buy", 1