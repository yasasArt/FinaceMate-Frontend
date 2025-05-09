import { useState, useEffect } from "react";
import GoalCard from "./GoalCard";
import { FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";

import {
  FaPlus,
  FaTrophy,
  FaChevronDown,
  FaTimes,
  FaPiggyBank,
  FaSearch,
} from "react-icons/fa";
import axios from "axios";
import GoalDetailsModal from "./GoalDetailsModal";

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [newGoal, setNewGoal] = useState({
    name: "",
    description: "",
    totalAmount: 0,
    contributionAmount: 0,
    contributionInterval: "monthly",
    account: "",
  });
  const [showCompletedGoals, setShowCompletedGoals] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch goals and accounts from backend
  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch goals
      const goalsResponse = await axios.get(
        "http://localhost:8088/api/v1/goals",
        {
          withCredentials: true,
        }
      );
      setGoals(goalsResponse.data.data.goals);

      // Fetch accounts
      const accountsResponse = await axios.get(
        "http://localhost:8088/api/v1/accounts",
        {
          withCredentials: true,
        }
      );
      setAccounts(accountsResponse.data.data.accounts);

      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Create new goal
  const handleCreateGoal = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8088/api/v1/goals",
        newGoal,
        {
          withCredentials: true,
        }
      );
      setGoals([...goals, response.data.data]);
      setShowCreateModal(false);
      setNewGoal({
        name: "",
        description: "",
        totalAmount: 0,
        contributionAmount: 0,
        contributionInterval: "monthly",
        account: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create goal");
      console.error("Error creating goal:", err);
    }
  };

  // Update goal
  const handleUpdateGoal = async (updatedGoal) => {
    try {
      const response = await axios.patch(
        `http://localhost:8088/api/v1/goals/${updatedGoal._id}`,
        updatedGoal,
        {
          withCredentials: true,
        }
      );
      setGoals(
        goals.map((goal) =>
          goal._id === updatedGoal._id ? response.data.data : goal
        )
      );
      setSelectedGoal(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update goal");
      console.error("Error updating goal:", err);
    }
  };

  // Delete goal
  const handleDeleteGoal = async (goalId) => {
    try {
      await axios.delete(`http://localhost:8088/api/v1/goals/${goalId}`, {
        withCredentials: true,
      });
      setGoals(goals.filter((goal) => goal._id !== goalId));
      setSelectedGoal(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete goal");
      console.error("Error deleting goal:", err);
    }
  };

  // Filter goals based on search term
  const filteredGoals = goals.filter(
    (goal) =>
      goal.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ongoingGoals = filteredGoals.filter(
    (goal) => goal.goalStatus === "ongoing"
  );
  const completedGoals = filteredGoals.filter(
    (goal) => goal.goalStatus === "completed"
  );

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("My Financial Goals", 14, 22);
    doc.setFontSize(12);

    let y = 32;

    goals.forEach((goal, index) => {
      doc.text(`${index + 1}. ${goal.name}`, 14, y);
      y += 6;
      doc.text(`   Description: ${goal.description || "N/A"}`, 14, y);
      y += 6;
      doc.text(`   Target: $${goal.totalAmount.toFixed(2)}`, 14, y);
      y += 6;
      doc.text(
        `   Contribution: $${goal.contributionAmount.toFixed(2)} (${
          goal.contributionInterval
        })`,
        14,
        y
      );
      y += 6;
      doc.text(`   Status: ${goal.goalStatus}`, 14, y);
      y += 10;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("financial_goals.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto">
        {/* Error message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg">
            <p>{error}</p>
          </div>
        )}

        {/* Header and Search Bar */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                My Financial Goals
              </h1>
              <p className="text-gray-500 mt-1">
                {ongoingGoals.length} active, {completedGoals.length} completed
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              <FaPlus /> New Goal
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              <FaDownload /> Download PDF
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by Goal Name or Description"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <FaTimes className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main goals area */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
                Active Goals
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {ongoingGoals.length}
                </span>
              </h2>

              {ongoingGoals.length === 0 ? (
                <div className="bg-white p-8 rounded-xl shadow-sm text-center border-2 border-dashed border-gray-200">
                  <div className="text-gray-400 mb-3">
                    <FaPiggyBank size={32} className="mx-auto" />
                  </div>
                  <p className="text-gray-500 mb-4">
                    {searchTerm
                      ? "No matching goals found"
                      : "You don't have any active goals yet."}
                  </p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {searchTerm ? "Clear search" : "Create your first goal →"}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ongoingGoals.map((goal) => (
                    <GoalCard
                      key={goal._id}
                      goal={goal}
                      onClick={() => setSelectedGoal(goal)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Completed goals section */}
            <div className="lg:w-80">
              <div
                className="flex items-center justify-between cursor-pointer p-3 bg-white rounded-t-lg shadow-sm border-b border-gray-200"
                onClick={() => setShowCompletedGoals(!showCompletedGoals)}
              >
                <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                  <FaTrophy className="text-yellow-500" />
                  Achieved Goals
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {completedGoals.length}
                  </span>
                </h2>
                <FaChevronDown
                  className={`text-gray-400 transition-transform ${
                    showCompletedGoals ? "transform rotate-180" : ""
                  }`}
                />
              </div>

              {showCompletedGoals && (
                <div className="bg-white rounded-b-lg shadow-sm">
                  {completedGoals.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      {searchTerm
                        ? "No matching completed goals"
                        : "No completed goals yet"}
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {completedGoals.map((goal) => (
                        <li
                          key={goal._id}
                          className="p-3 hover:bg-gray-50 cursor-pointer transition-colors group"
                          onClick={() => setSelectedGoal(goal)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-gray-800 group-hover:text-blue-600">
                                {goal.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Saved: ${goal.totalAmount.toFixed(2)}
                              </p>
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Completed
                            </span>
                          </div>
                          <div className="mt-2 flex justify-between text-xs text-gray-400">
                            <span>
                              Created:{" "}
                              {new Date(goal.createdAt).toLocaleDateString()}
                            </span>
                            <span>Click to view</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Create Goal Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Create New Goal
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Goal Name*
                  </label>
                  <input
                    type="text"
                    value={newGoal.name}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, name: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. New Laptop"
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, description: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="2"
                    placeholder="Short description..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Amount*
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-400">
                        $
                      </span>
                      <input
                        type="number"
                        value={newGoal.totalAmount}
                        onChange={(e) =>
                          setNewGoal({
                            ...newGoal,
                            totalAmount: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full p-2 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contribution*
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-400">
                        $
                      </span>
                      <input
                        type="number"
                        value={newGoal.contributionAmount}
                        onChange={(e) =>
                          setNewGoal({
                            ...newGoal,
                            contributionAmount: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full p-2 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frequency*
                    </label>
                    <select
                      value={newGoal.contributionInterval}
                      onChange={(e) =>
                        setNewGoal({
                          ...newGoal,
                          contributionInterval: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account*
                    </label>
                    <select
                      value={newGoal.account}
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, account: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Account</option>
                      {accounts.map((account) => (
                        <option key={account._id} value={account._id}>
                          {account.name} (${account.balance.toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateGoal}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                  disabled={
                    !newGoal.name ||
                    !newGoal.totalAmount ||
                    !newGoal.contributionAmount ||
                    !newGoal.account
                  }
                >
                  Create Goal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Goal Details Modal */}
        {selectedGoal && (
          <GoalDetailsModal
            goal={selectedGoal}
            onClose={() => setSelectedGoal(null)}
            onUpdate={handleUpdateGoal}
            onDelete={handleDeleteGoal}
          />
        )}
      </div>
    </div>
  );
};

export default GoalsPage;
