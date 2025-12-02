"use client";
import React, { useEffect, useState } from 'react';
 
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    TimeScale,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
import { Chart } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import styles from './StockChart.module.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    TimeScale,
    CandlestickController,
    CandlestickElement,
    Title,
    Tooltip,
    Legend
);

interface StockData {
    date: string;
    price: number;
    open: number;
    high: number;
    low: number;
    volume: string;
    change: string;
    file_name: string;
}

const timeRanges = {
    '1d': { label: '1 Dzień' },
    '1w': { label: '1 Tydzień' },
    '1m': { label: '1 Miesiąc' },
    '1y': { label: '1 Rok' }
};

export default function StockChart() {
    const [stockData, setStockData] = useState<StockData[]>([]);
    const [loading, setLoading] = useState(true);
    const [fetchingData, setFetchingData] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedRange, setSelectedRange] = useState('1d');
    const [symbolInput, setSymbolInput] = useState('^GSPC');
    const [currentSymbol, setCurrentSymbol] = useState('^GSPC');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [chartKey, setChartKey] = useState(0);

    useEffect(() => {
        fetchStockData("1d");
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (!target.closest(`.${styles.customSelect}`)) {
                setDropdownOpen(false);
            }
        };

        if (dropdownOpen) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [dropdownOpen]);

    const fetchStockData = async (range: string, symbol?: string) => {
        try {
            setFetchingData(true);
            setError(null);
            const symbolParam = symbol || symbolInput;
            const response = await fetch(`/api/stock-data?range=${range}&symbol=${symbolParam}`);
            const result = await response.json();

            if (result.success) {
                setStockData(result.data);
                setCurrentSymbol(symbolParam);
                setChartKey(prev => prev + 1);
            } else {
                setError('Failed to fetch data');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
            setFetchingData(false);
        }
    };

    const handleSymbolSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (symbolInput.trim()) {
            fetchStockData(selectedRange, symbolInput.trim());
        }
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner} />
                <p>Ładowanie danych giełdowych...</p>
            </div>
        );
    }

    if (error) {
        return <div className={styles.error}>Błąd: {error}</div>;
    }

    const processedData = stockData
        .map(item => {
            let dateObj: Date;
            if (item.date.includes(' ')) {
                dateObj = new Date(item.date);
            } else {
                // Date only
                dateObj = new Date(item.date);
            }

            return {
                ...item,
                dateObj
            };
        })
        .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

    const candlestickData = processedData.map((item, index) => ({
        x: index,
        o: item.open,
        h: item.high,
        l: item.low,
        c: item.price,
        date: item.dateObj
    }));

    const chartLabels = processedData.map(item => item.dateObj.toISOString());

    const chartData: any = {
        labels: chartLabels,
        datasets: [
            {
                label: currentSymbol,
                data: candlestickData,
                color: {
                    up: 'rgb(16, 185, 129)',
                    down: 'rgb(239, 68, 68)',
                    unchanged: 'rgb(156, 163, 175)'
                },
                borderColor: 'rgb(17, 24, 39)',
                borderWidth: 1,
            }
        ],
    };

    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 1000,
            easing: 'easeInOutQuart',
            delay: (context: any) => {
                let delay = 0;
                if (context.type === 'data' && context.mode === 'default') {
                    delay = context.dataIndex * 5; // Stagger candles
                }
                return delay;
            },
        },
        transitions: {
            active: {
                animation: {
                    duration: 300
                }
            }
        },
        scales: {
            x: {
                type: 'category',
                grid: {
                    display: true,
                    color: 'rgba(156, 163, 175, 0.1)',
                    drawOnChartArea: true,
                },
                ticks: {
                    maxRotation: 0,
                    autoSkipPadding: 20,
                    font: {
                        size: 12,
                        family: '"DM Sans", sans-serif'
                    },
                    callback: function(value: any, index: number) {
                        const dataPoint = candlestickData[index];
                        if (!dataPoint || !(dataPoint.date instanceof Date)) {
                            return '';
                        }

                        const date = dataPoint.date;

                        if (selectedRange === '1d') {
                            return date.toLocaleTimeString('pl-PL', {
                                hour: '2-digit',
                                minute: '2-digit'
                            });
                        }

                        if (selectedRange === '1y') {
                            return date.toLocaleDateString('pl-PL', {
                                month: 'short'
                            });
                        }

                        return date.toLocaleDateString('pl-PL', {
                            month: 'short',
                            day: 'numeric'
                        });
                    }
                }
            },
            y: {
                position: 'left',
                grid: {
                    display: true,
                    color: 'rgba(156, 163, 175, 0.1)',
                },
                ticks: {
                    callback: function(value: any) {
                        return '$' + value.toFixed(2);
                    },
                    font: {
                        size: 12,
                        family: '"DM Sans", sans-serif'
                    }
                }
            }
        },
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: `${currentSymbol} - Wykres Świecowy`,
                font: {
                    size: 18,
                    weight: 'bold' as const,
                    family: '"DM Sans", sans-serif'
                },
                padding: 20,
                color: '#1f2937'
            },
            tooltip: {
                enabled: true,
                mode: 'nearest' as const,
                intersect: false,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#1e293b',
                bodyColor: '#475569',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                cornerRadius: 8,
                padding: 12,
                bodySpacing: 6,
                displayColors: true,
                callbacks: {
                    title: function(tooltipItems: any) {
                        const dataIndex = tooltipItems[0].dataIndex;
                        const dataPoint = candlestickData[dataIndex];
                        if (!dataPoint || !(dataPoint.date instanceof Date)) {
                            return '';
                        }

                        const date = dataPoint.date;
                        if (selectedRange === '1d') {
                            return date.toLocaleString('pl-PL', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            });
                        }

                        return date.toLocaleDateString('pl-PL', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        });
                    },
                    label: function(context: any) {
                        const data = context.raw;
                        const change = ((data.c - data.o) / data.o * 100).toFixed(2);
                        const changeSymbol = data.c >= data.o ? '+' : '';
                        
                        return [
                            `Otwarcie: $${data.o.toFixed(2)}`,
                            `Najwyższa: $${data.h.toFixed(2)}`,
                            `Najniższa: $${data.l.toFixed(2)}`,
                            `Zamknięcie: $${data.c.toFixed(2)}`,
                            `Zmiana: ${changeSymbol}${change}%`
                        ];
                    },
                    labelColor: function(context: any) {
                        const data = context.raw;
                        const isUp = data.c >= data.o;
                        const color = isUp ? 'rgb(16, 185, 129)' : 'rgb(239, 68, 68)';
                        return {
                            borderColor: color,
                            backgroundColor: color
                        };
                    }
                }
            }
        },
        interaction: {
            mode: 'nearest' as const,
            intersect: false,
            axis: 'xy' as const,
        },
    };

    return (
        <div className={styles.chartContainer}>
            <h2 className={styles.chartTitle}>
                {currentSymbol} - Analiza Giełdowa
            </h2>
            <div className={styles.controlsRow}>
                <div className={styles.customSelectContainer}>
                    <label className={styles.selectLabel}>Zakres czasowy</label>
                <div className={styles.customSelect}>
                    <div 
                        className={`${styles.selectButton} ${dropdownOpen ? styles.selectButtonOpen : ''}`}
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <span className={styles.selectValue}>
                            {timeRanges[selectedRange as keyof typeof timeRanges].label}
                        </span>
                        <svg 
                            className={`${styles.selectIcon} ${dropdownOpen ? styles.selectIconOpen : ''}`}
                            width="20" height="20" viewBox="0 0 20 20" fill="none"
                        >
                            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    
                    {dropdownOpen && (
                        <div 
                            className={styles.selectDropdown}
                        >
                            {Object.entries(timeRanges).map(([value, { label }]) => (
                                <div
                                    key={value}
                                    className={`${styles.selectOption} ${selectedRange === value ? styles.selectOptionSelected : ''}`}
                                    onClick={() => {
                                        setSelectedRange(value);
                                        setDropdownOpen(false);
                                        fetchStockData(value);
                                    }}
                                >
                                    {label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <form 
                onSubmit={handleSymbolSearch}
                className={styles.symbolSearch}
            >
                <label className={styles.selectLabel}>Symbol</label>
                <div className={styles.symbolInputWrapper}>
                    <input
                        type="text"
                        value={symbolInput}
                        onChange={(e) => setSymbolInput(e.target.value.toUpperCase())}
                        placeholder="np. AAPL, TSLA"
                        className="input"
                    />
                    <button type="submit" className="btn-primary" disabled={fetchingData}>
                        Szukaj
                    </button>
                </div>
            </form>
            </div>
            
            <div className={`${styles.chartWrapper} ${fetchingData ? styles.fetching : ''}`}>
                {fetchingData && (
                    <div className={styles.fetchingOverlay}>
                        <div className={styles.spinner} />
                        <p>Ładowanie...</p>
                    </div>
                )}
                <Chart type='candlestick' data={chartData} options={options} />
            </div>

            <div className={styles.stats}>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Aktualna cena:</span>
                    <span className={styles.statValue}>${stockData[0]?.price.toFixed(2)}</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Dzienna zmiana:</span>
                    <span className={`${styles.statValue} ${stockData[0]?.change.includes('-') ? styles.negative : styles.positive}`}>
                        {stockData[0]?.change}
                    </span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Wolumen:</span>
                    <span className={styles.statValue}>{stockData[0]?.volume}</span>
                </div>
            </div>
        </div>
    );
}
