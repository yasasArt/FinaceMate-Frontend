import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

const WalletFormPopup = ({ onClose, onSave }) => {
    const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    accountType: "Checking",
    balance: 0,
    isDefault: false,  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      [name]: name === "balance" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post(
        "http://localhost:8088/api/v1/accounts",
        {
          ...formData,
          balance: parseFloat(formData.balance),
          isDefault: formData.isDefault === "Yes"
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // or your auth token
          }
        }
      )
      .then(response => {
        toast.success("Wallet added successfully!");
        onSave(response.data);
        onClose();
        // Reset form
        setFormData({
          name: "",
          accountType: "Checking",
          balance: 0,
          isDefault: false,
        });
      })
      .catch(error => {
        toast.error('Failed to add wallet');
        console.error('Error adding wallet:', error);
        if (error.response?.status === 401) {
          // Handle unauthorized access (e.g., redirect to login)
        }
      });
  
    } catch (error) {
      toast.error('Failed to add wallet');
      console.error('Error adding wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Add Wallet Details</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
            <select
              name="accountType"
              value={formData.accountType}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Checking">Select</option>
              <option value="savings">Savings Account</option>
              <option value="current">Current Account</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Balance</label>
            <input
              type="number"
              name="balance"
              value={formData.balance}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              step="0.01"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Default Account</label>
            <select
              name="isDefault"
              value={formData.isDefault}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
                disabled={loading}
                >
                {loading ? (
                    <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                    </>
                ) : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WalletFormPopup;