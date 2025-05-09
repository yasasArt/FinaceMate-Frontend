import React, { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, CheckCircle, AlertCircle } from "lucide-react";
import axios from "axios";

const CategoryCard = ({ category, onClick }) => {
  const [budgetDetails, setBudgetDetails] = useState(category.budget || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBudgetDetails = async () => {
      if (!category || category.type !== "expense") return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(
          `http://127.0.0.1:8088/api/v1/budgets/category/${category._id}`
        );
        setBudgetDetails(response.data?.data?.budgets || null);
      } catch (err) {
        if (err.response?.status !== 404) {
          setError("Failed to load budget details");
        }
        setBudgetDetails(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBudgetDetails();
  }, [category]);

  const getStatus = () => {
    if (!budgetDetails) return null;
    const spent = budgetDetails.limit - budgetDetails.remainingLimit;
    const percentage = Math.round((spent / budgetDetails.limit) * 100);
    
    if (percentage >= 100) return "over-limit";
    if (percentage > 90) return "need-attention";
    return "on-track";
  };

  const status = getStatus();
  const percentage = budgetDetails 
    ? Math.round(((budgetDetails.limit - budgetDetails.remainingLimit) / budgetDetails.limit) * 100)
    : 0;

  return (
    <div 
      className="relative border border-gray-200 rounded-xl p-5 bg-white cursor-pointer hover:shadow-md transition-all duration-300 hover:border-purple-100 hover:translate-y-[-2px] group"
      onClick={onClick}
    >
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div className="max-w-[70%]">
          <h3 className="font-semibold text-lg text-gray-800 truncate">
            {category.name}
          </h3>
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
        
        {budgetDetails ? (
          <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-1 rounded-full font-medium">
            Budget Set
          </span>
        ) : category.type === "expense" && (
          <span className="bg-gray-100 text-gray-500 text-xs px-2.5 py-1 rounded-full font-medium">
            No Budget
          </span>
        )}
      </div>

      {budgetDetails ? (
        <div className="flex items-center space-x-4">
          {/* Circular Progress Bar */}
          <div className="relative w-16 h-16">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              {/* Background circle */}
              <circle
                cx="18"
                cy="18"
                r="15.9155"
                className="fill-none stroke-gray-200"
                strokeWidth="2"
              />
              {/* Progress circle */}
              <circle
                cx="18"
                cy="18"
                r="15.9155"
                className="fill-none stroke-purple-600"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={`${percentage}, 100`}
                transform="rotate(-90 18 18)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-700">
                {percentage}%
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Spent</span>
              <span className="font-medium text-gray-900">
                Rs. {(budgetDetails.limit - budgetDetails.remainingLimit).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Limit</span>
              <span className="font-medium text-gray-900">
                Rs. {budgetDetails.limit.toLocaleString()}
              </span>
            </div>
            {status && (
              <div className="flex justify-end">
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
                  <span>{status.replace("-", " ")}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : category.type === "expense" && (
        <div className="py-4 text-center">
          <button 
            className="text-sm text-purple-600 font-medium hover:text-purple-800 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // You'll need to handle the add budget action here
            }}
          >
            + Set Budget
          </button>
        </div>
      )}

      {error && (
        <div className="mt-2 text-xs text-red-500 text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default CategoryCard;