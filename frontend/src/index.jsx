import React from "react";
import ReactDOM from "react-dom/client";
import { IoProvider } from "socket.io-react-hook";
import "./index.css";
import App from "./App";
import { SnackbarProvider } from "notistack";
import { TokenProvider } from "./context/useToken";
import { SocketProvider } from "./context/useAuthenticatedSocket";
import { LobbyProvider } from "./context/useLobby";
import { GameProvider } from "./context/useGame";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SnackbarProvider maxSnack={3}>
      <IoProvider>
        <TokenProvider>
          <SocketProvider>
            <LobbyProvider>
              <GameProvider>
                <App />
              </GameProvider>
            </LobbyProvider>
          </SocketProvider>
        </TokenProvider>
      </IoProvider>
    </SnackbarProvider>
  </React.StrictMode>
);
