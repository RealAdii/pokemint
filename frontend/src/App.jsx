import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginScreen from "./screens/LoginScreen/LoginScreen";
import MapScreen from "./screens/MapScreen/MapScreen";
import "./App.css";

function App() {
  // const [userData, setUserData] = useState(null);
  // const { user } = useDynamicContext();

  // useEffect(() => {
  //   if (user) {
  //     console.log({ user });
  //     setUserData(user);
  //   }
  // }, [user]);

  // if (!userData) {
  //   return <div>Please log in to see your data.</div>;
  // }

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
            <Route path="/collect-coin" element={<MapScreen />} />
            {/* <Route path="*" element={<NotFound />} /> 404 page for unmatched routes */}
          </Routes>
        </Router>
      </DynamicContextProvider>
    </>
  );
}

export default App;
