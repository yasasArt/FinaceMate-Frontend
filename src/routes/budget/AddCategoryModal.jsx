import React, { useState } from "react";
import { X, ArrowDown, ArrowUp } from "lucide-react";

const AddCategoryModal = ({ isOpen, onClose, onAddCategory }) => {
  const [newCategory, setNewCategory] = useState({
    name: "",
    type: "expense",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newCategory.name && newCategory.type) {
      setIsSubmitting(true);
      try {
        await onAddCategory(newCategory);
        setNewCategory({ name: "", type: "expense" });
        onClose();
      } catch (error) {
        console.error("Error adding category:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all">
      <div 
        className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-xl p-8 animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 rounded-full focus:outline-none p-1 transition-colors"
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Create New Category</h2>
          <p className="text-gray-500 mt-1">Organize your transactions</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="e.g. Groceries, Salary"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Type Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Type
            </label>
            <div className="relative">
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-no-repeat bg-[right_1rem_center] bg-[length:1.5em_1.5em]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`
                }}
                value={newCategory.type}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, type: e.target.value })
                }
                required
                disabled={isSubmitting}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <div className="absolute right-3 top-3.5 pointer-events-none">
                {newCategory.type === "income" ? (
                  <ArrowUp className="text-green-500" size={18} />
                ) : (
                  <ArrowDown className="text-red-500" size={18} />
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md transition-all flex items-center justify-center ${
              isSubmitting ? "opacity-75" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              "Create Category"
            )}
          </button>
        </form>
      </div>

      {/* Modal animation styles */}
      <style jsx>{`
        .animate-modal-in {
          animation: modalIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default AddCategoryModal;