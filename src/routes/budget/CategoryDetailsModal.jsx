import React, { useState, useEffect } from "react";
import { X, ArrowUp, ArrowDown, Edit2, Trash2, Save, ChevronDown, AlertTriangle } from "lucide-react";
import axios from "axios";

const CategoryDetailsModal = ({
  isOpen,
  onClose,
  category,
  onAddBudgetClick,
  onCategoryUpdate,
  onBudgetDelete,
  onCategoryDelete,
}) => {
  const [budget, setBudget] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    type: ""
  });
  const [budgetForm, setBudgetForm] = useState({
    limit: ""
  });

  useEffect(() => {
    const fetchBudget = async () => {
      if (!isOpen || !category || category.type !== "expense") return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `http://127.0.0.1:8088/api/v1/budgets/category/${category._id}`
        );
        setBudget(response.data?.data.budgets || null);
        if (response.data?.data?.budgets) {
          setBudgetForm({
            limit: response.data.data.budgets.limit.toString()
          });
        }
      } catch (err) {
        if (err.response?.status !== 404) {
          setError(err.response?.data?.message || "Failed to fetch budget");
        }
        setBudget(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBudget();
  }, [isOpen, category]);

  useEffect(() => {
    if (category) {
      setCategoryForm({
        name: category.name,
        type: category.type
      });
    }
  }, [category]);

  const handleCategoryDelete = async () => {
    try {
      setIsLoading(true);
      window.location.reload();
      await axios.delete(
        `http://127.0.0.1:8088/api/v1/categories/${category._id}`
      );
      onCategoryDelete(category._id);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete category");
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!isOpen || !category) return null;

  const formatCurrency = (value) => {
    return value ? parseFloat(value).toFixed(2) : "0.00";
  };

  const handleCategoryUpdate = async () => {
    try {
      setIsLoading(true);
      window.location.reload();
      const response = await axios.patch(
        `http://127.0.0.1:8088/api/v1/categories/${category._id}`,
        {
          name: categoryForm.name,
          type: categoryForm.type
        }
      );
      onCategoryUpdate(response.data.data);
      setIsEditingCategory(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update category");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBudgetUpdate = async () => {
    try {
      setIsLoading(true);
      window.location.reload();
      const response = await axios.patch(
        `http://127.0.0.1:8088/api/v1/budgets/${budget._id}`,
        {
          limit: parseFloat(budgetForm.limit)
        }
      );
      setBudget(response.data.data);
      setIsEditingBudget(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update budget");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBudgetDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this budget?")) return;
    
    try {
      setIsLoading(true);
      window.location.reload();
      await axios.delete(
        `http://127.0.0.1:8088/api/v1/budgets/${budget._id}`
      );
      onBudgetDelete();
      setBudget(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete budget");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl p-8 animate-modal-in">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 rounded-full focus:outline-none p-1 transition-colors"
          onClick={onClose}
          disabled={isLoading}
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-white bg-opacity-90 rounded-2xl flex flex-col items-center justify-center p-6 z-10">
            <div className="bg-red-100 p-4 rounded-full mb-4">
              <AlertTriangle className="text-red-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Category</h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete this category? This action cannot be undone.
              {budget && " The associated budget will also be deleted."}
            </p>
            <div className="flex gap-3 w-full">
              <button
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium transition-colors"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                onClick={handleCategoryDelete}
                disabled={isLoading}
              >
                {isLoading ? (
                  "Deleting..."
                ) : (
                  <>
                    <Trash2 size={18} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Category Header with Edit Option */}
        <div className="flex items-start justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center justify-center rounded-full w-10 h-10 
                ${categoryForm.type === "income" ? "bg-green-100" : "bg-red-100"}`}
            >
              {categoryForm.type === "income" ? (
                <ArrowUp className="text-green-500" size={22} />
              ) : (
                <ArrowDown className="text-red-500" size={22} />
              )}
            </div>
            <div>
              {isEditingCategory ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    className="w-full px-3 py-1 border rounded-lg text-lg font-bold"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                  />
                  <select
                    className="w-full px-3 py-1 border rounded-lg text-sm"
                    value={categoryForm.type}
                    onChange={(e) => setCategoryForm({...categoryForm, type: e.target.value})}
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900">{categoryForm.name}</h2>
                  <span className="capitalize text-xs font-medium text-gray-500">
                    {categoryForm.type}
                  </span>
                </>
              )}
            </div>
          </div>
          {!isEditingCategory ? (
            <div className="flex gap-2">
              <button
                className="text-gray-400 hover:text-purple-600 p-1"
                onClick={() => setIsEditingCategory(true)}
                disabled={isLoading}
              >
                <Edit2 size={18} />
              </button>
              <button
                className="text-gray-400 hover:text-red-600 p-1"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isLoading}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                className="text-green-500 hover:text-green-700 p-1"
                onClick={handleCategoryUpdate}
                disabled={isLoading}
              >
                <Save size={18} />
              </button>
              <button
                className="text-gray-400 hover:text-gray-700 p-1"
                onClick={() => setIsEditingCategory(false)}
                disabled={isLoading}
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Created Date */}
        <div className="mb-6 text-sm text-gray-400">
          Created: <span className="font-medium text-gray-600">{new Date(category.createdAt).toLocaleDateString()}</span>
        </div>

        {/* Budget Details or Actions */}
        <div className="mb-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <span className="animate-pulse text-purple-600 font-semibold">Loading...</span>
            </div>
          ) : error ? (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center">
              {error}
            </div>
          ) : category.type === "expense" ? (
            budget ? (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-800">Budget Details</h3>
                  <div className="flex gap-2">
                    {!isEditingBudget ? (
                      <button
                        className="text-gray-400 hover:text-purple-600 p-1"
                        onClick={() => setIsEditingBudget(true)}
                        disabled={isLoading}
                      >
                        <Edit2 size={18} />
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          className="text-green-500 hover:text-green-700 p-1"
                          onClick={handleBudgetUpdate}
                          disabled={isLoading}
                        >
                          <Save size={18} />
                        </button>
                        <button
                          className="text-gray-400 hover:text-gray-700 p-1"
                          onClick={() => setIsEditingBudget(false)}
                          disabled={isLoading}
                        >
                          <X size={18} />
                        </button>
                      </div>
                    )}
                    <button
                      className="text-gray-400 hover:text-red-600 p-1"
                      onClick={handleBudgetDelete}
                      disabled={isLoading}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl shadow-inner space-y-3">
                  {isEditingBudget ? (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">New Limit:</span>
                      <input
                        type="number"
                        className="w-24 px-2 py-1 border rounded text-right"
                        value={budgetForm.limit}
                        onChange={(e) => setBudgetForm({...budgetForm, limit: e.target.value})}
                        min="0.01"
                        step="0.01"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Total Limit:</span>
                        <span className="font-bold text-gray-800">
                          Rs. {formatCurrency(budget.limit)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Remaining:</span>
                        <span className="font-bold text-green-600">
                          Rs. {formatCurrency(budget.remainingLimit)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <p className="text-gray-500 mb-4">No budget set for this category.</p>
                <button
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg transition-all"
                  onClick={onAddBudgetClick}
                  disabled={isLoading}
                >
                  Add Budget
                </button>
              </div>
            )
          ) : (
            <div className="text-gray-500 text-center">
              Budgets can only be added to <span className="font-medium">expense</span> categories.
            </div>
          )}
        </div>

        <div className="flex">
          <button
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium transition-colors"
            onClick={onClose}
            disabled={isLoading}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetailsModal;