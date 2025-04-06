import React, { useState } from "react";
import { X } from "lucide-react";

const AddBudgetModal = ({ isOpen, onClose, category, onAddBudget }) => {
  const [newBudget, setNewBudget] = useState({
    limit: "",
    remainingLimit: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newBudget.limit && category) {
      onAddBudget({
        limit: parseFloat(newBudget.limit),
        remainingLimit: parseFloat(newBudget.limit),
        category: category._id
      });
      setNewBudget({ limit: "", remainingLimit: "" });
    }
  };

  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          onClick={onClose}
        >
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold mb-4">
          Add Budget to {category.name}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Budget Limit</label>
            <input
              type="number"
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter budget limit"
              value={newBudget.limit}
              onChange={(e) =>
                setNewBudget({
                  limit: e.target.value,
                  remainingLimit: e.target.value,
                })
              }
              min="0.01"
              step="0.01"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors"
          >
            Add Budget
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBudgetModal;