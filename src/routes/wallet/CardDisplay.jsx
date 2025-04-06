import React from "react";
import { CreditCard } from "lucide-react";

const CardDisplay = ({ cardType, cardNumber, cardHolder, expiry }) => {
  const isVisa = cardType.toLowerCase() === "visa";
  const bgColor = isVisa ? "bg-blue-600" : "bg-yellow-600";
  const brandLogo = isVisa ? "VISA" : "Mastercard";

  return (
    <div className={`w-80 h-48 rounded-2xl shadow-md text-white p-6 ${bgColor} relative`}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{brandLogo}</h3>
        <CreditCard />
      </div>
      <div className="mt-8 text-lg tracking-widest font-mono">
        **** **** **** {cardNumber.slice(-4)}
      </div>
      <div className="flex justify-between items-center mt-4 text-sm">
        <div>
          <p className="text-xs uppercase">Card Holder</p>
          <p>{cardHolder}</p>
        </div>
        <div>
          <p className="text-xs uppercase">Expires</p>
          <p>{expiry}</p>
        </div>
      </div>
    </div>
  );
};

export default CardDisplay;
