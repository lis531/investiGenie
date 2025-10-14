import matplotlib.pyplot as plt
import numpy as np

def show_plot(prices, dates):
    ypoints = np.array(prices)
    xpoints = np.array(dates)
    print(dates)

    plt.plot(xpoints, ypoints)
    plt.xticks(rotation=45)
    plt.tight_layout()

    plt.xlabel("Date")
    plt.ylabel("Price")
    plt.title("Stock Prices Over Time")
    plt.subplots_adjust(top=0.9)
    plt.show()