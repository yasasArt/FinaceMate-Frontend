import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { PlusCircle } from "lucide-react";
import WalletFormPopup from "./WalletFormPopup";
import WalletCard from "./WalletCard";
import WalletDetailsPopup from "./WalletDetails";
import axios from "axios";

const WalletPage = () => {
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [wallets, setWallets] = useState([]);

  const handleUpdateWallet = async (updatedWallet) => {
    try {
      const response = await axios.patch(
        `http://localhost:8088/api/v1/accounts/${updatedWallet._id}`,
        updatedWallet,
        { withCredentials: true } // This sends cookies including authToken
      );
      
      setWallets(wallets.map(w => 
        w._id === updatedWallet._id ? response.data.data : w
      ));
      setShowDetailsPopup(false); // Close the popup after update
      toast.success("Wallet updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update wallet');
      console.error('Update error:', error);
    }
  };
  
  const handleDeleteWallet = async (walletId) => {
    if (!window.confirm("Are you sure you want to delete this wallet?")) return;
    
    try {
      await axios.delete(
        `http://localhost:8088/api/v1/accounts/${walletId}`,
        { withCredentials: true }
      );
      
      setWallets(wallets.filter(w => w._id !== walletId));
      setShowDetailsPopup(false); // Close the popup after deletion
      toast.success("Wallet deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete wallet');
      console.error('Delete error:', error);
    }
  };

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const response = await axios.get("http://localhost:8088/api/v1/accounts");
        setWallets(response.data.data.accounts || []);
      } catch (error) {
        console.error("Error fetching wallets:", error);
        setWallets([]);
      }
    };
    fetchWallets();
  }, []);

  const transactionData = [
    { name: "Mon", income: 30, expenses: 50 },
    { name: "Tue", income: 40, expenses: 30 },
    { name: "Wed", income: 70, expenses: 40 },
    { name: "Thu", income: 80, expenses: 60 },
    { name: "Fri", income: 100, expenses: 50 },
    { name: "Sat", income: 60, expenses: 90 },
    { name: "Sun", income: 90, expenses: 80 },
  ];

  const pieData = [
    { name: "Money Transfer", value: 4400 },
    { name: "Salary", value: 3044 },
    { name: "Investment", value: 560 },
    { name: "Rent", value: 100 },
    { name: "Other", value: 75 },
  ];

  const COLORS = ["#6366F1", "#EC4899", "#22C55E", "#F97316", "#EAB308"];

  const handleSaveWallet = (newWallet) => {
    setWallets((prev) => [...prev, newWallet]);
    setShowFormPopup(false);
  };

  const handleWalletClick = (wallet) => {
    setSelectedWallet(wallet);
    setShowDetailsPopup(true);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Wallet Dashboard</h1>
        <button
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          onClick={() => setShowFormPopup(true)}
        >
          <PlusCircle className="inline mr-2" />
          Add Wallet
        </button>
      </div>

      {showFormPopup && (
        <WalletFormPopup onClose={() => setShowFormPopup(false)} onSave={handleSaveWallet} />
      )}

      {showDetailsPopup && (
        <WalletDetailsPopup 
          wallet={selectedWallet} 
          onClose={() => setShowDetailsPopup(false)}
          onUpdate={handleUpdateWallet}
          onDelete={handleDeleteWallet}
        />
      )}

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Wallets</h2>
        
        {wallets.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <p className="text-gray-500">No wallets added yet.</p>
            <button 
              onClick={() => setShowFormPopup(true)}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
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

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Weekly Transactions</h2>
          <div className="h-[300px]">
            <LineChart width={500} height={300} data={transactionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#6366F1" 
                strokeWidth={2} 
                name="Income" 
                dot={{ r: 4 }} 
                activeDot={{ r: 6 }} 
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="#EF4444" 
                strokeWidth={2} 
                name="Expenses" 
                dot={{ r: 4 }} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Income Distribution</h2>
          <div className="h-[300px]">
            <PieChart width={500} height={300}>
              <Pie 
                data={pieData} 
                cx="50%" 
                cy="50%" 
                outerRadius={80} 
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`Rs.${value}`, "Amount"]} />
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;