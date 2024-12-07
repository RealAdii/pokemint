import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginScreen from "./screens/LoginScreen/LoginScreen";
import MapScreen from "./screens/MapScreen/MapScreen";
import CollectCoin from "./screens/CollectCoin/CollectCoin";
import Dashboard from "./screens/Dashboard/Dashboard";
import "./App.css";

function App() {
  return (
    <>
      <DynamicContextProvider
        settings={{
          environmentId: import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID,
          walletConnectors: [EthereumWalletConnectors],
        }}
      >
        <Router>
          <Routes>
            <Route path="/" element={<LoginScreen />} />
            <Route path="/find-coin" element={<MapScreen />} />
            <Route path="/collect-coin" element={<CollectCoin />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* <Route path="*" element={<NotFound />} /> 404 page for unmatched routes */}
          </Routes>
        </Router>
      </DynamicContextProvider>
    </>
  );
}

export default App;
