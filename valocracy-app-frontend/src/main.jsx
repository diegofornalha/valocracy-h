import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import App from "./App.jsx";

//providers
import { AuthProvider } from "./providers/AuthProvider.jsx";
import { LoadingProvider } from "./providers/LoadingProvider.jsx";
import { ToastProvider } from "./providers/ToastProvider.jsx";

//theme
import theme from "./theme";

//components
import { Backdrop } from "./components/Backdrop.jsx";

//styles
import "./styles/index.css";
import { WalletProvider } from "./providers/WalletProvider.jsx";
import { ValocracyProvider } from "./providers/ValocracyProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ChakraProvider theme={theme}>
    <React.StrictMode>
      <Router>
        <AuthProvider>
          <LoadingProvider>
            <ToastProvider>
              <WalletProvider>
                <ValocracyProvider>
                  {/* <ColorModeScript initialColorMode={theme.config.initialColorMode} /> */}
                  <Backdrop />
                  <App />
                </ValocracyProvider>
              </WalletProvider>
            </ToastProvider>
          </LoadingProvider>
        </AuthProvider>
      </Router>
    </React.StrictMode>
  </ChakraProvider>
);
