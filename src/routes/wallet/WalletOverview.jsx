import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const WalletOverview = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8088/api/v1/accounts', {
          headers: {
            Authorization: `Bearer ${token}`, // Fixed template literal syntax
          },
        });

        // Adjust based on API response structure
        setWallets(response.data?.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch wallet data');
        toast.error('Failed to fetch wallet data');
      } finally {
        setLoading(false);
      }
    };

    fetchWallets();
  }, []);

  if (loading) return <div className="text-center py-4">Loading wallets...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;

  // Calculate total balance safely
  const totalBalance = wallets.reduce((sum, wallet) => sum + (wallet.balance || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Balance Card */}
      <div className="bg-white p-4 rounded-xl shadow">
        <p className="text-lg font-medium">Total Balance</p>
        <p className="text-2xl font-semibold text-purple-600">
          Rs.{totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </p>
        <div className="mt-2 flex gap-2">
          <button
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            aria-label="Transfer funds"
          >
            Transfer
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
            aria-label="Request funds"
          >
            Request
          </button>
        </div>
      </div>

      {/* Wallet Cards */}
      {wallets.slice(0, 2).map((wallet, index) => (
        <div
          key={wallet.id}
          className={`bg-gradient-to-r p-4 text-white rounded-xl shadow ${
            index % 2 === 0
              ? 'from-purple-400 to-purple-600'
              : 'from-pink-400 to-pink-600'
          }`}
        >
          <p className="text-lg font-medium">{wallet.accountType}</p>
          <p className="text-2xl font-semibold">
            Rs.{wallet.balance?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <p>{wallet.name}</p>
          {wallet.cardNumber && wallet.cardNumber.length >= 4 && (
            <p>**** **** {wallet.cardNumber.slice(-4)}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default WalletOverview;