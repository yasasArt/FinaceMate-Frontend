import React, { useState, useEffect } from "react";
import { X, Edit, Save, Trash2 } from "lucide-react";
import { jsPDF } from "jspdf";
import axios from "axios";

const WalletDetailsPopup = ({ wallet, onClose, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedWallet, setEditedWallet] = useState({ ...wallet });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  if (!wallet) return null;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8088/api/v1/accounts/${wallet._id}/transactions`
        );
        console.log("Transactions response:", response.data.data.transactions);
        setTransactions(response.data.data.transactions);
        setError(null);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to load transactions. Please try again.");
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    if (wallet._id) {
      fetchTransactions();
    }
  }, [wallet._id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedWallet(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    onUpdate(editedWallet);
    setIsEditing(false);
  };

  const handleGenerateReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Wallet Report", 10, 10);
    doc.setFontSize(12);
    doc.text(`Wallet Name: ${wallet.name}`, 10, 20);
    doc.text(`Balance: Rs. ${wallet.balance?.toLocaleString()}`, 10, 30);
    doc.text(`Remaining Balance: Rs. ${wallet.remainingBalance?.toLocaleString()}`, 10, 40);
    doc.text("Transactions:", 10, 50);
  
    transactions.forEach((transaction, index) => {
      const yPosition = 60 + index * 10;
      doc.text(
        `${new Date(transaction.date).toLocaleDateString()} - ${transaction.description} - ${transaction.category?.name || 'Uncategorized'} - Rs. ${transaction.amount}`,
        10,
        yPosition
      );
    });
  
    doc.save(`${wallet.name}_report.pdf`);
  };

  const balanceDifference = wallet.balance - wallet.remainingBalance;
  const utilizationPercentage = (balanceDifference / wallet.balance) * 100;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-30 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={editedWallet.name}
                onChange={handleInputChange}
                className="border-b border-gray-300 px-1 py-1 focus:outline-none focus:border-indigo-500"
              />
            ) : (
              wallet.name
            )}
            {wallet.isDefault && (
              <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full">
                Default Wallet
              </span>
            )}
          </h2>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                  title="Save Changes"
                >
                  <Save size={20} />
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 text-gray-500 hover:bg-gray-50 rounded-full"
                  title="Cancel"
                >
                  <X size={20} />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full"
                title="Edit Wallet"
              >
                <Edit size={20} />
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 text-gray-500 hover:bg-gray-50 rounded-full"
              title="Close"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Wallet Summary */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm text-indigo-600 mb-1">Current Balance</p>
                <p className="text-2xl font-bold text-gray-800">
                  Rs. {wallet.balance?.toLocaleString()}
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600 mb-1">Available Balance</p>
                <p className="text-2xl font-bold text-gray-800">
                  Rs. {wallet.remainingBalance?.toLocaleString()}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Utilized Amount</p>
                <p className={`text-2xl font-bold ${
                  balanceDifference > 0 ? 'text-red-600' : 'text-gray-800'
                }`}>
                  Rs. {balanceDifference.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Balance Utilization Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Balance Utilization</span>
                <span>{utilizationPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full" 
                  style={{ width: `${utilizationPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Wallet Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Account Type</p>
                {isEditing ? (
                  <select
                    name="accountType"
                    value={editedWallet.accountType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="savings">Savings</option>
                    <option value="current">Current</option>
                  </select>
                ) : (
                  <p className="font-medium capitalize">{wallet.accountType} Account</p>
                )}
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Deposit Balance</p>
                <p className="font-mono">
                    Rs. 
                    {isEditing ? (
                    <input
                        type="number"
                        name="balance"
                        value={editedWallet.balance}
                        onChange={handleInputChange}
                        className="font-mono"
                    />
                    ) : (
                    wallet.balance
                    )}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Created On</p>
                <p className="font-medium">
                  {new Date(wallet.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              
              <div className="flex items-center">
                <p className="text-sm text-gray-500 mr-2">Default Wallet</p>
                {isEditing ? (
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={editedWallet.isDefault}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                ) : (
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    wallet.isDefault ? 'bg-indigo-100 text-indigo-800' : 'bg-red-100 text-gray-800'
                  }`}>
                    {wallet.isDefault ? 'Yes' : 'No'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Transactions Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
              <button className="text-sm text-indigo-600 hover:text-indigo-800">
                View All Transactions
              </button>
            </div>
            
            {loading ? (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                <p>Loading transactions...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                <p className="text-red-500">{error}</p>
                <button 
                  className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            ) : transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <tr key={transaction._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {transaction.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {transaction.category?.name || 'Uncategorized'}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                          transaction.transactionType === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.transactionType === 'income' ? '+' : '-'}
                          Rs. {Math.abs(transaction.amount).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                <p>No transactions found for this wallet</p>
                <button className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm">
                  Add your first transaction
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white p-4 border-t flex justify-between items-center">
          <button
            onClick={() => onDelete(wallet._id)}
            className="flex items-center text-red-600 hover:text-red-800"
          >
            <Trash2 size={18} className="mr-2" />
            Delete Wallet
          </button>
          <div className="flex gap-4">
            <button
              onClick={handleGenerateReport}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              disabled={loading || error}
            >
              Generate Report
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletDetailsPopup;