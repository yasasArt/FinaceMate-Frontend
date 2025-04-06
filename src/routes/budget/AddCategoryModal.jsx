import React, { useState } from "react";
import { X } from "lucide-react";

const AddCategoryModal = ({ isOpen, onClose, onAddCategory }) => {
  const [newCategory, setNewCategory] = useState({
    name: "",
    type: "expense",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newCategory.name && newCategory.type) {
      onAddCategory(newCategory);
      setNewCategory({ name: "", type: "expense" });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          onClick={onClose}
        >
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold mb-4">Add New Category</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Category Name</label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter category name"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Category Type</label>
            <select
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={newCategory.type}
              onChange={(e) =>
                setNewCategory({ ...newCategory, type: e.target.value })
              }
              required
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors"
          >
            Add Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;