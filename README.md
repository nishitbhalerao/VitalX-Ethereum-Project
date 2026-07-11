# VitalX-Ethereum-Project
# VitalX Ethereum Project

VitalX is a React + Vite application that demonstrates a healthcare records dashboard with:
- Privy authentication and embedded wallet
- IPFS file uploads via Pinata
- Record persistence in Supabase
- A sample Solidity contract (`Contract/HealthRecord.sol`)

## Quick Start
- Requirements: Node.js 18+, npm
- Install: `npm install`
- Run dev: `npm run dev` then open the printed `http://localhost:5173` (or the next available port)
- Build: `npm run build`
- Preview production build: `npm run preview`

## Configuration
The project includes placeholder credentials in source code. For security, move secrets to environment variables before deploying:

- Integrate these in code using `import.meta.env.VITE_*`.
  - Update `src/main.jsx` to use `import.meta.env.VITE_PRIVY_APP_ID`.
  - Update `src/pinataUpload.js` to use `import.meta.env.VITE_PINATA_JWT`.
  - Update `src/supabaseClient.js` to use `import.meta.env.VITE_SUPABASE_URL` and `import.meta.env.VITE_SUPABASE_ANON_KEY`.

## Features
- Connect/Disconnect wallet using Privy
- Upload health record files to IPFS (Pinata) and save metadata to Supabase
- View a table of uploaded records with filename, date, and access fields
- Copy wallet address and export private key (with a confirm step)

## Directory Structure
- `index.html` — App entry (loads `src/main.jsx`)
- `vite.config.js` — Vite configuration
- `src/` — React source
  - `main.jsx` — App bootstrap, routing, and `PrivyProvider`
  - `App.jsx` — Wallet connect UI
  - `Landingpage.jsx`, `login.jsx`, `SignUpPage.jsx` — Pages
  - `patitent.jsx` — Patient dashboard (Pinata + Supabase integration)
  - `pinataUpload.js` — IPFS upload helper
  - `supabaseClient.js` — Supabase client
  - `*.css` — Component styles
- `Contract/HealthRecord.sol` — Example Solidity contract

## Scripts
- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — Production build to `dist/`
- `npm run preview` — Preview `dist/` locally

## Troubleshooting
- “Failed to load url /src/main.jsx”: Ensure commands are run inside the project folder:
  - `cd VitalX-Ethereum-Project` then `npm run dev`
  - Confirm `index.html` exists in the project folder and references `/src/main.jsx`.
- Windows case-collision warning after clone: The repo contained files that differ only by case (e.g., `Login.jsx` vs `login.jsx`). On Windows, only one variant is kept; use the present lowercase files in `src/`.
- Ports 5173/5174/5175 in use: Vite picks the next available port automatically; use the URL shown in the terminal.

## Security
- Do not commit secrets (Privy App ID, Pinata JWT, Supabase keys).
- Prefer environment variables via `VITE_*` and ensure `.env` isn’t checked into version control for production.

## Tech Stack
- React 18, React Router
- Vite
- Privy SDK
- Axios
- Supabase JS
- lucide-react (icons)
