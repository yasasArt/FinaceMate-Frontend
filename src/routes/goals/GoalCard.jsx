import { useState } from "react";
import { FaEdit } from "react-icons/fa";

const GoalCard = ({ goal, onUpdate }) => {
  const { title, dueDate, saved, target, progress, status } = goal;
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedGoal, setUpdatedGoal] = useState(goal);

  const handleInputChange = (e) => {
    setUpdatedGoal({ ...updatedGoal, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    onUpdate(updatedGoal); // Call parent function to update state or database
    setIsEditing(false);
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-5 w-72 cursor-pointer transition-transform transform hover:scale-105">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        <FaEdit
          className="text-gray-500 cursor-pointer hover:text-gray-700"
          onClick={() => setExpanded(!expanded)}
        />
      </div>
      <p className="text-gray-500 text-sm">Due date: {dueDate}</p>

      <div className="mt-4">
        <p className="text-xl font-bold">
          ${saved.toFixed(2)}{" "}
          <span className="text-gray-500">/ ${target.toFixed(2)}</span>
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className={`h-2 rounded-full transition-all ${
              progress > 70 ? "bg-purple-600" : "bg-blue-500"
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-1">{progress}% completed</p>
      </div>

      {expanded && (
        <div className="mt-3 p-3 bg-gray-100 rounded-lg">
          {!isEditing ? (
            <>
              <p className="text-xs text-gray-700">Goal Details:</p>
              <p className="text-xs text-gray-600">
                Left to complete: ${(target - saved).toFixed(2)}
              </p>
              <p className="text-xs text-gray-600">Status: {status}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-2 bg-blue-500 text-white text-sm px-3 py-1 rounded-lg hover:bg-blue-700"
              >
                Update Goal
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                name="title"
                value={updatedGoal.title}
                onChange={handleInputChange}
                className="border p-1 rounded"
              />
              <input
                type="date"
                name="dueDate"
                value={updatedGoal.dueDate}
                onChange={handleInputChange}
                className="border p-1 rounded"
              />
              <input
                type="number"
                name="saved"
                value={updatedGoal.saved}
                onChange={handleInputChange}
                className="border p-1 rounded"
              />
              <input
                type="number"
                name="target"
                value={updatedGoal.target}
                onChange={handleInputChange}
                className="border p-1 rounded"
              />
              <button
                onClick={handleUpdate}
                className="bg-purple-400 text-white text-sm px-3 py-1 rounded-lg hover:bg-green-700"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GoalCard;
