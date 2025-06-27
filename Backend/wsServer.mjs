import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

if (!process.env.FINNHUB_API_KEY || !process.env.WEBSOCKET_PORT) {
  console.error('Error: Missing required environment variables.');
  process.exit(1);
}

const wss = new WebSocketServer({ port: process.env.WEBSOCKET_PORT || 8080 });

wss.on('connection', (ws) => {
  console.log('New client connected');

  const fetchStockData = async (symbol) => {
    const apiKey = process.env.FINNHUB_API_KEY;
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error fetching stock data');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching stock data:', error);
      return null;
    }
  };

  const intervalId = setInterval(async () => {
    try {
      const stocks = ['AAPL', 'GOOGL', 'MSFT'];
      const stockData = await Promise.all(stocks.map(fetchStockData));

      const formattedData = stockData.map((data, index) => {
        if (!data) return null;
        const percentChange = ((data.c - data.pc) / data.pc * 100).toFixed(2);
        const isDown = data.c < data.pc;
        return {
          name: stocks[index],
          price: data.c,
          percent: `${percentChange}%`,
          isDown,
        };
      }).filter(Boolean);

      ws.send(JSON.stringify(formattedData));
    } catch (error) {
      console.error('Interval error:', error);
      ws.send(JSON.stringify({ error: 'Error fetching stock data' }));
    }
  }, 3000);

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(intervalId);
  });
});

console.log(`WebSocket server running on port ${process.env.WEBSOCKET_PORT || 8080}`);
