import * as React from "react";
import { useWebsocket } from "./hooks";

const App: React.FC = () => {
  const { lastMessage, sendMessage } = useWebsocket();

  sendMessage({ type: "NEW_USER", clientId: 1, body: "" });

  return <div>{lastMessage}</div>;
};

export default App;
