import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { PlusCircle } from "lucide-react";
import WalletFormPopup from "./WalletFormPopup";
import WalletCard from "./WalletCard";
import WalletDetailsPopup from "./WalletDetails";
import axios from "axios";
import { toast } from "react-toastify";

const WalletPage = () => {
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [selectedView, setSelectedView] = useState("daily");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:8088/api/v1/accounts", {
          withCredentials: true,
        });
        setWallets(response.data.data.accounts || []);
      } catch (error) {
        toast.error("Error fetching wallets");
        console.error("Error fetching wallets:", error);
        setWallets([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWallets();
  }, []);

  const handleSaveWallet = (newWallet) => {
    setWallets((prev) => [...prev, newWallet]);
    setShowFormPopup(false);
  };

  const handleWalletClick = (wallet) => {
    setSelectedWallet(wallet);
    setShowDetailsPopup(true);
  };

  const handleUpdateWallet = async (updatedWallet) => {
    try {
      const response = await axios.patch(
        `http://localhost:8088/api/v1/accounts/${updatedWallet._id}`,
        updatedWallet,
        { withCredentials: true }
      );
      setWallets((prevWallets) =>
        prevWallets.map((w) =>
          w._id === updatedWallet._id ? response.data.data : w
        )
      );
      setShowDetailsPopup(false);
      toast.success("Wallet updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update wallet");
      console.error("Update error:", error);
    }
  };

  const handleDeleteWallet = async (walletId) => {
    if (!window.confirm("Are you sure you want to delete this wallet?")) return;
    try {
      await axios.delete(`http://localhost:8088/api/v1/accounts/${walletId}`, {
        withCredentials: true,
      });
      setWallets((prev) => prev.filter((w) => w._id !== walletId));
      setShowDetailsPopup(false);
      toast.success("Wallet deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete wallet");
      console.error("Delete error:", error);
    }
  };

  // Generate chart data based on wallets
  const generatePieData = () => {
    if (wallets.length === 0) return [];
    
    // Group by wallet type
    const typeMap = new Map();
    wallets.forEach(wallet => {
      const type = wallet.type || 'Other';
      const balance = wallet.remainingBalance || 0;
      if (typeMap.has(type)) {
        typeMap.set(type, typeMap.get(type) + balance);
      } else {
        typeMap.set(type, balance);
      }
    });
    
    return Array.from(typeMap.entries()).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2))
    }));
  };

  // Generate balance history data (simplified - in a real app you'd get this from API)
  const generateBalanceHistory = () => {
    const today = new Date();
    const data = [];
    
    if (selectedView === "daily") {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        // Calculate total balance for the day (simplified - would normally come from API)
        const totalBalance = wallets.reduce((sum, wallet) => {
          return sum + (wallet.balance || 0) * (0.95 + Math.random() * 0.1); // Add some variation
        }, 0);
        
        data.push({
          date: dayName,
          balance: parseFloat(totalBalance.toFixed(2))
        });
      }
    } else if (selectedView === "monthly") {
      for (let i = 5; i >= 0; i--) {
        const date = new Date(today);
        date.setMonth(date.getMonth() - i);
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        
        const totalBalance = wallets.reduce((sum, wallet) => {
          return sum + (wallet.balance || 0) * (0.9 + Math.random() * 0.2);
        }, 0);
        
        data.push({
          date: monthName,
          balance: parseFloat(totalBalance.toFixed(2))
        });
      }
    } else { // yearly
      for (let i = 4; i >= 0; i--) {
        const year = today.getFullYear() - i;
        
        const totalBalance = wallets.reduce((sum, wallet) => {
          return sum + (wallet.balance || 0) * (0.8 + Math.random() * 0.4);
        }, 0);
        
        data.push({
          date: year.toString(),
          balance: parseFloat(totalBalance.toFixed(2))
        });
      }
    }
    
    return data;
  };

  const COLORS = [
    '#6366F1', '#EC4899', '#22C55E', '#F97316', 
    '#EAB308', '#14B8A6', '#3B82F6', '#8B5CF6'
  ];

  const pieData = generatePieData();
  const balanceHistory = generateBalanceHistory();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

      </div>

      {/* Form Popup */}
      {showFormPopup && (
        <WalletFormPopup
          onClose={() => setShowFormPopup(false)}
          onSave={handleSaveWallet}
        />
      )}

      {/* Details Popup */}
      {showDetailsPopup && selectedWallet && (
        <WalletDetailsPopup
          wallet={selectedWallet}
          onClose={() => setShowDetailsPopup(false)}
          onUpdate={handleUpdateWallet}
          onDelete={handleDeleteWallet}
        />
      )}

      {/* Wallets Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Wallets</h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-4 rounded-xl shadow h-32 animate-pulse"></div>
            ))}
          </div>
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <p className="text-gray-500">
              {searchTerm ? "No matching wallets found" : "No wallets added yet."}
            </p>
            <button
              onClick={() => setShowFormPopup(true)}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {searchTerm ? "Clear search" : "Create Your First Wallet"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                key={wallet._id}
                onClick={() => handleWalletClick(wallet)}
                className="cursor-pointer hover:transform hover:scale-[1.02] transition-transform"
              >
                <WalletCard wallet={wallet} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Wallet Balance Chart */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
            <h2 className="text-lg font-semibold text-gray-800">
              Wallet Balance History ({selectedView.charAt(0).toUpperCase() + selectedView.slice(1)})
            </h2>
            <select
              value={selectedView}
              onChange={(e) => setSelectedView(e.target.value)}
              className="border border-gray-300 px-3 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={balanceHistory}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="balanceColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tickFormatter={(value) => `Rs. ${value.toLocaleString()}`}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), 'Balance']}
                  labelFormatter={(label) => `Date: ${label}`}
                  contentStyle={{
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Wallet Distribution Pie Chart */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Wallet Balances</h2>
          <div className="h-64 w-full">
            {wallets.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={wallets}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="balance"
                    nameKey="name"
                    labelLine={false}
                  >
                    {wallets.map((wallet, index) => (
                      <Cell
                        key={`cell-${wallet._id}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="#ffffff"
                        strokeWidth={1}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [
                      formatCurrency(value),
                      `Balance: ${formatCurrency(props.payload.balance)}`
                    ]}
                    contentStyle={{
                      background: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend 
                    layout="horizontal"
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value, entry, index) => wallets[index]?.name || value}
                    wrapperStyle={{
                      paddingTop: '20px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                {isLoading ? 'Loading...' : 'No wallets available'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Total Balance Card */}
      {wallets.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-xl shadow mt-6 text-white">
          <h2 className="text-lg font-medium mb-2">Total Balance</h2>
          <p className="text-3xl font-bold">
            {formatCurrency(wallets.reduce((sum, wallet) => sum + (wallet.balance || 0), 0))}
          </p>
          <p className="text-indigo-100 mt-2">
            Across {wallets.length} wallet{wallets.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default WalletPage;