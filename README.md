# OrbitGO – Frontend

💼 A multi-chain USDC DAO treasury dashboard powered by [1inch Portfolio API](https://portal.1inch.dev/documentation/apis/portfolio).

## 🧭 Project Overview

OrbitGO is a frontend dashboard designed for DAO treasury managers. It aggregates multi-chain portfolio data and focuses on managing USDC stablecoin assets. This frontend implementation uses the [1inch Portfolio API] to display real-time cross-chain asset distribution and protocol-based insights.

> 🔗 API Source: [1inch Portfolio API Documentation](https://portal.1inch.dev/documentation/apis/portfolio)

## 📦 Features

- Supports multi-chain portfolio viewing (Ethereum, Arbitrum, BNB Chain, Polygon, etc.)
- Displays real-time USD value per chain
- Categorizes protocols: native / stable / token
- Visualizes portfolio distribution and composition
- Supports mock JSON for development and UI testing

## 🖼️ Sample Response JSON

Based on `1response.json` provided:

```json
{
  "protocol_name": "native",
  "result": [
    { "chain_id": 1, "value_usd": 0.0 },
    { "chain_id": 56, "value_usd": 0.5604 },
    { "chain_id": 8453, "value_usd": 8.6028 },
    { "chain_id": 42161, "value_usd": 0.7044 }
  ]
}
```

## 🧰 Tech Stack

- **Framework**: React.js + TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Cloudflare Pages
- **Wallet Integration**: RainbowKit + Wagmi
- **Tooling**: Vite

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

## 📁 Project Structure

```
src/
  ├── components/         # UI components
  ├── pages/              # Main and subpages
  ├── utils/              # Data transformation & chain mapping
  └── data/mock.json      # Mock data for development
```

## 🔌 API Integration

- Endpoint used:

  - `GET /portfolio/v4/overview/protocols/current_value`

- Required headers:

  ```
  Authorization: Bearer <API_KEY>
  ```

- Expected response format:
  ```ts
  interface PortfolioResult {
    protocol_name: string;
    result: { chain_id: number; value_usd: number }[];
  }
  ```

## 🧪 Development Tips

1. Start with `mock.json` to build UI components
2. Later, connect to live 1inch API (use `.env` with `VITE_API_KEY`)
3. Expand to support multiple wallets and full protocol views

## 📜 License

MIT License © 2025 OrbitGO
