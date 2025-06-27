import React, { useState, useEffect, useContext } from "react";
import GeneralContext from "./GeneralContext";
import { Tooltip, Grow } from "@mui/material";
import {
  BarChartOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreHoriz,
} from "@mui/icons-material";
import { DoughnutChart } from "./DoughnoutChart";

const WatchList = () => {
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
 const socketURL =
  process.env.NODE_ENV === "production"
    ? "wss://equinex-trading-platform.onrender.com"
    : `ws://localhost:${process.env.REACT_APP_WEBSOCKET_PORT}`;


    const ws = new WebSocket(socketURL);

    ws.onopen = () => {
      console.log("✅ Connected to WebSocket server");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📈 Received stock data:", data);
        setStockData(data);
      } catch (err) {
        console.error("❌ Failed to parse WebSocket message:", event.data);
      }
    };

    ws.onclose = () => {
      console.log("❌ Disconnected from WebSocket server");
    };

    ws.onerror = (error) => {
      console.error("⚠️ WebSocket error:", error);
    };

    return () => {
      console.log("🔌 Cleaning up WebSocket connection");
      ws.close();
    };
  }, []);

  const labels = stockData.map((stock) => stock.name);
  const data = {
    labels,
    datasets: [
      {
        label: "Price",
        data: stockData.map((stock) => stock.price),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search eg:infy, bse, nifty fut weekly, gold mcx"
          className="search"
        />
        <span className="counts">{stockData.length} / 50</span>
      </div>

      <ul className="list">
        {stockData.map((stock, index) => (
          <WatchListItem stock={stock} key={index} />
        ))}
      </ul>

      <DoughnutChart data={data} />
    </div>
  );
};

export default WatchList;

const WatchListItem = ({ stock }) => {
  const [showWatchlistActions, setShowWatchlistActions] = useState(false);

  const handleMouseEnter = () => {
    setShowWatchlistActions(true);
  };

  const handleMouseLeave = () => {
    setShowWatchlistActions(false);
  };

  const itemClass = stock.percent < 0 ? "item down" : "item up";

  return (
    <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className={itemClass}>
        <p className={stock.percent < 0 ? "down" : "up"}>{stock.name}</p>
        <div className="itemInfo">
          <span className="price">{stock.price}</span>
          <button
            className={`arrow-button ${stock.percent < 0 ? "down" : "up"}`}
          >
            {stock.percent < 0 ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
          </button>
          <span className="percent">{stock.percent}%</span>
        </div>
      </div>
      {showWatchlistActions && <WatchListActions uid={stock.name} />}
    </li>
  );
};

const WatchListActions = ({ uid }) => {
  const generalContext = useContext(GeneralContext);

  const handleBuyClick = () => {
    generalContext.openBuyWindow(uid);
  };

  return (
    <span className="actions">
      <Tooltip title="Buy (B)" placement="top" arrow TransitionComponent={Grow}>
        <button className="action-button buy" onClick={handleBuyClick}>
          Buy
        </button>
      </Tooltip>
      <Tooltip
        title="Sell (S)"
        placement="top"
        arrow
        TransitionComponent={Grow}
      >
        <button className="action-button sell">Sell</button>
      </Tooltip>
      <Tooltip
        title="Analytics (A)"
        placement="top"
        arrow
        TransitionComponent={Grow}
      >
        <button className="action-button">
          <BarChartOutlined className="icon" />
        </button>
      </Tooltip>
      <Tooltip
        title="More"
        placement="top"
        arrow
        TransitionComponent={Grow}
      >
        <button className="action-button">
          <MoreHoriz className="icon" />
        </button>
      </Tooltip>
    </span>
  );
};
