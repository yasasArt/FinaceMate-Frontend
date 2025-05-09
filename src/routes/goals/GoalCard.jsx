import { FaInfoCircle } from "react-icons/fa";
import { MdDone } from "react-icons/md";

const GoalCard = ({ goal, onClick }) => {
  const { 
    name, 
    totalAmount, 
    balance, 
    goalStatus,
    description
  } = goal;
  
  const progress = Math.min(Math.round(((totalAmount-balance) / totalAmount) * 100), 100);

  return (
    <div 
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
      onClick={onClick}
    >
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              {name}
              {goalStatus === "completed" && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <MdDone size={12} /> Completed
                </span>
              )}
            </h3>
            {description && (
              <p className="text-sm text-gray-500 mt-1 truncate flex items-center gap-1">
                <FaInfoCircle size={12} /> {description}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">
              ${totalAmount.toFixed(2)-balance.toFixed(2)} <span className="text-gray-400">of ${totalAmount.toFixed(2)}</span>
            </span>
            <span className="text-sm font-medium text-blue-600">{progress}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${progress >= 100 ? 'bg-green-500' : 'bg-blue-500'}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;