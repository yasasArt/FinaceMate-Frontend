import { useState } from "react";
import { 
  FaTimes, 
  FaInfoCircle, 
  FaCalendarAlt, 
  FaPiggyBank,
  FaTrash,
  FaEdit,
  FaCheckCircle,
  FaWallet
} from "react-icons/fa";
import { MdAttachMoney, MdDone } from "react-icons/md";

const GoalDetailsModal = ({ goal, onClose, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedGoal, setUpdatedGoal] = useState(goal);

  const { 
    name, 
    description, 
    totalAmount, 
    balance, 
    goalStatus,
    account,
    contributionAmount,
    contributionInterval,
    nextContributionDate,
    createdAt
  } = updatedGoal;
  
  const progress = Math.min(Math.round(((totalAmount-balance) / totalAmount) * 100), 100);
  const daysSinceCreation = Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24));
  const estimatedDaysLeft = Math.ceil(((balance) / contributionAmount) * getIntervalMultiplier(contributionInterval));
  
  function getIntervalMultiplier(interval) {
    switch(interval) {
      case 'daily': return 1;
      case 'weekly': return 7;
      case 'monthly': return 30;
      default: return 1;
    }
  }
  
  function formatInterval(interval) {
    return interval.charAt(0).toUpperCase() + interval.slice(1);
  }
  
  function formatDate(dateString) {
    if (!dateString) return "Not set";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  const handleInputChange = (e) => {
    setUpdatedGoal({ ...updatedGoal, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    onUpdate(updatedGoal);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      onDelete(goal.id);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={updatedGoal.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    autoFocus
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    {name}
                    {progress >= 100 && (
                      <span className="text-green-500">
                        <FaCheckCircle size={20} />
                      </span>
                    )}
                  </div>
                )}
              </h2>
              {!isEditing && (
                <p className="text-sm text-gray-500 mt-1">
                  {goalStatus === 'completed' ? 'Goal achieved!' : `${estimatedDaysLeft} days left to reach your goal`}
                </p>
              )}
            </div>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-6">
              {/* Edit Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={updatedGoal.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Add a description for your goal..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-400">$</span>
                      <input
                        type="number"
                        name="totalAmount"
                        value={updatedGoal.totalAmount}
                        onChange={handleInputChange}
                        className="w-full p-2 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Balance</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-400">$</span>
                      <input
                        type="number"
                        name="balance"
                        value={updatedGoal.balance}
                        onChange={handleInputChange}
                        className="w-full p-2 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contribution</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-400">$</span>
                      <input
                        type="number"
                        name="contributionAmount"
                        value={updatedGoal.contributionAmount}
                        onChange={handleInputChange}
                        className="w-full p-2 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                    <select
                      name="contributionInterval"
                      value={updatedGoal.contributionInterval}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-4 border-t border-gray-200">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                  >
                    <FaTrash /> Delete
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <MdDone /> Save Changes
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Progress Section */}
              <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    <span className="text-blue-600 font-semibold">Rs. {(totalAmount.toFixed(2)-balance.toFixed(2))}</span> 
                    <span className="text-gray-500"> of Rs. {totalAmount.toFixed(2)}</span>
                  </span>
                  <span className={`text-sm font-semibold ${progress >= 100 ? 'text-green-600' : 'text-blue-600'}`}>
                    {progress}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className={`h-3 rounded-full ${progress >= 100 ? 'bg-green-500' : 'bg-blue-500'} transition-all duration-500`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Started {daysSinceCreation} days ago</span>
                  <span>{estimatedDaysLeft} days remaining</span>
                </div>
              </div>

              {/* Details Section */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600 flex-shrink-0">
                    <FaInfoCircle size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Description</h4>
                    <p className="text-gray-700 mt-1">
                      {description || <span className="text-gray-400">No description provided</span>}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="p-2 bg-purple-100 rounded-lg text-purple-600 flex-shrink-0">
                    <MdAttachMoney size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Contribution</h4>
                    <p className="text-gray-700 mt-1">
                      <span className="font-medium">Rs. {contributionAmount.toFixed(2)}</span> {formatInterval(contributionInterval)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600 flex-shrink-0">
                    <FaCalendarAlt size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Next Contribution</h4>
                    <p className="text-gray-700 mt-1">
                      {nextContributionDate ? (
                        <span className="font-medium">{formatDate(nextContributionDate)}</span>
                      ) : (
                        <span className="text-gray-400">Not scheduled</span>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="p-2 bg-green-100 rounded-lg text-green-600 flex-shrink-0">
                    <FaPiggyBank size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Remaining Amount</h4>
                    <p className="text-gray-700 mt-1">
                      <span className="font-medium">Rs. {(balance).toFixed(2)}</span> to reach your goal
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 flex-shrink-0">
                    <FaWallet size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Wallet</h4>
                    <p className="text-gray-700 mt-1">
                      <span className="font-medium">{account.name}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 mt-4 border-t border-gray-200 flex justify-between items-center">
                <p className="text-xs text-gray-500">Created on {formatDate(createdAt)}</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <FaEdit /> Edit Goal
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalDetailsModal;