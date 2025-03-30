import React, { useState } from "react";
import {
  MoreHorizontal,
  Edit2,
  CheckCircle,
  AlertCircle,
  X,
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
  const [newBudget, setNewBudget] = useState({
    category: "",
    budget: "",
    spent: 0,
  });

  const [isSetLimitModalOpen, setIsSetLimitModalOpen] = useState(false);
  const [limitCategory, setLimitCategory] = useState("");
  const [newLimit, setNewLimit] = useState("");

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

  const handleSetLimit = () => {
    const updatedBudgets = budgets.map((budget) =>
      budget.category === limitCategory
        ? { ...budget, budget: parseFloat(newLimit) }
        : budget
    );
    setBudgets(updatedBudgets);
    setIsSetLimitModalOpen(false);
  };

  const totalBudget = budgets.reduce((acc, curr) => acc + curr.budget, 0);
  const totalSpent = budgets.reduce((acc, curr) => acc + curr.spent, 0);


  {/* Set Budget Limit Modal */}
  {isSetLimitModalOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 relative">
        <button
          className="absolute top-4 right-4 text-gray-500"
          onClick={() => setIsSetLimitModalOpen(false)}
        >
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold mb-4">Set Budget Limit</h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">New Limit</label>
          <input
            type="number"
            className="w-full border rounded-lg p-2"
            placeholder="Enter new limit"
            value={newLimit}
            onChange={(e) => setNewLimit(e.target.value)}
          />
        </div>

        <button
          className="w-full bg-purple-500 text-white py-2 rounded-lg"
          onClick={handleSetLimit}
        >
          Set Limit
        </button>
      </div>
    </div>
  )}

  return (
    <div className="bg-white p-6 max-w-4xl mx-auto relative">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <button className="text-gray-500">This month</button>
          <select className="text-gray-500 bg-transparent">
            <option>Sort by: Default</option>
          </select>
          <button className="text-gray-500">Reset all</button>
        </div>
        <button
          className="bg-purple-500 text-white px-4 py-2 rounded-lg"
          onClick={() => setIsAddBudgetModalOpen(true)}
        >
          + Add new budget
        </button>
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

      

      {/* Budget Summary */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-lg">Overall Budget</h3>
        <div className="flex justify-between mt-2">
          <span>Total Budget: </span>
          <span>${totalBudget}</span>
        </div>
        <div className="flex justify-between mt-1">
          <span>Total Spent: </span>
          <span>${totalSpent}</span>
        </div>
        <div className="flex justify-between mt-1">
          <span>Remaining Budget: </span>
          <span>${totalBudget - totalSpent}</span>
        </div>
      </div>

      {/* Budget List */}
      <div className="grid grid-cols-3 gap-4">
        {budgets.map((budget, index) => (
          <div key={index} className="border rounded-lg p-4 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">{budget.category}</h3>
              <button
                onClick={() => {
                  setLimitCategory(budget.category);
                  setIsSetLimitModalOpen(true);
                }}
              >
                <MoreHorizontal className="text-gray-500" size={20} />
              </button>
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
    </div>
  );
};

export default Budgetpage;
