/* global chrome */
import React, { useEffect } from "react";
import "./App.css";

import AllRoutes from "./Routes/AllRoutes";

function App() {
  const isExtensionContext = () => {
    return typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage;
  };

  useEffect(() => {
    const getToken = async () => {
      // Check if running in extension context
      if (isExtensionContext) {
        try {
          chrome.runtime.sendMessage(
            "kjiopgbfdcejcbjpnbjlmbpnflehecnl",
            { action: "fetchToken" },
            (response) => {
              if (response) {
                console.log(response);
                localStorage.setItem("token", response);
              }
            }
          );
        } catch (error) {
          console.log("Chrome extension is not activated:", error);
        }
      } else {
        // Handle non-extension context
        const token = localStorage.getItem("token");
        if (token) {
          console.log("Using stored token:", token);
        }
      }
    };

    getToken();
  }, []);

  return <>

    <AllRoutes />

  </>;
}

export default App;
