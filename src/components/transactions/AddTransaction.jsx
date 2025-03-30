import { useState } from "react";
import { toast } from "react-toastify";
import { XCircle } from "lucide-react";

export function AddTransactionForm({ onClose, onAddTransaction }) {
  const [newTransaction, setNewTransaction] = useState({
    type: "",
    currency: "",
    amount: "",
    paymentName: "",
    method: "",
    category: "",
    date: "",
    status: "",
  });

  const handleChange = (e) => {
    setNewTransaction({ ...newTransaction, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTransaction(newTransaction);
    setNewTransaction({
      type: "",
      currency: "",
      amount: "",
      paymentName: "",
      method: "",
      category: "",
      date: "",
      status: "",
    });
    toast.success("Transaction Added Successfully");
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Transaction</h2>
          <button onClick={onClose}>
            <XCircle size={24} className="text-red-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label className="text-gray-700">Type</label>
            <select
              name="type"
              value={newTransaction.type}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="">Select</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700">Currency</label>
            <select
              name="currency"
              value={newTransaction.currency}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="">Select</option>
              <option value="USD">USD</option>
              <option value="LKR">LKR</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700">Amount</label>
            <input
              type="number"
              name="amount"
              value={newTransaction.amount}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700">Name</label>
            <input
              type="text"
              name="paymentName"
              value={newTransaction.paymentName}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700">Method</label>
            <input
              type="text"
              name="method"
              value={newTransaction.method}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700">Category</label>
            <input
              type="text"
              name="category"
              value={newTransaction.category}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={newTransaction.date}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>

          <button
            type="submit"
            className="col-span-3 bg-purple-600 text-white py-2 rounded"
          >
            Save Transaction
          </button>
        </form>
      </div>
    </div>
  );
}
