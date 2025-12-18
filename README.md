# investiGenie
InvestiGenie to aplikacja do szybkiej analizy rynku i testowania prostych strategii inwestycyjnych. Backend (FastAPI) pobiera dane z Yahoo Finance przez `yfinance`, a frontend (Next.js) prezentuje wykresy świecowe oraz symulacje strategii.

## Kluczowe funkcje
- Podgląd świecowy spółek lub indeksów z zakresami 1d/1w/1m/1y i wyszukiwaniem symboli.
- Proxy API w Next.js, które łączy się z FastAPI (`/api/stock-data`).
- Symulacja strategii po stronie przeglądarki (kup i trzymaj, DCA, 3 dni spadków, kupowanie dołka) z konfiguracją początkowego kapitału i miesięcznych wpłat.
- Strona „Kontakt z Bogiem” jako lekka zabawa z formularzem.

## Wymagania
- Python 3.10+ (sprawdź `backend/requirements.txt`).
- Node.js 18+ i npm (Next.js 15).
- Dostęp do internetu dla pobierania danych z Yahoo Finance.

## Szybki start
1) Sklonuj repozytorium: `git clone https://github.com/lis531/investiGenie.git`

2) Backend (FastAPI)
```
cd backend
pip install -r requirements.txt
python -m uvicorn api_server:app --host 0.0.0.0 --port 8000 --reload
```

3) Frontend (Next.js)
```
cd frontend
npm install
# opcjonalnie ustaw adres backendu (domyślnie http://localhost:8000)
echo "PYTHON_API_URL=http://localhost:8000" > .env.local
npm run dev
```

4) Aplikacja jest dostępna pod adresem: [http://localhost:3000](http://localhost:3000)

## Backend API
- `GET /api/stock-data?range=1d|1w|1m|1y&symbol=^GSPC`
	- Pobiera dane z Yahoo Finance, zapisuje do `stock_data.csv` i zwraca JSON z polami: `success`, `data[]` (date, open, high, low, close, volume, change), `range`, `symbol`.
	- Zakres 1d używa danych intraday, pozostałe korzystają z serii dziennych.

### Przykład
```
curl "http://localhost:8000/api/stock-data?range=1m&symbol=AAPL"
```

## Frontend
- `/` – ekran powitalny.
- `/features` – wykres świecowy (komponent `StockChart`) z wyborem zakresu i symbolu oraz porównanie strategii (komponent `StrategyComparison`).
- `/contact_god` – formularz z żartobliwą „radą inwestycyjną”.

### Symulowane strategie (frontend)
- `buy_and_hold` – pojedynczy zakup na starcie.
- `buy_everyday` – cykliczne zakupy (DCA).
- `buy_after_3_down` – zakup po trzech kolejnych spadkach.
- `buy_the_dip` – zakup po spadku o 5% od ostatniego maksimum.

## Struktura
- `backend/api_server.py` – FastAPI z endpointem `/api/stock-data`.
- `backend/api_data.py` – pobieranie danych z Yahoo Finance.
- `backend/algorithms.py`, `backend/simulator.py` – algorytmy i symulator (używane pomocniczo, symulacje w UI są frontowe).
- `frontend/src/app/api/stock-data/route.ts` – proxy do backendu (ustaw `PYTHON_API_URL`).
- `frontend/src/components/StockChart.tsx`, `StrategyComparison.tsx` – główne widoki danych.

## Przydatne informacje
- Domyślny symbol to `^GSPC` (S&P 500). Możesz podać dowolny ticker obsługiwany przez Yahoo Finance (np. AAPL, TSLA, MSFT).
- Backend zapisuje ostatnie pobrane dane do `stock_data.csv` w katalogu `backend`.
- Jeśli frontend nie pobiera danych, upewnij się, że backend działa i adres w `PYTHON_API_URL` jest poprawny.
