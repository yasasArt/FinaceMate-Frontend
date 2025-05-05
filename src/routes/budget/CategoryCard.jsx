import React from "react";
import { ArrowUp, ArrowDown, CheckCircle, AlertCircle, Trash2 } from "lucide-react";
import BudgetProgress from "./BudgetProgress";

const CategoryCard = ({ category, onClick, onDelete }) => {
  const getStatus = (category) => {
    if (!category.budget) return null;
    const spent = category.budget.limit - category.budget.remainingLimit;
    const percentage = Math.round((spent / category.budget.limit) * 100);
    
    if (percentage >= 100) return "over-limit";
    if (percentage > 90) return "need-attention";
    return "on-track";
  };

  const status = getStatus(category);

  return (
    <div 
      className="border border-gray-200 rounded-xl p-5 bg-white cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg text-gray-800">{category.name}</h3>
          <div className="flex items-center mt-1">
            {category.type === "income" ? (
              <ArrowUp className="text-green-500 mr-1" size={16} />
            ) : (
              <ArrowDown className="text-red-500 mr-1" size={16} />
            )}
            <span className="text-sm text-gray-500 capitalize">
              {category.type}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {category.budget && (
            <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-1 rounded-full font-medium">
              Budget Set
            </span>
          )}
          <button
            className="text-red-500 hover:text-red-700 transition-colors"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering onClick for the card
              onDelete(category.id);
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {category.budget && (
        <div className="space-y-3">
          <BudgetProgress category={category} />
          
          <div className="flex justify-between items-center">
            <div className="flex items-baseline space-x-2">
              <span className="font-bold text-gray-900">
                ${(category.budget.limit - category.budget.remainingLimit).toLocaleString()}
              </span>
              <span className="text-gray-500 text-sm">
                of ${category.budget.limit.toLocaleString()}
              </span>
            </div>
            
            {status && (
              <div
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                  status === "on-track"
                    ? "text-green-600 bg-green-50"
                    : status === "need-attention"
                    ? "text-orange-600 bg-orange-50"
                    : "text-red-600 bg-red-50"
                }`}
              >
                {status === "on-track" ? (
                  <CheckCircle size={14} />
                ) : (
                  <AlertCircle size={14} />
                )}
                <span>
                  {status.replace("-", " ")}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryCard;