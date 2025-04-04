# OrbitGO Treasury Management Frontend

💼 A modern dashboard for managing and analyzing DeFi treasury positions across multiple protocols and chains, powered by [1inch Portfolio API](https://portal.1inch.dev/documentation/apis/portfolio).

## 🌟 Features

### Portfolio Management
- **Multi-Chain Support**: Track assets across 10+ major chains including Ethereum, BSC, Polygon, Arbitrum, Optimism, Base, and more
- **Protocol Integration**: View positions in various DeFi protocols with real-time value updates
- **Zero-Value Filtering**: Option to hide protocols with $0 total value
- **Sorting Options**: Sort by value, ROI, APR, and other key metrics

### Data Visualization
- **Protocol Allocation Chart**: Interactive pie chart showing asset distribution across protocols
- **Total Value Overview**: Real-time summary of total portfolio value and protocol count
- **Chain Distribution**: Detailed breakdown of assets by blockchain
- **Custom Filtering**: Filter protocols by chain, value, and other parameters

### Data Export
- **CSV Export**: Export protocol data with customizable fields
- **Formatted Data**: Well-structured exports including Protocol, Chain, Value (USD), ROI, and APR

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- 1inch API key

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/treasury-management-frontend.git

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API key

# Start development server
npm run dev
```

## 📁 Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── YieldCard/       # Protocol yield display
│   └── ProtocolAllocationChart/  # Portfolio visualization
├── routes/              # Application routes
│   └── dashboard/       # Main dashboard views
├── utils/              # Utility functions
│   ├── csv.ts          # CSV export utilities
│   ├── protocol.ts     # Protocol data processing
│   └── export.ts       # Export formatting
├── constants/          # Configuration constants
│   └── chains.ts       # Chain definitions
└── types.ts           # TypeScript type definitions
```

## 🔌 API Integration

### Portfolio Overview Endpoint
```typescript
GET /portfolio/v4/overview/protocols/current_value

// Headers
Authorization: Bearer ${VITE_1INCH_API_KEY}

// Response Type
interface PortfolioResponse2 {
  result: Protocol[];
}

interface Protocol {
  chain_id: number;
  name: string;
  value_usd: number;
  roi?: number;
  info: {
    weighted_apr: number;
  };
}
```

## 🛠️ Tech Stack

### Core
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: React Query

### Data & Visualization
- **Charts**: Recharts
- **Data Fetching**: Axios
- **Web3**: RainbowKit + wagmi

### Development
- **Linting**: ESLint
- **Formatting**: Prettier
- **Testing**: Vitest (planned)

## 🔐 Security

- API keys are stored in environment variables
- All data processing happens client-side
- Secure wallet connections via RainbowKit

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

MIT License - see the [LICENSE](LICENSE) file for details

## 💡 Development Tips

1. Use environment variables for configuration
2. Run tests before submitting PRs
3. Follow the existing code style and conventions
4. Keep components small and focused
5. Document new features and API changes

## 📝 License

MIT License © 2025 OrbitGO
