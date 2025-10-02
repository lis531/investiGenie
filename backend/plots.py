import matplotlib.pyplot as plt
import numpy as np

def show_plot(data):
    ypoints = np.array(data)

    plt.plot(ypoints)
    plt.show()