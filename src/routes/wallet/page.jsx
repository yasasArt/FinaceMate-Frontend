import React, { useState } from "react";
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
import WalletFormPopup from "./WalletFormPopup"; // Ensure correct import
import WalletOverview from "./WalletOverview";

const WalletPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [wallets, setWallets] = useState([]);

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
    setShowPopup(false); // Close popup after saving
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Wallet</h1>
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          onClick={() => setShowPopup(true)}
        >
          Add Wallet Details
        </button>
      </div>

      {showPopup && (
        <WalletFormPopup onClose={() => setShowPopup(false)} onSave={handleSaveWallet} />
      )}

      {/* Wallet Overview */}

      {/* <WalletOverview/> */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-lg font-medium">Total Balance</p>
            <p className="text-2xl font-semibold text-purple-600">Rs.15,700.00</p>
            <div className="mt-2 flex gap-2">
              <button className="px-4 py-2 bg-purple-500 text-white rounded-lg">
                Transfer
              </button>
              <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg">
                Request
              </button>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-400 to-purple-600 p-4 text-white rounded-xl shadow">
            <p className="text-lg font-medium">VISA</p>
            <p className="text-2xl font-semibold">Rs.8000.00</p>
            <p>**** **** 175</p>
          </div>
          <div className="bg-gradient-to-r from-pink-400 to-pink-600 p-4 text-white rounded-xl shadow">
            <p className="text-lg font-medium">Mastercard</p>
            <p className="text-2xl font-semibold">Rs.8000.00</p>
            <p>**** **** 325</p>
          </div>
        </div>

      {/* Display Wallet List */}
      <div className="mt-6 bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Your Wallets</h2>
        {wallets.length === 0 ? (
          <p className="text-gray-500">No wallets added yet.</p>
        ) : (
          <ul>
            {wallets.map((wallet, index) => (
              <li key={index} className="p-3 border-b">{wallet.name} - Rs.{wallet.balance}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Transaction Overview</h2>
          <LineChart width={400} height={300} data={transactionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#6366F1" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Statistics</h2>
          <PieChart width={400} height={300}>
            <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value">
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`Rs.${value}`, "Amount"]} />
            <Legend />
          </PieChart>
        </div>
      </div>

      <div className="mt-6 bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 font-medium text-gray-700">Date</th>
                <th className="p-3 font-medium text-gray-700">Amount</th>
                <th className="p-3 font-medium text-gray-700">Method</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-200 hover:bg-gray-50">
                <td className="p-3">28 Jan 12:52</td>
                <td className="p-3">Rs.12.32</td>
                <td className="p-3">VISA **3256</td>
              </tr>
              <tr className="border-t border-gray-200 hover:bg-gray-50">
                <td className="p-3">12 Jan 11:23</td>
                <td className="p-3">Rs.20</td>
                <td className="p-3">Mastercard **562</td>
              </tr>
              <tr className="border-t border-gray-200 hover:bg-gray-50">
                <td className="p-3">10 Feb 5:23</td>
                <td className="p-3">Rs.56.20</td>
                <td className="p-3">Mastercard **652</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
