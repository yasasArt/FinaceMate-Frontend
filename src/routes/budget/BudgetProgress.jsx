import React from "react";

const BudgetProgress = ({ category }) => {
  const calculatePercentage = (category) => {
    if (!category.budget) return 0;
    const spent = category.budget.limit - category.budget.remainingLimit;
    return Math.round((spent / category.budget.limit) * 100);
  };

  return (
    <div className="relative w-16 h-16">
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
          strokeDasharray={`${calculatePercentage(category)}, 100`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold">
          {calculatePercentage(category)}%
        </span>
      </div>
    </div>
  );
};

export default BudgetProgress;