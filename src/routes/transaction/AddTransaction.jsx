import React, { useState, useEffect } from 'react';
import { PlusCircle, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

// Configure axios to send cookies
axios.defaults.withCredentials = true;

function AddTransaction() {
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    transactionType: "",
    account: "",
    amount: 0,
    description: "",
    date: new Date().toISOString().split('T')[0],
    category: "",
    isRecurring: false,
    recurringInterval: ""
  });

  // Fetch accounts from backend
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get('http://localhost:8088/api/v1/accounts');
        const accountsData = response.data.data?.accounts || 
                         response.data.data || 
                         [];
    
        const formattedAccounts = accountsData.map(account => ({
          id: account._id || account.id,
          name: account.name,
          balance: account.balance
        }));
        
        setAccounts(formattedAccounts);
      } catch (error) {
        if (error.response?.status === 401) {
          handleUnauthorized();
        } else {
          toast.error('Failed to load accounts');
          console.error('Error fetching accounts:', error);
        }
      }
    };

    if (showForm) {
      fetchAccounts();
    }
  }, [showForm]);

  // Fetch categories when transaction type changes
  useEffect(() => {
    const fetchCategories = async () => {
      if (!newTransaction.transactionType) {
        setCategories([]);
        return;
      }

      try {
        setLoadingCategories(true);
        const response = await axios.get(
          `http://localhost:8088/api/v1/categories?type=${newTransaction.transactionType}`
        );
        
        const categoriesData = response.data.data?.categories || 
                           response.data.data || 
                           [];
        
        setCategories(categoriesData);
      } catch (error) {
        toast.error('Failed to load categories');
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [newTransaction.transactionType]);

  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   setNewTransaction({
  //     ...newTransaction,
  //     [name]: type === 'checkbox' ? checked : value,
  //     [name]: name === "amount" ? parseFloat(value) : value,
  //     // Reset category when transaction type changes
  //     ...(name === "transactionType" && { category: "" }),
  //     // Clear recurring interval if not recurring
  //     recurringInterval: name === "isRecurring" && !checked ? null : newTransaction.recurringInterval
  //   });
  // };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    let updatedTransaction = {
      ...newTransaction,
      [name]: type === 'checkbox' ? checked : name === "amount" ? parseFloat(value) : value,
    };
  
    // Reset category when transaction type changes
    if (name === "transactionType") {
      updatedTransaction.category = "";
    }
  
    // Handle recurringInterval conditionally
    if (name === "isRecurring") {
      if (checked) {
        updatedTransaction.recurringInterval = "daily"; // or any default value you like
      } else {
        delete updatedTransaction.recurringInterval;
      }
    }
  
    setNewTransaction(updatedTransaction);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post(
        "http://localhost:8088/api/v1/transactions", 
        {
          ...newTransaction,
          // Ensure category is sent as ID if it's an object
          category: typeof newTransaction.category === 'object' 
            ? newTransaction.category._id 
            : newTransaction.category
        }
      );

      toast.success("Transaction added successfully!");
      setShowForm(false);
      // Reset form
      setNewTransaction({
        transactionType: "",
        account: "",
        amount: 0,
        description: "",
        date: new Date().toISOString().split('T')[0],
        category: "",
        isRecurring: false,
        recurringInterval: ""
      });

      navigate('/transactions');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add transaction');
      console.error('Error adding transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Floating Add Button */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-full flex items-center shadow-lg transition-all duration-300 transform hover:scale-105"
      >
        <PlusCircle className="mr-2" size={20} />
        Add Transaction
      </button>
      
      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Add New Transaction</h2>
              <button 
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Transaction Type */}
                <div className="flex flex-col">
                  <label className="text-gray-700 mb-1 font-medium">Type*</label>
                  <select 
                    name="transactionType" 
                    value={newTransaction.transactionType} 
                    onChange={handleChange}
                    required
                    className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select Type</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>

                {/* Account */}
                <div className="flex flex-col">
                  <label className="text-gray-700 mb-1 font-medium">Account*</label>
                  <select
                    name="account"
                    value={newTransaction.account}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select Account</option>
                    {accounts.map(account => (
                      <option key={account.id} value={account.id}>
                        {account.name} (Rs. {account.balance})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount */}
                <div className="flex flex-col">
                  <label className="text-gray-700 mb-1 font-medium">Amount*</label>
                  <input 
                    type="number" 
                    name="amount" 
                    value={newTransaction.amount} 
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Date */}
                <div className="flex flex-col">
                  <label className="text-gray-700 mb-1 font-medium">Date*</label>
                  <input 
                    type="date" 
                    name="date" 
                    value={newTransaction.date} 
                    onChange={handleChange}
                    required
                    className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Category */}
                {newTransaction.transactionType && (
                  <div className="flex flex-col">
                    <label className="text-gray-700 mb-1 font-medium">Category*</label>
                    {loadingCategories ? (
                      <select 
                        disabled
                        className="border border-gray-300 p-2 rounded-lg bg-gray-100 animate-pulse"
                      >
                        <option>Loading categories...</option>
                      </select>
                    ) : (
                      <select 
                        name="category" 
                        value={typeof newTransaction.category === 'object' 
                          ? newTransaction.category._id 
                          : newTransaction.category} 
                        onChange={handleChange}
                        required
                        className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                {/* Description */}
                <div className="flex flex-col col-span-2">
                  <label className="text-gray-700 mb-1 font-medium">Description</label>
                  <input 
                    type="text" 
                    name="description" 
                    value={newTransaction.description} 
                    onChange={handleChange}
                    className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Optional description"
                  />
                </div>

                {/* Recurring Transaction */}
                <div className="flex items-center col-span-2">
                  <input 
                    type="checkbox" 
                    name="isRecurring" 
                    checked={newTransaction.isRecurring} 
                    onChange={handleChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-gray-700">Recurring Transaction</label>
                </div>

                {newTransaction.isRecurring && (
                  <div className="flex flex-col col-span-2">
                    <label className="text-gray-700 mb-1 font-medium">Recurring Interval</label>
                    <select 
                      name="recurringInterval" 
                      value={newTransaction.recurringInterval} 
                      onChange={handleChange}
                      required
                      className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select Interval</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Save Transaction'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddTransaction;