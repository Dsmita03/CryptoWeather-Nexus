// utils/websocket.ts
const WEBSOCKET_URL = "wss://ws.coincap.io/prices?assets=bitcoin,ethereum";

export const connectWebSocket = (callback: (data: any) => void) => {
  const socket = new WebSocket(WEBSOCKET_URL);

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    callback(data);
  };

  socket.onerror = (error) => {
    console.error("WebSocket Error:", error);
  };

  return socket;
};
