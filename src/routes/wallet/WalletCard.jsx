import React from "react";

const WalletCard = ({ wallet, onClick }) => {
  return (
    <div 
      onClick={() => onClick(wallet)}
      className={`bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 cursor-pointer ${
        wallet.isDefault ? 'border-indigo-500' : 'border-gray-200'
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg text-gray-800">
            {wallet?.name || 'Unnamed Wallet'}
            {wallet.isDefault && (
              <span className="ml-2 px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full">
                Default
              </span>
            )}
          </h3>
          <p className="text-sm text-gray-500 capitalize">
            {wallet?.accountType?.toLowerCase() || 'Checking'} Account
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-500">Balance</span>
          <p className="text-xl font-bold text-gray-800">
            Rs. {wallet?.balance?.toLocaleString() || '0.00'}
          </p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
        <span className="text-sm text-indigo-600">View Details</span>
        <span className="text-sm text-gray-500">Last transaction: 2 days ago</span>
      </div>
    </div>
  );
};

export default WalletCard;