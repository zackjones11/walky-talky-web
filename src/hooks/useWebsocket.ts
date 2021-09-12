import * as React from "react";

type MessageType =
  | "NEW_USER"
  | "START_CHAT"
  | "OFFER"
  | "ANSWER"
  | "ICE_CANDIDATE"
  | "DISCONNECTION";

export type WebsocketResponse = {
  type: MessageType;
  clientId?: string;
  body: string;
};

interface IUseWebsocketReturn {
  socket: WebSocket;
  lastMessage?: WebsocketResponse;
  sendMessage: (data: WebsocketResponse) => void;
}

const SOCKET_URL = "ws://localhost:3000/ws";
const socket = new WebSocket(SOCKET_URL);

const useWebsocket = (): IUseWebsocketReturn => {
  const [lastMessage, setLastMessage] = React.useState<WebsocketResponse>();

  socket.onopen = () => {
    console.info("Websocket connected");
  };

  socket.onmessage = (message) => {
    setLastMessage(JSON.parse(message.data));
  };

  socket.onclose = () => {
    console.info("Websocket disconnected");
  };

  socket.onerror = (error) => {
    console.error("socket error:", error);
  };

  const sendMessage = (data: WebsocketResponse) => {
    socket.send(JSON.stringify(data));
  };

  return { socket, lastMessage, sendMessage };
};

export default useWebsocket;
