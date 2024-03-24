import { Routes, Route, Navigate, useLocation } from "react-router-dom";

//hooks
import { useAuth } from "./hooks/useAuth";

//pages
import Login from "./pages/Login";
import Home from "./pages/Home";
import Governance from "./pages/Governance";
import Dashboard from "./pages/Dashboard";
import Proposal from "./pages/Proposal";
import Mint from "./pages/Mint";
import AllNfts from "./pages/AllNfts";

//components
import { EmailCode } from "./components/EmailCode";
import { LoginCard } from "./components/LoginCard";

//Protect Routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // console.log("APP:", location);

  if (!isAuthenticated) {
    // Redirect to /auth but pass the current location in state
    // so it can be accessed on the login page for redirecting after login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="governance" element={<Governance />} />
        <Route path="governance/proposal/:id" element={<Proposal />} />
        <Route path="mint" element={<Mint />} />
        <Route path="all" element={<AllNfts />} />
      </Route>

      <Route path="/auth" element={<Login />}>
        <Route index element={<LoginCard />} />
        <Route path="signup" element={<LoginCard />} />
        <Route path="validation" element={<EmailCode />} />
      </Route>
    </Routes>
  );
}

export default App;
