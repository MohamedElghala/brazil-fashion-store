---
name: brazil-ecommerce-deployer
description: >
  Autonomous end-to-end workflow for developing, validating, and deploying
  Brazilian e-commerce applications (Next.js, Pix BACEN, Correios, CPF, Vercel).
---

# Brazil E-Commerce & Vercel Deployment Workflow

This skill encapsulates the battle-tested, end-to-end methodology for building, auditing, and deploying high-conversion Brazilian e-commerce stores.

## 1. Brazilian Localization & Legal Compliance (pt-BR 100%)
- **Zero Foreign Strings:** All customer-facing copy must be natural Brazilian Portuguese (`pt-BR`).
- **Currency & Installments:** Format prices in BRL (`R$ 159,90`). Support credit card parcelamento (e.g., *12x de R$ 14,90 sem juros*) and Pix discount (e.g., *5% de desconto no Pix*).
- **Mandatory Legal Footers (Federal Decrees):**
  - Decreto Federal nº 7.962/2013 (E-commerce law): Visible corporate name, CNPJ format `XX.XXX.XXX/0001-XX`, physical address, and direct contact channels.
  - LGPD (Lei nº 13.709/2018): Privacy policy route `/politica-de-privacidade`.
  - CDC Art. 49 (Direito de Arrependimento): 7-day return policy route `/trocas-e-devolucoes`.

## 2. Payments & Fiscal Engine
- **BACEN Pix Generation:**
  - Generate compliant EMVCo payloads (Payload Format Indicator `000201`, Merchant Account `0125<chave>`, Merchant Category `52040000`, Transaction Currency `5303986`, CRC16 `6304XXXX`).
  - Provide dynamic QR Code and a single-click "Copia e Cola" code.
- **CPF Validation:**
  - Enforce official Modulo 11 checksum calculation on customer CPF to reject invalid numbers before checkout.
- **Correios & ViaCEP Shipping:**
  - Fetch address details by 8-digit CEP from ViaCEP (`https://viacep.com.br/ws/{cep}/json/`).
  - Calculate PAC and SEDEX rates with configurable free shipping thresholds.

## 3. Serverless Zero-Crash Architecture
- On serverless platforms like Vercel, avoid native binary dependencies (e.g. SQLite `.node` binaries compiled on Windows that fail on Linux serverless).
- Use a pure TypeScript resilient in-memory/JSON data layer (`src/lib/dataStore.ts`) to guarantee sub-millisecond responses and 100% uptime across environments.

## 4. Windows-to-Linux Vercel Build Resolution
When building Next.js projects on Windows for deployment to Vercel:
1. Windows NTFS symlinks inside `.vercel/output/functions` contain backslashes (`\`), causing `ENOENT` on Linux Vercel runtimes.
2. Run `node scripts/fix-vercel-functions.js` before deploying to resolve symlinks into physical directories using `fs.realpathSync`.
3. Embed `.next/server/app`, `chunks`, and `webpack-runtime.js` inside each `.func` directory.
4. Keep the total function count below 20 for anonymous preview deployments, or connect a permanent Vercel account (`vercel login`) for production.

## 5. Automated Verification
- Verify all routes return HTTP 200 via automated HTTP/Puppeteer checks:
  - Homepage (`/`)
  - Product details (`/produto/[slug]`)
  - Categories (`/categoria/[slug]`)
  - Cart & Checkout (`/checkout`)
  - Order tracking (`/rastreio`)
  - Admin dashboard (`/admin`)
- Create test orders and verify Pix payload generation.
- Save permanent documentation in `PROJECT_STATE.md`.
