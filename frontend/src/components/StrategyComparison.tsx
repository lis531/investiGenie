"use client";
import React, { useEffect, useState } from 'react';
import { strategyAlgorithms } from '../utils/strategyAlgorithms';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    TimeScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import styles from './StrategyComparison.module.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    TimeScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface Strategy {
    id: string;
    name: string;
    description: string;
    final_value: number;
    total_invested: number;
    profit: number;
    profit_percentage: number;
    shares_owned: number;
    cash_remaining: number;
    portfolio_history: Array<{
        date: string;
        value: number;
        invested: number;
        profit: number;
    }>;
}

interface StrategyData {
    success: boolean;
    strategies: Strategy[];
    symbol: string;
    start_cash: number;
    monthly_cash: number;
    simulation_days: number;
}

const strategyColors = [
    { border: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)' },
    { border: '#10b981', background: 'rgba(16, 185, 129, 0.1)' },
    { border: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)' },
    { border: '#ef4444', background: 'rgba(239, 68, 68, 0.1)' },
];

const strategyMetadata: Record<string, { name: string; description: string }> = {
    "buy_and_hold": {
        name: "Kup i Trzymaj",
        description: "Jednorazowy zakup na początku i długoterminowe trzymanie"
    },
    "buy_everyday": {
        name: "DCA - Dollar Cost Averaging",
        description: "Regularne zakupy w stałych odstępach czasu"
    },
    "buy_after_3_down": {
        name: "3 Dni Spadków",
        description: "Kupuj po trzech kolejnych dniach spadków"
    },
    "buy_the_dip": {
        name: "Kup na Spadku",
        description: "Kupuj gdy cena spadnie o 5% od ostatniego szczytu"
    }
};

export default function StrategyComparison() {
    const [strategyData, setStrategyData] = useState<StrategyData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
    const [symbolInput, setSymbolInput] = useState('^GSPC');
    const [startCash, setStartCash] = useState('10000');
    const [monthlyCash, setMonthlyCash] = useState('1000');

    useEffect(() => {
        fetchStrategies();
    }, []);

    const fetchStrategies = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Fetch 1 year of daily stock data
            const response = await fetch(`/api/stock-data?range=1y&symbol=${symbolInput}`);
            const result = await response.json();

            if (!result.success || !result.data || result.data.length < 10) {
                setError('Not enough data for simulation');
                return;
            }

            // Extract prices and dates (last 252 trading days)
            const stockData = result.data.slice(-252);
            const prices = stockData.map((d: any) => d.price);
            const dates = stockData.map((d: any) => d.date);
            
            const startCashNum = parseFloat(startCash);
            const monthlyCashNum = parseFloat(monthlyCash);

            // Simulate each strategy
            const strategies: Strategy[] = [];
            
            for (const [strategyId, algorithmFunc] of Object.entries(strategyAlgorithms)) {
                const exposureValue = strategyId === "buy_and_hold" ? 1.0 : 0.1;
                
                const portfolioHistory = [];
                let tempCash = startCashNum;
                let tempQuantity = 0;
                let tempInvested = startCashNum;
                
                for (let i = 0; i < prices.length; i++) {
                    const price = prices[i];
                    
                    // Add monthly contribution every 21 days
                    if (i % 21 === 0 && i > 0) {
                        tempCash += monthlyCashNum;
                        tempInvested += monthlyCashNum;
                    }
                    
                    // Execute strategy
                    const orderType = algorithmFunc(i, prices, startCashNum, monthlyCashNum, tempCash);
                    
                    // Calculate order quantity
                    const orderQuantity = (tempCash * exposureValue) / price;
                    
                    if (orderType === "buy" && tempCash >= price * orderQuantity) {
                        tempCash -= price * orderQuantity;
                        tempQuantity += orderQuantity;
                    }
                    
                    // Calculate current portfolio value
                    const currentValue = tempCash + (tempQuantity * price);
                    portfolioHistory.push({
                        date: dates[i] || "",
                        value: Math.round(currentValue * 100) / 100,
                        invested: Math.round(tempInvested * 100) / 100,
                        profit: Math.round((currentValue - tempInvested) * 100) / 100
                    });
                }
                
                // Final values
                const finalPrice = prices[prices.length - 1];
                const stockValue = tempQuantity * finalPrice;
                const totalValue = tempCash + stockValue;
                const profit = totalValue - tempInvested;
                const profitPercentage = tempInvested > 0 ? (profit / tempInvested * 100) : 0;
                
                strategies.push({
                    id: strategyId,
                    name: strategyMetadata[strategyId]?.name || strategyId,
                    description: strategyMetadata[strategyId]?.description || '',
                    final_value: Math.round(totalValue * 100) / 100,
                    total_invested: Math.round(tempInvested * 100) / 100,
                    profit: Math.round(profit * 100) / 100,
                    profit_percentage: Math.round(profitPercentage * 100) / 100,
                    shares_owned: Math.round(tempQuantity * 10000) / 10000,
                    cash_remaining: Math.round(tempCash * 100) / 100,
                    portfolio_history: portfolioHistory
                });
            }

            setStrategyData({
                success: true,
                strategies,
                symbol: symbolInput,
                start_cash: startCashNum,
                monthly_cash: monthlyCashNum,
                simulation_days: prices.length
            });
            setSelectedStrategies(strategies.map(s => s.id));
        } catch (err) {
            setError('Network error');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSimulate = (e: React.FormEvent) => {
        e.preventDefault();
        fetchStrategies();
    };

    const toggleStrategy = (strategyId: string) => {
        setSelectedStrategies(prev =>
            prev.includes(strategyId)
                ? prev.filter(id => id !== strategyId)
                : [...prev, strategyId]
        );
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner} />
                <p>Analizowanie strategii inwestycyjnych...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.error}>
                Błąd: {error}
            </div>
        );
    }

    if (!strategyData) return null;

    const selectedStrategyData = strategyData.strategies.filter(s => 
        selectedStrategies.includes(s.id)
    );

    const chartData = {
        labels: selectedStrategyData[0]?.portfolio_history.map(h => h.date) || [],
        datasets: selectedStrategyData.map((strategy, index) => ({
            label: strategy.name,
            data: strategy.portfolio_history.map(h => h.value),
            borderColor: strategyColors[index % strategyColors.length].border,
            backgroundColor: strategyColors[index % strategyColors.length].background,
            borderWidth: 3,
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
        }))
    };

    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: { size: 14, weight: '600', family: '"DM Sans", sans-serif' },
                    padding: 15,
                    usePointStyle: true,
                }
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#1e293b',
                bodyColor: '#475569',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                padding: 12,
                displayColors: true,
                callbacks: {
                    label: function(context: any) {
                        const strategy = selectedStrategyData[context.datasetIndex];
                        const historyPoint = strategy.portfolio_history[context.dataIndex];
                        return [
                            `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`,
                            `Zysk: $${historyPoint.profit.toFixed(2)}`
                        ];
                    }
                }
            }
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'month',
                    displayFormats: {
                        month: 'MMM yyyy'
                    }
                },
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value: any) {
                        return '$' + value.toLocaleString();
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            }
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>
                Porównanie Strategii Inwestycyjnych
            </h2>

            <form 
                className={`card ${styles.controls}`}
                onSubmit={handleSimulate}
            >
                <div className={styles.inputGroup}>
                    <label>Symbol akcji</label>
                    <input
                        type="text"
                        value={symbolInput}
                        onChange={(e) => setSymbolInput(e.target.value.toUpperCase())}
                        placeholder="np. AAPL, ^GSPC"
                        className="input"
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label>Początkowy kapitał ($)</label>
                    <input
                        type="number"
                        value={startCash}
                        onChange={(e) => setStartCash(e.target.value)}
                        className="input"
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label>Miesięczna wpłata ($)</label>
                    <input
                        type="number"
                        value={monthlyCash}
                        onChange={(e) => setMonthlyCash(e.target.value)}
                        className="input"
                    />
                </div>
                <button type="submit" className="btn-primary">
                    Symuluj
                </button>
            </form>

            <div className={styles.strategiesGrid}>
                {strategyData.strategies.map((strategy, index) => (
                    <div
                        key={strategy.id}
                        className={`card ${styles.strategyCard} ${selectedStrategies.includes(strategy.id) ? styles.selected : ''}`}
                        onClick={() => toggleStrategy(strategy.id)}
                    >
                        <div 
                            className={`${styles.colorIndicator} ${styles[`color${index}`]}`}
                        />
                        <h3>{strategy.name}</h3>
                        <p className={styles.description}>{strategy.description}</p>
                        <div className={styles.stats}>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Wartość końcowa</span>
                                <span className={styles.statValue}>${strategy.final_value.toLocaleString()}</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Zysk</span>
                                <span className={`${styles.statValue} ${strategy.profit >= 0 ? styles.positive : styles.negative}`}>
                                    ${strategy.profit.toLocaleString()} ({strategy.profit_percentage.toFixed(2)}%)
                                </span>
                            </div>
                        </div>
                        <div className={styles.checkbox}>
                            {selectedStrategies.includes(strategy.id) && '✓'}
                        </div>
                    </div>
                ))}
            </div>

            {selectedStrategyData.length > 0 && (
                <div className={styles.chartContainer}>
                    <h3>Wzrost wartości portfela w czasie</h3>
                    <div className={styles.chartWrapper}>
                        <Line data={chartData} options={options} />
                    </div>
                </div>
            )}
        </div>
    );
}

