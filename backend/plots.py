import matplotlib.pyplot as plt
import numpy as np

def stock_plot(prices, dates):
    ypoints = np.array(prices)
    xpoints = np.array(dates)
    # print(dates)

    plt.plot(xpoints, ypoints)
    plt.xticks(rotation=45)
    plt.tight_layout()

    plt.xlabel("Date")
    plt.ylabel("Price")
    plt.title("Stock Prices Over Time")
    plt.subplots_adjust(top=0.9)
    plt.show()

def algorithm_plot(results):
    ypoints = np.array(list(results.values()))
    xpoints = np.array(list(results.keys()))

    plt.plot(xpoints, ypoints)
    plt.xlabel("Duration[days]")
    plt.ylabel("Profit[USD]")
    plt.title("Algorithm average profit over time")
    plt.subplots_adjust(top=0.9)
    plt.show()
# algorithm_plot({10: 0.46, 20: 2.01, 30: 2.65, 40: 5.79, 50: 8.0, 60: 6.4, 70: 11.81}) #test
