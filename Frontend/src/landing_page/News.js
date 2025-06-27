import React, { useEffect, useState } from "react";
import axios from "axios";
import "./News.css"; // Import CSS file for styling
import Navbar from "./Navbar";
import Footer from "./Footer";

function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
  "https://equinex-trading-platform.onrender.com/api/news"
);

        console.log("📥 News API response:", response.data);
        if (Array.isArray(response.data)) {
          setNews(response.data);
        } else {
          setError("Unexpected response format from server");
        }
      } catch (err) {
        console.error("❌ Failed to fetch stock news:", err);
        setError("Failed to fetch stock news");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="news-container">
      <Navbar />

      {/* News Ticker */}
      <div className="ticker">
        <div className="ticker-inner">
          {Array.isArray(news) &&
            news.map((item, index) => (
              <span key={index} className="ticker-item">
                <strong>{item.symbol}</strong>: Current ${item.close}
                {item.close > item.open ? (
                  <span className="positive">▲</span>
                ) : (
                  <span className="negative">▼</span>
                )}
              </span>
            ))}
        </div>
      </div>

      {/* Stock News Section */}
      <div className="list-group">
        {Array.isArray(news) &&
          news.map((item, index) => (
            <div key={index} className="list-group-item news-item">
              <h5>
                {item.symbol} - {new Date(item.date).toLocaleDateString()}
              </h5>
              <p>
                Current stock price for <strong>{item.symbol}</strong> is{" "}
                <span className="price">${item.close}</span>.
                {item.close > item.open ? (
                  <span className="positive"> Up today ▲</span>
                ) : (
                  <span className="negative"> Down today ▼</span>
                )}
              </p>
              <p>
                Open: <span>${item.open}</span> | High: <span>${item.high}</span>{" "}
                | Low: <span>${item.low}</span> | Volume: {item.volume}
              </p>
            </div>
          ))}
      </div>

      <Footer />
    </div>
  );
}

export default News;
