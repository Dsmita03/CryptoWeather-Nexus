import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { updatePrice } from "../store/websocketSlice";

const useWebSocket = () => {
  const dispatch = useDispatch();
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  const connectWebSocket = () => {
    if (socketRef.current) socketRef.current.close(); // Close any existing connection
    console.log("🔌 Connecting to WebSocket...");

    socketRef.current = new WebSocket("wss://ws.coincap.io/prices?assets=bitcoin,ethereum,dogecoin"); // Replace with valid WebSocket API

    socketRef.current.onopen = () => {
      console.log("✅ WebSocket Connected");
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Ensure data format is correct
        if (typeof data === 'object') {
          Object.entries(data).forEach(([id, price]) => {
            if (typeof price === 'string') {
              dispatch(updatePrice({ id, price: parseFloat(price) })); // Dispatch price updates to Redux store
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
        reconnectTimeout.current = setTimeout(connectWebSocket, 5000); // Reconnect after 5 seconds
      }
    };
  };

  useEffect(() => {
    connectWebSocket(); // Initial connection
    return () => {
      if (socketRef.current) socketRef.current.close();
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    };
  }, [dispatch]);

  return null;
};

export default useWebSocket;
