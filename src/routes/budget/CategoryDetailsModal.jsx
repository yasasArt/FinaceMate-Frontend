import React, { useState } from "react";
import { X, ArrowUp, ArrowDown } from "lucide-react";

const CategoryDetailsModal = ({
  isOpen,
  onClose,
  category,
  onAddBudgetClick,
}) => {
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
        <h2 className="text-xl font-bold mb-4">{category.name}</h2>

        <div className="mb-4">
          <div className="flex items-center mb-2">
            {category.type === "income" ? (
              <ArrowUp className="text-green-500 mr-2" size={18} />
            ) : (
              <ArrowDown className="text-red-500 mr-2" size={18} />
            )}
            <span className="capitalize">{category.type}</span>
          </div>
          <div className="text-sm text-gray-500">
            Created: {new Date(category.createdAt).toLocaleDateString()}
          </div>
        </div>

        {category.budget ? (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Budget Details</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Total Limit:</span>
                <span className="font-medium">${category.budget.limit}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Remaining:</span>
                <span className="font-medium">${category.budget.remainingLimit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Spent:</span>
                <span className="font-medium">
                  ${category.budget.limit - category.budget.remainingLimit}
                </span>
              </div>
            </div>
          </div>
        ) : category.type === "expense" ? (
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              No budget set for this category.
            </p>
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              onClick={onAddBudgetClick}
            >
              Add Budget
            </button>
          </div>
        ) : (
          <div className="mb-6">
            <p className="text-gray-600">
              Budgets can only be added to expense categories.
            </p>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetailsModal;