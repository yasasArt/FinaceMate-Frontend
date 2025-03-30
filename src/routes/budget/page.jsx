import React, { useState } from "react";
import {
  MoreHorizontal,
  Edit2,
  CheckCircle,
  AlertCircle,
  X,
  Trash2,
  Save,
} from "lucide-react";

const Budgetpage = () => {
  const [budgets, setBudgets] = useState([
    {
      category: "Food & Groceries",
      spent: 487,
      budget: 650,
      status: "on-track",
    },
    {
      category: "Cafe & Restaurants",
      spent: 1270,
      budget: 2100,
      status: "on-track",
    },
    {
      category: "Health & Beauty",
      spent: 235,
      budget: 500,
      status: "on-track",
    },
    {
      category: "Traveling",
      spent: 350,
      budget: 400,
      status: "need-attention",
    },
    {
      category: "Investments",
      spent: 200,
      budget: 600,
      status: "on-track",
    },
    {
      category: "Entertainment",
      spent: 150,
      budget: 1500,
      status: "on-track",
    },
  ]);

  const [isAddBudgetModalOpen, setIsAddBudgetModalOpen] = useState(false);
  const [isBudgetLimitModalOpen, setIsBudgetLimitModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);
  const [budgetToEdit, setBudgetToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({
    category: "",
    budget: "",
    spent: 0,
  });
  const [newBudget, setNewBudget] = useState({
    category: "",
    budget: "",
    spent: 0,
  });
  const [budgetLimit, setBudgetLimit] = useState(0);

  const categories = [
    "Food & Groceries",
    "Cafe & Restaurants",
    "Health & Beauty",
    "Traveling",
    "Investments",
    "Entertainment",
    "Utilities",
    "Shopping",
    "Transportation",
  ];

  const getStatusColor = (status) => {
    return status === "on-track" ? "text-green-500" : "text-orange-500";
  };

  const calculatePercentage = (spent, budget) => {
    return Math.round((spent / budget) * 100);
  };

  const calculateTotalSpent = () => budgets.reduce((acc, curr) => acc + curr.spent, 0);
  const calculateTotalBudget = () => budgets.reduce((acc, curr) => acc + curr.budget, 0);
  const totalSpent = calculateTotalSpent();
  const totalBudget = calculateTotalBudget();
  const budgetUsage = Math.round((totalSpent / totalBudget) * 100);

  const handleAddBudget = () => {
    if (newBudget.category && newBudget.budget) {
      const budgetToAdd = {
        ...newBudget,
        budget: parseFloat(newBudget.budget),
        status: "on-track",
      };
      setBudgets([...budgets, budgetToAdd]);
      setNewBudget({ category: "", budget: "", spent: 0 });
      setIsAddBudgetModalOpen(false);
    }
  };

  // Open edit form
  const openEditForm = (index) => {
    setBudgetToEdit(index);
    setEditFormData({
      category: budgets[index].category,
      budget: budgets[index].budget,
      spent: budgets[index].spent,
    });
    setIsEditFormOpen(true);
  };

  // Save edited budget
  const handleSaveEdit = () => {
    if (budgetToEdit !== null && editFormData.budget) {
      const updatedBudgets = [...budgets];
      updatedBudgets[budgetToEdit] = {
        ...updatedBudgets[budgetToEdit],
        budget: parseFloat(editFormData.budget),
        spent: parseFloat(editFormData.spent),
        // Update status based on new values
        status: parseFloat(editFormData.spent) / parseFloat(editFormData.budget) > 0.9 
          ? "need-attention" 
          : "on-track"
      };
      setBudgets(updatedBudgets);
      setIsEditFormOpen(false);
      setBudgetToEdit(null);
    }
  };

  // Open delete confirmation modal
  const confirmDeleteBudget = (index) => {
    setBudgetToDelete(index);
    setIsDeleteConfirmationOpen(true);
  };

  // Delete budget after confirmation
  const handleDeleteBudget = () => {
    if (budgetToDelete !== null) {
      const updatedBudgets = [...budgets];
      updatedBudgets.splice(budgetToDelete, 1);
      setBudgets(updatedBudgets);
      setIsDeleteConfirmationOpen(false);
      setBudgetToDelete(null);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setIsDeleteConfirmationOpen(false);
    setBudgetToDelete(null);
  };

  // Cancel edit
  const cancelEdit = () => {
    setIsEditFormOpen(false);
    setBudgetToEdit(null);
  };

  return (
    <div className="p-6 mx-auto relative">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <button className="text-gray-500">This month</button>
          <select className="text-gray-500 bg-transparent">
            <option>Sort by: Default</option>
          </select>
          <button className="text-gray-500">Reset all</button>
        </div>
        <div className="flex space-x-4">
          <button
            className="bg-purple-500 text-white px-4 py-2 rounded-lg"
            onClick={() => setIsAddBudgetModalOpen(true)}
          >
            + Add new budget
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={() => setIsBudgetLimitModalOpen(true)}
          >
            Add Budget Limit
          </button>
        </div>
      </div>

      {/* Budget Usage Progress Bar */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Total Budget Usage</h3>
        <div className="w-full bg-gray-300 rounded-full h-4">
          <div
            className="bg-purple-500 h-4 rounded-full"
            style={{ width: `${budgetUsage}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2">
          <span>${totalSpent} spent</span>
          <span>{budgetUsage}% of ${totalBudget}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {budgets.map((budget, index) => (
          <div key={index} className="border rounded-lg p-4 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">{budget.category}</h3>
              <div className="flex space-x-2">
                <button onClick={() => openEditForm(index)}>
                  <Edit2 className="text-gray-500" size={20} />
                </button>
                <button onClick={() => confirmDeleteBudget(index)}>
                  <Trash2 className="text-red-500" size={20} />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative w-20 h-20">
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E0E0E0"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#8A56F8"
                    strokeWidth="3"
                    strokeDasharray={`${calculatePercentage(
                      budget.spent,
                      budget.budget
                    )}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold">
                    {calculatePercentage(budget.spent, budget.budget)}%
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold">${budget.spent}</span>
                  <span className="text-gray-500">/ ${budget.budget}</span>
                </div>
                <div
                  className={`flex items-center space-x-1 ${getStatusColor(
                    budget.status
                  )}`}
                >
                  {budget.status === "on-track" ? (
                    <CheckCircle size={16} />
                  ) : (
                    <AlertCircle size={16} />
                  )}
                  <span className="text-sm capitalize">
                    {budget.status.replace("-", " ")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Most expenses</h3>
          <select className="text-gray-500 bg-transparent">
            <option>This month</option>
          </select>
        </div>
        <div>{/* Most expenses list would go here */}</div>
      </div>

      {/* Add Budget Modal */}
      {isAddBudgetModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 relative">
            <button
              className="absolute top-4 right-4 text-gray-500"
              onClick={() => setIsAddBudgetModalOpen(false)}
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4">Add New Budget</h2>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Category</label>
              <select
                className="w-full border rounded-lg p-2"
                value={newBudget.category}
                onChange={(e) =>
                  setNewBudget({ ...newBudget, category: e.target.value })
                }
              >
                <option value="">Select Category</option>
                {categories
                  .filter(
                    (cat) => !budgets.some((budget) => budget.category === cat)
                  )
                  .map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Budget Amount</label>
              <input
                type="number"
                className="w-full border rounded-lg p-2"
                placeholder="Enter budget amount"
                value={newBudget.budget}
                onChange={(e) =>
                  setNewBudget({ ...newBudget, budget: e.target.value })
                }
              />
            </div>

            <button
              className="w-full bg-purple-500 text-white py-2 rounded-lg"
              onClick={handleAddBudget}
            >
              Add Budget
            </button>
          </div>
        </div>
      )}

      {/* Budget Limit Modal */}
      {isBudgetLimitModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 relative">
            <button
              className="absolute top-4 right-4 text-gray-500"
              onClick={() => setIsBudgetLimitModalOpen(false)}
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4">Set Budget Limit</h2>
            <input
              type="number"
              className="w-full border rounded-lg p-2 mb-4"
              placeholder="Enter total budget limit"
              value={budgetLimit}
              onChange={(e) => setBudgetLimit(e.target.value)}
            />
            <button
              className="w-full bg-blue-500 text-white py-2 rounded-lg"
              onClick={() => setIsBudgetLimitModalOpen(false)}
            >
              Set Limit
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmationOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 relative">
            <button
              className="absolute top-4 right-4 text-gray-500"
              onClick={cancelDelete}
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-6">
              Are you sure you want to delete the "{budgets[budgetToDelete]?.category}" budget? 
              This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-red-500 text-white py-2 rounded-lg"
                onClick={handleDeleteBudget}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Budget Modal */}
      {isEditFormOpen && budgetToEdit !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 relative">
            <button
              className="absolute top-4 right-4 text-gray-500"
              onClick={cancelEdit}
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4">
              Edit {budgets[budgetToEdit].category} Budget
            </h2>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Budget Amount</label>
              <input
                type="number"
                className="w-full border rounded-lg p-2"
                placeholder="Enter budget amount"
                value={editFormData.budget}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, budget: e.target.value })
                }
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Amount Spent</label>
              <input
                type="number"
                className="w-full border rounded-lg p-2"
                placeholder="Enter amount spent"
                value={editFormData.spent}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, spent: e.target.value })
                }
              />
            </div>

            <div className="flex space-x-3">
              <button
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg"
                onClick={cancelEdit}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-purple-500 text-white py-2 rounded-lg flex items-center justify-center"
                onClick={handleSaveEdit}
              >
                <Save size={18} className="mr-1" />
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgetpage;