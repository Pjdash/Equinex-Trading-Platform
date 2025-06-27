import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid }) => {
  const [stockData, setStockData] = useState([]);
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);

  const userdata = JSON.parse(localStorage.getItem("userData")) || {};
  const userEmail = userdata.email || "";

  useEffect(() => {
    const ws = new WebSocket("wss://equinex-trading-platform.onrender.com");

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setStockData(data);
        const stock = data.find((s) => s.name === uid);
        if (stock) {
          setStockPrice(Number(stock.price));
        }
      } catch (error) {
        console.error("Error parsing WebSocket data:", error);
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, [uid]);

  const handleBuyClick = async () => {
    console.log(`Placing buy order for ${uid} at ₹${stockPrice} by ${userEmail}`);

    try {
      await axios.post("https://equinex-trading-platform.onrender.com/newOrder", {
        name: uid,
        qty: stockQuantity,
        price: stockPrice,
        username: userEmail,
        mode: "BUY",
      });
      GeneralContext.closeBuyWindow();
    } catch (error) {
      console.error("Error placing buy order:", error);
    }
  };

  const handleCancelClick = () => {
    GeneralContext.closeBuyWindow();
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              min="1"
              onChange={(e) => setStockQuantity(Number(e.target.value))}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              value={stockPrice.toFixed(2)}
              readOnly
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹{(stockQuantity * stockPrice).toFixed(2)}</span>
        <div>
          <Link className="btn btn-blue" onClick={handleBuyClick}>
            Buy
          </Link>
          <Link to="" className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;
