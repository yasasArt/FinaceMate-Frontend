import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceArea,
} from "recharts";
import { PlusCircle } from "lucide-react";
import WalletFormPopup from "./WalletFormPopup";
import WalletCard from "./WalletCard";
import WalletDetailsPopup from "./WalletDetails";
import CardDisplay from "./CardDisplay";
import axios from "axios";
import { toast } from "react-toastify";

const WalletPage = () => {
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [selectedView, setSelectedView] = useState("daily");

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const response = await axios.get("http://localhost:8088/api/v1/accounts", {
          withCredentials: true,
        });
        setWallets(response.data.data.accounts || []);
      } catch (error) {
        toast.error("Error fetching wallets");
        console.error("Error fetching wallets:", error);
        setWallets([]);
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

  const dailyData = [
    { day: "Mon", balance: 1200 },
    { day: "Tue", balance: 1350 },
    { day: "Wed", balance: 1400 },
    { day: "Thu", balance: 1250 },
    { day: "Fri", balance: 1500 },
    { day: "Sat", balance: 1600 },
    { day: "Sun", balance: 1580 },
  ];

  const monthlyData = [
    { day: "Jan", balance: 12000 },
    { day: "Feb", balance: 13500 },
    { day: "Mar", balance: 14200 },
    { day: "Apr", balance: 12800 },
    { day: "May", balance: 15200 },
    { day: "Jun", balance: 16000 },
  ];

  const yearlyData = [
    { day: "2020", balance: 40000 },
    { day: "2021", balance: 55000 },
    { day: "2022", balance: 62000 },
    { day: "2023", balance: 71000 },
    { day: "2024", balance: 78500 },
  ];

  const pieData = [
    { name: "Bitcoin (BTC)", value: 24 },
    { name: "Ethereum (ETH)", value: 18 },
    { name: "Shard (SHARD)", value: 32 },
    { name: "Binance (BNB)", value: 22 },
  ];

  const COLORS = ["#6366F1", "#EC4899", "#22C55E", "#F97316", "#EAB308"];

  const getChartData = () => {
    if (selectedView === "monthly") return monthlyData;
    if (selectedView === "yearly") return yearlyData;
    return dailyData;
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Wallet Dashboard</h1>
        <button
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          onClick={() => setShowFormPopup(true)}
        >
          <PlusCircle className="mr-2" />
          Add Wallet
        </button>
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

        {wallets.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <p className="text-gray-500">No wallets added yet.</p>
            <button
              onClick={() => setShowFormPopup(true)}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Create Your First Wallet
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wallets.map((wallet) => (
              <div
                key={wallet._id}
                onClick={() => handleWalletClick(wallet)}
                className="cursor-pointer"
              >
                <WalletCard wallet={wallet} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Wallet Balance Chart */}
      <div className="bg-white p-6 rounded-xl shadow w-full mt-8 overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Wallet Balance ({selectedView.charAt(0).toUpperCase() + selectedView.slice(1)})
          </h2>
          <select
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value)}
            className="border px-3 py-1 rounded-md text-sm"
          >
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <AreaChart
          width={Math.min(window.innerWidth - 50, 900)}
          height={400}
          data={getChartData()}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <ReferenceArea y1={0} y2={1199} strokeOpacity={0} fill="#fee2e2" fillOpacity={0.3} />
          <ReferenceArea y1={1200} y2={1399} strokeOpacity={0} fill="#fef9c3" fillOpacity={0.3} />
          <ReferenceArea y1={1400} y2={99999} strokeOpacity={0} fill="#dcfce7" fillOpacity={0.3} />

          <defs>
            <linearGradient id="balanceColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4115ed" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#4115ed" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#4115ed"
            fill="url(#balanceColor)"
            strokeWidth={2}
            name="Balance"
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </div>

      {/* Wallet Pie Chart */}
      <div className="bg-white p-6 rounded-xl shadow mt-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">My Wallet</h2>
        <div className="h-[300px] flex justify-center items-center">
          <PieChart width={600} height={300}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={2}
              dataKey="value"
              label={({ name, value }) => `${name} (${value}%)`}
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
          </PieChart>
        </div>
      </div>

      {/* CardDisplay */}
      <div className="bg-white p-6 rounded-xl shadow mt-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Saved Cards</h2>
        <div className="flex flex-wrap gap-6">
          <CardDisplay
            cardType="Visa"
            cardNumber="4111111111111111"
            cardHolder="John Doe"
            expiry="12/26"
          />
          <CardDisplay
            cardType="Mastercard"
            cardNumber="5555555555554444"
            cardHolder="Jane Smith"
            expiry="08/25"
          />
        </div>
      </div>
    </div>
  );
};

export default WalletPage;