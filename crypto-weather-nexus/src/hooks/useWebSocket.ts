import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { updatePrice } from "../store/websocketSlice";

// Define type for WebSocket message data
interface WebSocketData {
  [key: string]: string; // The key is the asset id, and the value is the price in string format
}

const useWebSocket = () => {
  const dispatch = useDispatch();
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  const connectWebSocket = () => {
    if (socketRef.current) socketRef.current.close(); // Close any existing connection
    console.log("🔌 Connecting to WebSocket...");

    socketRef.current = new WebSocket("wss://ws.coincap.io/prices?assets=bitcoin,ethereum,dogecoin"); // WebSocket URL for crypto prices

    socketRef.current.onopen = () => {
      console.log("✅ WebSocket Connected");
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data: WebSocketData = JSON.parse(event.data);

        // Ensure data is an object and process each asset price
        if (typeof data === "object" && data !== null) {
          Object.entries(data).forEach(([id, price]) => {
            if (typeof price === "string") {
              const parsedPrice = parseFloat(price);
              if (!isNaN(parsedPrice)) {
                // Dispatch price updates to Redux store, include 'usd' field
                dispatch(updatePrice({
                  id,
                  price: parsedPrice,
                  usd: parsedPrice, // Use the price as usd value
                }));
              } else {
                console.error("❌ Invalid price value:", price);
              }
            } else {
              console.error("❌ Invalid price data:", price);
            }
          });
        } else {
          console.error("❌ Unexpected data format:", data);
        }
      } catch (error) {
        console.error("❌ Error parsing WebSocket data:", error);
      }
    };

    socketRef.current.onerror = (error) => {
      console.error("❌ WebSocket Error:", error);
    };

    socketRef.current.onclose = (event) => {
      console.warn("⚠️ WebSocket Disconnected:", event.reason || "Unknown reason");
      if (!event.wasClean) {
        console.log("🔄 Attempting to reconnect...");
        reconnectTimeout.current = setTimeout(connectWebSocket, 5000); // Retry connection after 5 seconds
      }
    };
  };

  useEffect(() => {
    connectWebSocket(); // Initial WebSocket connection
    return () => {
      if (socketRef.current) socketRef.current.close(); // Clean up the connection on component unmount
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current); // Clear the reconnect timeout
    };
  }, [dispatch]);

  return null;
};

export default useWebSocket;
