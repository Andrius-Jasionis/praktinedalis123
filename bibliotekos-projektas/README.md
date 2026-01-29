# Bibliotekos knygų rezervacijos sistema

Moderni web aplikacija, skirta bibliotekos knygų valdymui ir rezervavimui.

## Technologijos
- **Frontend**: React, Vite, Lucide Icons
- **Backend**: Node.js, Express
- **Duomenų bazė**: SQLite
- **Autentifikacija**: JWT, BCryptJS

## Vertinimo kriterijų realizacija

### 1. Duomenų bazės projektavimas
Naudojama SQLite su šiomis lentelėmis:
- `categories`: kategorijų sąrašas.
- `books`: knygų informacija (su ryšiu į `categories`).
- `users`: vartotojai ir jų rolės.
- `reservations`: ryšys tarp vartotojų ir rezervuotų knygų.

### 2. Administracinė dalis
Pasiekiama per `/admin` (tik administratoriams):
- **Knygų pridėjimas**: Forma su validacija.
- **Valdymas**: Galimybė redaguoti esamus duomenis arba šalinti knygas.

### 3. Kliento dalis
- **Registracija/Prisijungimas**: Vartotojų autentifikacija.
- **Paieška**: Vieša knygų paieška pagal kategorijas.
- **Rezervacija**: Prisijungę vartotojai gali rezervuoti knygas.

## Kaip paleisti
1. **Backend**: 
   ```bash
   cd backend
   npm install
   npm start
   ```
2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
