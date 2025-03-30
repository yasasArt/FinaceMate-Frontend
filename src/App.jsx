import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useCookies, CookiesProvider } from "react-cookie";
import { useEffect } from "react";

import Signup from "./pages/Signup.jsx";
import Login from "./Login.jsx";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/theme-context.jsx";
import Layout from "./routes/layout";
import DashboardPage from "./routes/dashboard/page";
import TransactionPage from "./routes/transaction/page.jsx";
import WalletPage from "./routes/wallet/page.jsx";
import BudgetPage from "./routes/budget/page.jsx";
import GoalsPage from "./routes/goals/page.jsx";
import SettingsPage from "./routes/settings/page.jsx";
import LogoutPage from "./routes/logout/page.jsx";

function App() {

  const ProtectedRoute = ({ element }) => {
    const [cookies] = useCookies(["authToken"]);
  
    useEffect(() => {
      console.log("Auth Token:", cookies.authToken); // Debugging
    }, [cookies]);
  
    return cookies.authToken ? element : <Navigate to="/login" replace />;
  };
  

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <ProtectedRoute element={<DashboardPage />} /> },
        { path: "transactions", element: <ProtectedRoute element={<TransactionPage />} /> },
        { path: "accounts", element: <ProtectedRoute element={<WalletPage />} /> },
        { path: "budgets", element: <ProtectedRoute element={<BudgetPage />} /> },
        { path: "goals", element: <ProtectedRoute element={<GoalsPage />} /> },
        { path: "settings", element: <ProtectedRoute element={<SettingsPage/>} /> },
        { path: "logout", element: <ProtectedRoute element={<LogoutPage/>}/> },
      ],
    },
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Signup /> },
  ])

  return (
    <ThemeProvider storageKey="theme">
      <CookiesProvider>
        <Toaster position="top-right" />
          <RouterProvider router={router} />
      </CookiesProvider>
    </ThemeProvider>
  )
}

export default App;
