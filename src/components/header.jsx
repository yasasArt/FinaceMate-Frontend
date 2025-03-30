import { Link, useLocation } from "react-router-dom";

export function Header() {
  const location = useLocation(); // Get current route path

  // Menu items
  const menuItems = [
    { name: "Dashboard", path: "/das/dashboard" },
    { name: "Transactions", path: "/das/transaction" },
    { name: "Wallet", path: "/das/wallert" }, // Fixed typo
    { name: "Goals", path: "/das/goal" },
    { name: "Budget", path: "/das/budget" },
    { name: "Settings", path: "/das/setting" },
    { name: "Help", path: "/das/help" },
  ];

  return (
    <aside className="w-[250px] h-screen p-4 bg-gray-100 shadow-md">
      <h2 className="text-xl font-bold text-purple-700">MyFinanceMate</h2>

      {/* Navigation Menu */}
      <nav className="mt-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block p-2 rounded transition-all ${
              location.pathname === item.path
                ? "bg-purple-500 text-white font-bold"
                : "text-gray-700 hover:bg-purple-200"
            }`}
          >
            {item.name}
          </Link>
        ))}

        {/* Logout Button */}
        <Link to="/login" className="block p-2 text-red-500 hover:text-red-700">
          Log Out
        </Link>
      </nav>
    </aside>
  );
}
