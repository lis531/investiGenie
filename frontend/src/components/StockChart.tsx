"use client";
import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import styles from './StockChart.module.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface StockData {
    date: string;
    price: number;
    open: number;
    high: number;
    low: number;
    volume: string;
    change: string;
}

export default function StockChart() {
    const [stockData, setStockData] = useState<StockData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchStockData();
    }, []);

    const fetchStockData = async () => {
        try {
            const response = await fetch('/api/stock-data');
            const result = await response.json();

            if (result.success) {
                setStockData(result.data);
            } else {
                setError('Failed to fetch data');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className={styles.loading}>Ładowanie danych giełdowych...</div>;
    }

    if (error) {
        return <div className={styles.error}>Błąd: {error}</div>;
    }

    const chartData = {
        labels: stockData.map(item => {
            const date = new Date(item.date);
            return date.toLocaleDateString('pl-PL', {
                month: 'short',
                day: 'numeric'
            });
        }).reverse(),
        datasets: [
            {
                label: 'Cena zamknięcia',
                data: stockData.map(item => item.price).reverse(),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointBorderColor: '#fff',
                pointHoverRadius: 6,
                pointRadius: 4,
            },
            {
                label: 'Cena otwarcia',
                data: stockData.map(item => item.open).reverse(),
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 2,
                fill: false,
                tension: 0.4,
                pointBackgroundColor: 'rgb(16, 185, 129)',
                pointBorderColor: '#fff',
                pointHoverRadius: 6,
                pointRadius: 3,
            }
        ],
    };

    const options = {
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 14,
                    }
                }
            },
            title: {
                display: true,
                text: 'S&P 500 - Analiza Cen',
                font: {
                    size: 18,
                    weight: 'bold' as const
                },
                padding: 20
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
                cornerRadius: 8,
                padding: 12,
                callbacks: {
                    label: function (context: any) {
                        const datasetLabel = context.dataset.label || '';
                        const value = context.parsed.y;
                        return `${datasetLabel}: $${value.toFixed(2)}`;
                    },
                    afterBody: function (tooltipItems: any) {
                        const index = tooltipItems[0].dataIndex;
                        const reversedIndex = stockData.length - 1 - index;
                        const data = stockData[reversedIndex];
                        return [
                            `Najwyższa: $${data.high}`,
                            `Najniższa: $${data.low}`,
                            `Wolumen: ${data.volume}`,
                            `Zmiana: ${data.change}`
                        ];
                    }
                }
            }
        },
        
        interaction: {
            mode: 'nearest' as const,
            axis: 'x' as const,
            intersect: false,
        },
    };

    return (
        <motion.div className={styles.chartContainer} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}>
            <div className={styles.chartWrapper}>
                <Line data={chartData} options={options} />
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
        </motion.div>
    );
}