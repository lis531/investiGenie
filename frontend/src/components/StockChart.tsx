"use client";
import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
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
            <motion.div 
                className={styles.loading}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                />
                <motion.p
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    Ładowanie danych giełdowych...
                </motion.p>
            </motion.div>
        );
    }

    if (error) {
        return (
            <motion.div 
                className={styles.error}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                Błąd: {error}
            </motion.div>
        );
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
                        size: 12
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
                position: 'right',
                grid: {
                    display: true,
                    color: 'rgba(156, 163, 175, 0.1)',
                },
                ticks: {
                    callback: function(value: any) {
                        return '$' + value.toFixed(2);
                    },
                    font: {
                        size: 12
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
                    weight: 'bold' as const
                },
                padding: 20,
                color: '#1f2937'
            },
            tooltip: {
                enabled: true,
                mode: 'nearest' as const,
                intersect: false,
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
                cornerRadius: 8,
                padding: 12,
                bodySpacing: 6,
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
        <motion.div 
            className={styles.chartContainer} 
            initial={{ scale: 0.95, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <motion.h1 
                className={styles.chartTitle}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                {currentSymbol} - Analiza Giełdowa
            </motion.h1>
            <div className={styles.controlsRow}>
                <motion.div 
                    className={styles.customSelectContainer}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
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
                        <motion.div 
                            className={styles.selectDropdown}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
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
                        </motion.div>
                    )}
                </div>
            </motion.div>

            <motion.form 
                onSubmit={handleSymbolSearch}
                className={styles.symbolSearch}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
            >
                <label className={styles.selectLabel}>Symbol</label>
                <div className={styles.symbolInputWrapper}>
                    <input
                        type="text"
                        value={symbolInput}
                        onChange={(e) => setSymbolInput(e.target.value.toUpperCase())}
                        placeholder="np. AAPL, TSLA"
                        className={styles.symbolInput}
                    />
                    <button type="submit" className={styles.searchBtn} disabled={fetchingData} title="Szukaj">
                        Szukaj
                    </button>
                </div>
            </motion.form>
            </div>
            
            <motion.div 
                className={styles.chartWrapper}
                key={chartKey}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: fetchingData ? 0.5 : 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
                {fetchingData && (
                    <div className={styles.fetchingOverlay}>
                        <motion.div
                            className={styles.fetchingSpinner}
                            animate={{ 
                                rotate: 360
                            }}
                            transition={{ 
                                duration: 1, 
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        />
                        <p className={styles.fetchingText}>Ładowanie...</p>
                    </div>
                )}
                <Chart type='candlestick' data={chartData} options={options} />
            </motion.div>

            <motion.div 
                className={styles.stats}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <motion.div 
                    className={styles.statItem}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.35 }}
                >
                    <span className={styles.statLabel}>Aktualna cena:</span>
                    <span 
                        className={styles.statValue}
                    >
                        ${stockData[0]?.price.toFixed(2)}
                    </span>
                </motion.div>
                <motion.div 
                    className={styles.statItem}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                >
                    <span className={styles.statLabel}>Dzienna zmiana:</span>
                    <span 
                        className={`${styles.statValue} ${stockData[0]?.change.includes('-') ? styles.negative : styles.positive}`}
                    >
                        {stockData[0]?.change}
                    </span>
                </motion.div>
                <motion.div 
                    className={styles.statItem}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.45 }}
                >
                    <span className={styles.statLabel}>Wolumen:</span>
                    <span className={styles.statValue}>{stockData[0]?.volume}</span>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
