import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  BarChart3,
  LineChart,
  Activity,
  Volume2,
} from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import { motion } from "framer-motion";
import { getCryptoMarkets, getCryptoOHLC } from "../api/axios";

// -------- Types --------
interface CoinGeckoCoin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  total_volume: number;
  market_cap: number;
}

interface OHLCItem {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  diff: number;
  isGreen: boolean;
}

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  marketCap: number;
  chartData: {
    time: string;
    price: number;
    volume: number;
    open: number;
    high: number;
    low: number;
    close: number;
  }[];
  ohlcData: OHLCItem[];
}

interface MarketSummary {
  totalMarketCap: number;
  totalVolume: number;
  btcDominance: number;
  activeCoins: number;
}

type ChartType = "line" | "area" | "volume" | "candlestick";
type TimeFrame = "1H" | "4H" | "1D" | "1W" | "1M";

// -------- Component --------
const CryptoRates: React.FC = () => {
  const [marketSummary, setMarketSummary] = useState<MarketSummary | null>(
    null
  );
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoData | null>(null);
  const [chartType, setChartType] = useState<ChartType>("candlestick");
  const [timeframe, setTimeframe] = useState<TimeFrame>("1D");
  const [loading, setLoading] = useState(true);

  const timeframeToDays: Record<TimeFrame, number> = {
    "1H": 1, // CoinGecko only supports 1, 7, 14, 30, 90, 180, 365, max
    "4H": 1,
    "1D": 1,
    "1W": 7,
    "1M": 30,
  };

  // -------- Fetch crypto data --------
  // -------- Fetch crypto data --------

  const fetchCryptoData = async () => {
    try {
      setLoading(true);

      const res = await getCryptoMarkets();
      const coins = res.data;

      if (!Array.isArray(coins)) {
        console.error("Invalid data format from API:", coins);
        return;
      }

      const data: CryptoData[] = await Promise.all(
        coins.map(async (coin) => {
          const ohlcRes = await getCryptoOHLC(
            coin.id,
            timeframeToDays[timeframe]
          );
          const ohlcRaw = ohlcRes.data;

          const ohlcData: OHLCItem[] = Array.isArray(ohlcRaw)
            ? ohlcRaw.map((item) => ({
                ...item,
                diff: item.close - item.open,
                isGreen: item.close >= item.open,
                volume: item.volume ?? 0,
              }))
            : [];

          const chartData = ohlcData.map((item) => ({
            time: item.time,
            price: item.close,
            volume: item.volume,
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close,
          }));

          return {
            ...coin,
            ohlcData,
            chartData,
          };
        })
      );

      setCryptoData(data);
      setSelectedCrypto(data[0] || null);

      const totalMarketCap = data.reduce(
        (sum, c) => sum + (c.marketCap ?? 0),
        0
      );
      const totalVolume = data.reduce((sum, c) => sum + (c.volume ?? 0), 0);

      setMarketSummary({
        totalMarketCap,
        totalVolume,
        btcDominance: 42.5,
        activeCoins: data.length,
      });

      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error fetching crypto data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 60000);
    return () => clearInterval(interval);
  }, [timeframe]);

  // -------- Helpers --------
  const formatPrice = (price: number) =>
    price >= 1000
      ? `$${price.toLocaleString()}`
      : `$${price.toFixed(price < 1 ? 4 : 2)}`;

  const formatVolume = (volume: number) =>
    volume >= 1e9
      ? `$${(volume / 1e9).toFixed(1)}B`
      : volume >= 1e6
      ? `$${(volume / 1e6).toFixed(1)}M`
      : `$${(volume / 1e3).toFixed(1)}K`;

  if (loading)
    return (
      <section className="py-20 bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading live market data...</p>
        </div>
      </section>
    );

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Market Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Live Cryptocurrency Market
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Real-time cryptocurrency prices and professional trading charts
          </p>
          {marketSummary && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <p className="text-gray-400 text-sm">Market Cap</p>
                <p className="text-white font-bold">
                  {formatVolume(marketSummary.totalMarketCap)}
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <p className="text-gray-400 text-sm">24h Volume</p>
                <p className="text-white font-bold">
                  {formatVolume(marketSummary.totalVolume)}
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <p className="text-gray-400 text-sm">BTC Dominance</p>
                <p className="text-white font-bold">
                  {marketSummary.btcDominance}%
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <p className="text-gray-400 text-sm">Active Coins</p>
                <p className="text-white font-bold">
                  {marketSummary.activeCoins.toLocaleString()}
                </p>
              </div>
            </div>
          )}
          <p className="text-gray-500 text-sm">
            Last update: {lastUpdate.toLocaleTimeString()}
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Crypto List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  Top Cryptocurrencies
                </h3>
                <button
                  onClick={fetchCryptoData}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <RefreshCw
                    className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                  />
                </button>
              </div>
              <div className="space-y-4">
                {cryptoData.map((crypto) => (
                  <div
                    key={crypto.id}
                    onClick={() => setSelectedCrypto(crypto)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                      selectedCrypto?.id === crypto.id
                        ? "bg-emerald-500/20 border border-emerald-500/50"
                        : "bg-gray-700 hover:bg-gray-600 border border-gray-600"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">
                            {crypto.symbol.slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-white font-medium">
                            {crypto.name}
                          </h4>
                          <p className="text-gray-400 text-sm">
                            {crypto.symbol}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">
                          {formatPrice(crypto.price)}
                        </p>
                        <div
                          className={`flex items-center text-sm ${
                            crypto.change24h >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {crypto.change24h >= 0 ? (
                            <TrendingUp className="w-4 h-4 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 mr-1" />
                          )}
                          {Math.abs(crypto.change24h).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Chart Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            {selectedCrypto && (
              <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
                {/* Chart Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {selectedCrypto.name} ({selectedCrypto.symbol})
                    </h3>
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl font-bold text-white">
                        {formatPrice(selectedCrypto.price)}
                      </span>
                      <span
                        className={`flex items-center text-lg font-medium ${
                          selectedCrypto.change24h >= 0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {selectedCrypto.change24h >= 0 ? (
                          <TrendingUp className="w-5 h-5 mr-1" />
                        ) : (
                          <TrendingDown className="w-5 h-5 mr-1" />
                        )}
                        {selectedCrypto.change24h.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Chart Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
                  <div className="flex bg-gray-700 rounded-lg p-1">
                    {[
                      {
                        type: "candlestick" as ChartType,
                        icon: BarChart3,
                        label: "Candlestick",
                      },
                      {
                        type: "line" as ChartType,
                        icon: LineChart,
                        label: "Line",
                      },
                      {
                        type: "area" as ChartType,
                        icon: Activity,
                        label: "Area",
                      },
                      {
                        type: "volume" as ChartType,
                        icon: Volume2,
                        label: "Volume",
                      },
                    ].map((chart) => {
                      const Icon = chart.icon;
                      return (
                        <button
                          key={chart.type}
                          onClick={() => setChartType(chart.type)}
                          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            chartType === chart.type
                              ? "bg-emerald-500 text-white"
                              : "text-gray-400 hover:text-white"
                          }`}
                        >
                          <Icon className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">
                            {chart.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex bg-gray-700 rounded-lg p-1">
                    {["1H", "4H", "1D", "1W", "1M"].map((tf) => (
                      <button
                        key={tf}
                        onClick={() => setTimeframe(tf as TimeFrame)}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          timeframe === tf
                            ? "bg-emerald-500 text-white"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chart */}
                {/* Chart */}
                <div className="h-96 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    {selectedCrypto ? (
                      selectedCrypto.chartData.length > 1 ? ( // <-- change here
                        <>
                          {chartType === "line" && (
                            <RechartsLineChart data={selectedCrypto.chartData}>
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#374151"
                              />
                              <XAxis
                                dataKey="time"
                                stroke="#9ca3af"
                                tickFormatter={(time) =>
                                  new Date(
                                    typeof time === "number" ? time : time
                                  ).toLocaleTimeString()
                                }
                              />
                              <YAxis stroke="#9ca3af" />
                              <Tooltip
                                formatter={(value: number) =>
                                  formatPrice(value)
                                }
                              />
                              <Line
                                type="monotone"
                                dataKey="price"
                                stroke="#10b981"
                                strokeWidth={2}
                                dot={false}
                              />
                            </RechartsLineChart>
                          )}

                          {chartType === "area" && (
                            <AreaChart data={selectedCrypto.chartData}>
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#374151"
                              />
                              <XAxis
                                dataKey="time"
                                stroke="#9ca3af"
                                tickFormatter={(time) =>
                                  new Date(time).toLocaleTimeString()
                                }
                              />
                              <YAxis stroke="#9ca3af" />
                              <Tooltip
                                formatter={(value: number) =>
                                  formatPrice(value)
                                }
                              />
                              <defs>
                                <linearGradient
                                  id="colorGradient"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="5%"
                                    stopColor="#10b981"
                                    stopOpacity={0.3}
                                  />
                                  <stop
                                    offset="95%"
                                    stopColor="#10b981"
                                    stopOpacity={0}
                                  />
                                </linearGradient>
                              </defs>
                              <Area
                                type="monotone"
                                dataKey="price"
                                stroke="#10b981"
                                fill="url(#colorGradient)"
                                strokeWidth={2}
                              />
                            </AreaChart>
                          )}

                          {chartType === "volume" && (
                            <BarChart data={selectedCrypto.chartData}>
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#374151"
                              />
                              <XAxis
                                dataKey="time"
                                stroke="#9ca3af"
                                tickFormatter={(time) =>
                                  new Date(time).toLocaleTimeString()
                                }
                              />
                              <YAxis stroke="#9ca3af" />
                              <Tooltip
                                formatter={(value: number) =>
                                  formatVolume(value)
                                }
                              />
                              <Bar dataKey="volume" fill="#3b82f6" />
                            </BarChart>
                          )}

                          {chartType === "candlestick" ? (
                            selectedCrypto.ohlcData.length ? (
                              <ComposedChart data={selectedCrypto.ohlcData}>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke="#374151"
                                />
                                <XAxis
                                  dataKey="time"
                                  stroke="#9ca3af"
                                  tickFormatter={(time) =>
                                    new Date(time).toLocaleTimeString()
                                  }
                                />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip
                                  formatter={(value: number) =>
                                    formatPrice(value)
                                  }
                                />
                                <Bar
                                  dataKey="diff"
                                  fill="#10b981"
                                  isAnimationActive={false}
                                />
                              </ComposedChart>
                            ) : (
                              <p className="text-gray-400 text-center mt-20">
                                Not enough data for this timeframe.
                              </p>
                            )
                          ) : null}
                        </>
                      ) : (
                        <p className="text-gray-400 text-center mt-20">
                          Not enough data for this timeframe.
                        </p>
                      )
                    ) : (
                      <p className="text-gray-400 text-center mt-20">
                        No chart data available.
                      </p>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CryptoRates;
