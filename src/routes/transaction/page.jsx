import { useState, useEffect } from "react";
import axios from "axios";
import AddTransaction from "./AddTransaction";
import TransactionDetailsPopup from "./TransactionDetailsPopup";
import { FiActivity } from "react-icons/fi";
import AIReceiptExtraction from "./AIReceiptExtraction";

axios.defaults.withCredentials = true;

const TransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAIExtraction, setShowAIExtraction] = useState(false);
  const [showReceiptExtraction, setShowReceiptExtraction] = useState(false);
  const [transactionData, setTransactionData] = useState(null);

  const handleExtractionSuccess = (extractedData) => {
    // Map the extracted data to your transaction format
    const mappedData = {
      transactionType: extractedData.type === 'income' ? 'income' : 'expense',
      amount: extractedData.amount,
      description: extractedData.description || extractedData.details || '',
      date: extractedData.date || new Date().toISOString().split('T')[0],
      category: extractedData.categoryId || extractedData.category || "",
    };
    
    setTransactionData(mappedData);
    setShowReceiptExtraction(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const transactionsData = await axios.get("http://127.0.0.1:8088/api/v1/transactions",{
          withCredentials: true,
        });

        console.log("Transactions Data:", transactionsData.data);

        setTransactions(
          Array.isArray(transactionsData.data?.data?.transactions)
            ? transactionsData.data.data.transactions
            : []
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`http://127.0.0.1:8088/api/v1/transactions/${id}`, {
          withCredentials: true,
        });
        setTransactions(transactions.filter((tx) => tx._id !== id));  // Use _id here
        setSelectedTransaction(null);
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  const handleUpdate = (updatedTransaction) => {
    setTransactions(
      transactions.map((tx) =>
        tx.id === updatedTransaction.id ? updatedTransaction : tx
      )
    );
    setSelectedTransaction(updatedTransaction);
  };

  const filteredTransactions = filterDate
  ? transactions.filter((tx) => {
      const txDate = new Date(tx.date).toISOString().split('T')[0];
      return txDate === filterDate;
    })
  : transactions;

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Transactions</h2>
        <div className="flex space-x-4">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border rounded-md px-3 py-2"
          />
          <AddTransaction initialData={transactionData} onTransactionAdded={() => setTransactionData(null)} />
          {/* <AIReceiptExtraction/> */}
          <button
            onClick={() => {
              setShowAIExtraction(true);
              setTransactionData(null); // Clear any previous data
            }}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
          >
          <FiActivity />
          <span>transIt</span>
        </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Wallet
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recurring
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTransactions.map((tx) => (
              <tr
                key={tx._id || tx.id}  // Use _id as it's the MongoDB default
                onClick={() => setSelectedTransaction(tx)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(tx.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tx.transactionType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {tx.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tx.category?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tx.account?.slug}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      tx.transactionStatus === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {tx.transactionStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tx.isRecurring ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {tx.recurringInterval}
                    </span>
                  ) : (
                    "No"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedTransaction && (
        <TransactionDetailsPopup
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      )}

      {showAIExtraction && (
        <AIReceiptExtraction 
          onClose={() => setShowAIExtraction(false)}
          onSuccess={handleExtractionSuccess}
        />
      )}
    </div>
  );
};

export default TransactionPage;