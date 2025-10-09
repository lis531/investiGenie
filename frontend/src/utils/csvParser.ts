import fs from 'fs';
import path from 'path';

export interface StockData {
  date: string;
  price: number;
  open: number;
  high: number;
  low: number;
  volume: string;
  change: string;
}

export function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

export function formatDate(dateStr: string): string {
  const [month, day, year] = dateStr.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

export async function readStockDataFromCSV(): Promise<StockData[]> {
  try {
    const csvPath = path.join(process.cwd(), '..', 'backend', 'toy_s&p500.csv');
    
    if (!fs.existsSync(csvPath)) {
      throw new Error(`CSV file not found at: ${csvPath}`);
    }
    
    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');
    
    const dataLines = lines.slice(1);
    
    const stockData: StockData[] = dataLines.map(line => {
      const columns = parseCSVLine(line);
      
      if (columns.length < 7) {
        throw new Error(`Invalid CSV line: ${line}`);
      }
      
      return {
        date: formatDate(columns[0].replace(/"/g, '')),
        price: parseFloat(columns[1].replace(/"/g, '')),
        open: parseFloat(columns[2].replace(/"/g, '')),
        high: parseFloat(columns[3].replace(/"/g, '')),
        low: parseFloat(columns[4].replace(/"/g, '')),
        volume: columns[5].replace(/"/g, ''),
        change: columns[6].replace(/"/g, '')
      };
    });
    
    return stockData;
  } catch (error) {
    console.error('Error reading CSV file:', error);
    throw error;
  }
}