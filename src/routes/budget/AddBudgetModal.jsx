import React, { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";

axios.defaults.withCredentials = true;

const AddBudgetModal = ({ isOpen, onClose, category, onAddBudget }) => {
  const [newBudget, setNewBudget] = useState({
    limit: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!newBudget.limit || !category) return;

    setIsLoading(true);
    
    try {
      const response = await axios.post("http://localhost:8088/api/v1/budgets", {
        limit: parseFloat(newBudget.limit),
        category: category._id
      });

      // Call the parent component's callback if needed
      if (onAddBudget) {
        onAddBudget(response.data.data);
      }
      
      // Reset form and close modal
      setNewBudget({ limit: "" });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add budget");
      console.error("Error adding budget:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          onClick={onClose}
          disabled={isLoading}
        >
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold mb-4">
          Add Budget to {category.name}
        </h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Budget Limit</label>
            <input
              type="number"
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter budget limit"
              value={newBudget.limit}
              onChange={(e) => setNewBudget({ limit: e.target.value })}
              min="0.01"
              step="0.01"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors disabled:bg-purple-400"
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Budget"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBudgetModal;