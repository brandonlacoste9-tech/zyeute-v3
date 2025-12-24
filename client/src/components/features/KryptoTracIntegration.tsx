import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface CryptoData {
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
}

interface PortfolioData {
  total_value: number;
  total_change_24h: number;
  holdings: Array<{
    symbol: string;
    amount: number;
    value: number;
    change_24h: number;
  }>;
}

const KryptoTracIntegration: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFullTracker, setShowFullTracker] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCryptoData();
      fetchPortfolioData();
    }
  }, [isAuthenticated]);

  const fetchCryptoData = async () => {
    try {
      // Mock data for now - in production, this would call KryptoTrac API
      const mockData: CryptoData[] = [
        {
          symbol: 'BTC',
          name: 'Bitcoin',
          current_price: 43250.00,
          price_change_percentage_24h: 2.45,
          market_cap: 847000000000
        },
        {
          symbol: 'ETH',
          name: 'Ethereum',
          current_price: 2580.00,
          price_change_percentage_24h: -1.23,
          market_cap: 310000000000
        },
        {
          symbol: 'ADA',
          name: 'Cardano',
          current_price: 0.48,
          price_change_percentage_24h: 5.67,
          market_cap: 17000000000
        }
      ];
      setCryptoData(mockData);
    } catch (error) {
      console.error('Failed to fetch crypto data:', error);
    }
  };

  const fetchPortfolioData = async () => {
    try {
      // Mock portfolio data
      const mockPortfolio: PortfolioData = {
        total_value: 12450.00,
        total_change_24h: 234.56,
        holdings: [
          { symbol: 'BTC', amount: 0.25, value: 10812.50, change_24h: 265.31 },
          { symbol: 'ETH', amount: 0.5, value: 1290.00, change_24h: -15.87 },
          { symbol: 'ADA', amount: 750, value: 360.00, change_24h: 20.43 }
        ]
      };
      setPortfolioData(mockPortfolio);
    } catch (error) {
      console.error('Failed to fetch portfolio data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openKryptoTrac = () => {
    // Open KryptoTrac in a new tab
    window.open('http://localhost:3004', '_blank');
  };

  if (!isAuthenticated) {
    return (
      <div className="crypto-integration-guest">
        <div className="crypto-preview">
          <h3>💰 Suivi Crypto</h3>
          <p>Connecte-toi pour voir ton portfolio crypto!</p>
          <div className="crypto-teasers">
            {cryptoData.slice(0, 3).map((crypto) => (
              <div key={crypto.symbol} className="crypto-teaser">
                <span className="crypto-symbol">{crypto.symbol}</span>
                <span className={`crypto-price ${crypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
                  ${crypto.current_price.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="crypto-integration-loading">
        <div className="loading-spinner">⏳</div>
        <p>Chargement de ton portfolio crypto...</p>
      </div>
    );
  }

  return (
    <div className="crypto-integration">
      <div className="crypto-header">
        <h3>💰 Ton Portfolio Crypto</h3>
        <button 
          className="open-kryptotrac-btn"
          onClick={openKryptoTrac}
          title="Ouvrir KryptoTrac complet"
        >
          📊 Voir tout
        </button>
      </div>

      {portfolioData && (
        <div className="portfolio-summary">
          <div className="portfolio-value">
            <span className="value-label">Valeur totale:</span>
            <span className="value-amount">${portfolioData.total_value.toLocaleString()}</span>
          </div>
          <div className={`portfolio-change ${portfolioData.total_change_24h >= 0 ? 'positive' : 'negative'}`}>
            <span className="change-label">24h:</span>
            <span className="change-amount">
              {portfolioData.total_change_24h >= 0 ? '+' : ''}${portfolioData.total_change_24h.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      <div className="crypto-holdings">
        {portfolioData?.holdings.map((holding) => (
          <div key={holding.symbol} className="holding-item">
            <div className="holding-info">
              <span className="holding-symbol">{holding.symbol}</span>
              <span className="holding-amount">{holding.amount}</span>
            </div>
            <div className="holding-value">
              <span className="value">${holding.value.toLocaleString()}</span>
              <span className={`change ${holding.change_24h >= 0 ? 'positive' : 'negative'}`}>
                {holding.change_24h >= 0 ? '+' : ''}${holding.change_24h.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="crypto-actions">
        <button className="action-btn primary" onClick={openKryptoTrac}>
          🚀 Gérer Portfolio
        </button>
        <button className="action-btn secondary">
          📈 Alertes Prix
        </button>
        <button className="action-btn secondary">
          🤖 Parler à BB
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .crypto-integration {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          padding: 20px;
          margin: 16px 0;
          color: white;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .crypto-integration-guest {
          background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%);
          border-radius: 16px;
          padding: 20px;
          margin: 16px 0;
          color: #2d3436;
        }

        .crypto-integration-loading {
          background: linear-gradient(135deg, #a8e6cf 0%, #88d8c0 100%);
          border-radius: 16px;
          padding: 20px;
          margin: 16px 0;
          text-align: center;
          color: #2d3436;
        }

        .crypto-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .crypto-header h3 {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .open-kryptotrac-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 8px;
          padding: 8px 12px;
          color: white;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .open-kryptotrac-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
        }

        .portfolio-summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 16px;
        }

        .portfolio-value {
          display: flex;
          flex-direction: column;
        }

        .value-label, .change-label {
          font-size: 0.8rem;
          opacity: 0.8;
        }

        .value-amount {
          font-size: 1.4rem;
          font-weight: 700;
        }

        .portfolio-change {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .change-amount {
          font-size: 1.1rem;
          font-weight: 600;
        }

        .positive {
          color: #00b894;
        }

        .negative {
          color: #e17055;
        }

        .crypto-holdings {
          margin-bottom: 16px;
        }

        .holding-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .holding-item:last-child {
          border-bottom: none;
        }

        .holding-info {
          display: flex;
          flex-direction: column;
        }

        .holding-symbol {
          font-weight: 600;
          font-size: 1rem;
        }

        .holding-amount {
          font-size: 0.8rem;
          opacity: 0.8;
        }

        .holding-value {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .crypto-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .action-btn {
          flex: 1;
          min-width: 120px;
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-btn.primary {
          background: #00b894;
          color: white;
        }

        .action-btn.secondary {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .action-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .crypto-teasers {
          display: flex;
          gap: 12px;
          margin-top: 12px;
        }

        .crypto-teaser {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          flex: 1;
        }

        .crypto-symbol {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .crypto-price {
          font-size: 0.8rem;
          margin-top: 4px;
        }

        .loading-spinner {
          font-size: 2rem;
          margin-bottom: 8px;
        }

        @media (max-width: 768px) {
          .crypto-actions {
            flex-direction: column;
          }
          
          .action-btn {
            min-width: auto;
          }
          
          .portfolio-summary {
            flex-direction: column;
            gap: 12px;
            text-align: center;
          }
        }
      ` }} />
    </div>
  );
};

export default KryptoTracIntegration;