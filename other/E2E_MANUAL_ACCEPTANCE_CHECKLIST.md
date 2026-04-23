# InvestiGenie - Manualne testy E2E

## Cel
Checklist akceptacyjny do recznej weryfikacji calej aplikacji (frontend + backend) z perspektywy uzytkownika koncowego.

## Srodowisko testowe
- Frontend uruchomiony lokalnie (domyslnie `http://localhost:3000`)
- Backend uruchomiony lokalnie (domyslnie `http://localhost:8000`)
- Dostep do internetu (pobieranie danych rynkowych)
- Przegladarki: Chrome (wymagane), Firefox/Safari (zalecane)

## Dane testowe
- Symbole poprawne: `^GSPC`, `AAPL`, `MSFT`, `TSLA`
- Symbol bledny: `INVALID123`

## 1) Smoke test i uruchomienie
- [ ] Aplikacja frontend otwiera sie bez bledu pod `/`.
- [ ] Widoczny jest globalny pasek nawigacji oraz stopka na kazdej podstronie.
- [ ] Nie wystepuja bledy krytyczne w konsoli przegladarki podczas wejscia na `/`, `/features`, `/contact_god`.
- [ ] Wejscie na `/features` laduje komponent wykresu oraz komponent porownania strategii.
- [ ] Backend odpowiada na zapytanie `GET /api/stock-data` i zwraca `success: true` dla poprawnego symbolu.

## 2) Nawigacja i routing
- [ ] Klikniecie "Strona Glowna" przenosi na `/`.
- [ ] Klikniecie "Funkcje" przenosi na `/features`.
- [ ] Klikniecie "Kontakt z Bogiem" przenosi na `/contact_god`.
- [ ] Aktywny element menu jest wizualnie wyrozniony zgodnie z aktualna trasa.
- [ ] Nawigacja dziala poprawnie po odswiezeniu strony na kazdej trasie (brak bledow hydracji, brak utraty layoutu).

## 3) Strona glowna (`/`)
- [ ] Widoczny jest tytul "Witaj na InvestiGenie" oraz opis narzedzia.
- [ ] Widoczne sa 3 karty funkcji (Analiza, Strategie, Rekomendacje).
- [ ] Animacja wejscia strony wykonuje sie plynnie i nie blokuje interakcji.
- [ ] Uklad strony jest czytelny na desktopie oraz na mobilu.

## 4) Wykres swiecowy (`/features` -> StockChart)
- [ ] Przy pierwszym wejsciu widoczny jest stan ladowania danych gieldowych.
- [ ] Po zaladowaniu widoczny jest wykres swiecowy dla domyslnego symbolu `^GSPC`.
- [ ] Tytul wykresu odzwierciedla aktualnie wybrany symbol.
- [ ] Zmiana zakresu czasu na `1d`, `1w`, `1m`, `1y` odswieza dane i wykres bez crasha.
- [ ] Wpisanie poprawnego symbolu (np. `AAPL`) i wyszukanie odswieza wykres dla nowego symbolu.
- [ ] Tooltip na swiecy pokazuje: otwarcie, najwyzsza, najnizsza, zamkniecie i procentowa zmiane.
- [ ] Dla zakresu `1d` etykiety osi X pokazuja czas (HH:MM), dla pozostalych zakresow pokazuja date/miesiac.
- [ ] W przypadku problemu z API widoczny jest czytelny komunikat bledu (bez zawieszenia UI).
- [ ] Po ponownej probie (zmiana zakresu/symbolu) komponent wraca do poprawnego stanu po odzyskaniu polaczenia.

## 5) Porownanie strategii (`/features` -> StrategyComparison)
- [ ] Przy pierwszym wejsciu widoczny jest stan ladowania symulacji strategii.
- [ ] Domyslnie ladowane sa dane dla symbolu `^GSPC`.
- [ ] Formularz przyjmuje parametry: symbol, poczatkowy kapital, miesieczna wplata.
- [ ] Klikniecie "Symuluj" uruchamia ponowne przeliczenie wynikow bez odswiezania calej strony.
- [ ] Widoczne sa karty wszystkich strategii: buy_and_hold, buy_everyday, buy_after_3_down, buy_the_dip (z lokalnymi nazwami).
- [ ] Kazda karta pokazuje wartosc koncowa i zysk (kwotowo + procentowo).
- [ ] Klikniecie karty strategii przelacza jej zaznaczenie (widoczny check/stan selected).
- [ ] Wykres liniowy pokazuje tylko aktualnie zaznaczone strategie.
- [ ] Odznaczenie wszystkich strategii ukrywa wykres (brak pustego/uszkodzonego wykresu).
- [ ] Dla blednego symbolu lub zbyt malej ilosci danych pojawia sie czytelny blad "Not enough data for simulation" lub blad sieci.
- [ ] Ponowna symulacja po bledzie (z poprawnym symbolem) przywraca poprawne wyniki.

## 6) Strona kontaktowa (`/contact_god`)
- [ ] Formularz zawiera pola: imie, email, pytanie o inwestycje.
- [ ] Pola formularza maja walidacje wymagania (`required`) i nie pozwalaja wyslac pustego formularza.
- [ ] Pole email egzekwuje poprawny format adresu email.
- [ ] Po wyslaniu formularza widoczny jest blok "Odpowiedz od Boga".
- [ ] Odpowiedz zawiera jednoznaczny wynik `TAK` lub `NIE` oraz komunikat tekstowy.
- [ ] Dla tej samej tresci pytania wynik jest deterministyczny (powtarzalny po ponownym wyslaniu).
- [ ] Zmiana tresci pytania moze zmienic wynik (hash-based decision).

## 7) Integracja FE <-> API
- [ ] Endpoint frontendowy `/api/stock-data` poprawnie proxyfikuje zapytania do backendu.
- [ ] Dla poprawnego zapytania frontend otrzymuje dane z polami: date, open, high, low, price, volume, change.
- [ ] Dla bledu backendu endpoint frontendowy zwraca `success: false` i kod bledu 500.
- [ ] CORS nie blokuje standardowego przeplywu danych miedzy frontendem i backendem na localhost.

## 8) Odpornosc i przypadki brzegowe
- [ ] Wpisanie symbolu z malymi literami (np. `aapl`) prowadzi do poprawnego wyszukania (normalizacja/obsluga po stronie UI/API).
- [ ] Szybkie, wielokrotne zmiany zakresu czasu nie psuja stanu komponentu wykresu.
- [ ] Tymczasowy brak internetu/backendu nie powoduje bialej strony ani nieodwracalnego stanu aplikacji.
- [ ] Po przywroceniu backendu kluczowe funkcje (`StockChart`, `StrategyComparison`) odzyskuja dzialanie bez restartu frontendu.

## 9) Responsywnosc i UX
- [ ] Widoki `/`, `/features`, `/contact_god` sa uzywalne na szerokosciach: 360px, 768px, 1280px.
- [ ] Formularze i przyciski sa klikalne na urzadzeniach dotykowych (brak nachodzenia elementow).
- [ ] Tresc kart i wykresow nie wychodzi poza kontener na mobilu.
- [ ] Kluczowe CTA i dane sa czytelne bez zoomowania na ekranie telefonu.

## 10) Akceptacja koncowa (Go/No-Go)
- [ ] Wszystkie testy krytyczne (routing, wykres, symulacje, formularz kontaktowy) zakonczone pozytywnie.
- [ ] Brak blockerow i bledow krytycznych.
- [ ] Ewentualne usterki sa udokumentowane i zaakceptowane do poprawki po wdrozeniu.
- [ ] Produkt spelnia kryteria demo i jest gotowy do prezentacji/uzycia.

## Podsumowanie wykonania
- [ ] Testy zakonczone
- [ ] Raport bledow uzupelniony
- [ ] Decyzja: GO
- [ ] Decyzja: NO-GO
