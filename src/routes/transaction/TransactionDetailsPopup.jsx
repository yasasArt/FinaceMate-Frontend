import { useState } from "react";
import axios from "axios";

const TransactionDetailsPopup = ({
  transaction,
  onClose,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTransaction, setEditedTransaction] = useState({ ...transaction });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTransaction((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.patch(
            `http://127.0.0.1:8088/api/v1/transactions/${transaction.id}`,
            editedTransaction,
            { withCredentials: true }
        );
        onUpdate(editedTransaction);
        setIsEditing(false);
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-100">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">
            {isEditing ? "Edit Transaction" : "Transaction Details"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
  
        {isEditing ? (
          // Edit Form
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={editedTransaction.amount}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={editedTransaction.description || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={editedTransaction.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
  
              {transaction.isRecurring && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recurring Interval
                  </label>
                  <select
                    name="recurringInterval"
                    value={editedTransaction.recurringInterval}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              )}
            </div>
  
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          // View Mode
          <>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-500">Date</span>
                <span className="text-sm font-semibold text-gray-800">
                  {new Date(transaction.date).toLocaleString()}
                </span>
              </div>
  
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-500">Amount</span>
                <span className="text-lg font-bold text-gray-800">
                  {transaction.amount}
                </span>
              </div>
  
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-500">Wallet</span>
                <span className="text-sm font-semibold text-gray-800">
                  {transaction.account?.slug}
                </span>
              </div>
  
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-500">Description</span>
                <span className="text-sm font-semibold text-gray-800">
                  {transaction.description || "—"}
                </span>
              </div>
  
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-500">Category</span>
                <span className="text-sm font-semibold text-gray-800">
                  {transaction.category}
                </span>
              </div>
  
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-500">Type</span>
                <span className="text-sm font-semibold text-gray-800">
                  {transaction.transactionType}
                </span>
              </div>
  
              {transaction.isRecurring && (
                <>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-blue-600">Recurring</span>
                    <span className="text-sm font-semibold text-blue-800">Yes</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-blue-600">Interval</span>
                    <span className="text-sm font-semibold text-blue-800 capitalize">
                      {transaction.recurringInterval}
                    </span>
                  </div>
                </>
              )}
            </div>
  
            <div className="flex justify-end space-x-3 pt-6">
              <button
                onClick={() => onDelete(transaction.id)}
                className="px-5 py-2 rounded-lg border border-red-500 text-red-600 hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
              >
                Edit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionDetailsPopup;