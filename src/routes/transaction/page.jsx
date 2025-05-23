import { useState, useEffect } from "react";
import axios from "axios";
import AddTransaction from "./AddTransaction";
import TransactionDetailsPopup from "./TransactionDetailsPopup";
import { FiActivity } from "react-icons/fi";
import AIReceiptExtraction from "./AIReceiptExtraction";
import jsPDF from "jspdf";
import "jspdf-autotable";

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
      transactionType: extractedData.type === "income" ? "income" : "expense",
      amount: extractedData.amount,
      description: extractedData.description || extractedData.details || "",
      date: extractedData.date || new Date().toISOString().split("T")[0],
      category: extractedData.categoryId || extractedData.category || "",
    };

    setTransactionData(mappedData);
    setShowReceiptExtraction(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const transactionsData = await axios.get(
          "http://127.0.0.1:8088/api/v1/transactions",
          {
            withCredentials: true,
          }
        );

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
        setTransactions(transactions.filter((tx) => tx._id !== id)); // Use _id here
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
        const txDate = new Date(tx.date).toISOString().split("T")[0];
        return txDate === filterDate;
      })
    : transactions;

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Set document properties
    doc.setProperties({
        title: 'Transaction Report',
        subject: 'Financial Transactions',
        author: 'Your Finance App',
        keywords: 'transactions, finance, report',
        creator: 'Your Finance App'
    });

    // Add header with logo and title
    doc.setFontSize(20);
    doc.setTextColor(40, 53, 147);
    doc.setFont('helvetica', 'bold');
    doc.text('Transaction Report', 105, 20, { align: 'center' });
    
    // Add date of report generation
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 30, { align: 'center' });
    
    // Add summary section
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary', 14, 45);
    
    // Calculate summary statistics
    const totalTransactions = filteredTransactions.length;
    const totalIncome = filteredTransactions
        .filter(tx => tx.transactionType === 'income')
        .reduce((sum, tx) => sum + tx.amount, 0);
    const totalExpenses = filteredTransactions
        .filter(tx => tx.transactionType === 'expense')
        .reduce((sum, tx) => sum + tx.amount, 0);
    const netBalance = totalIncome - totalExpenses;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Transactions: ${totalTransactions}`, 14, 55);
    doc.text(`Total Income: $${totalIncome.toFixed(2)}`, 14, 65);
    doc.text(`Total Expenses: $${totalExpenses.toFixed(2)}`, 14, 75);
    doc.setTextColor(netBalance >= 0 ? 0 : 150, 0, 0); // Remove the extra commas
    doc.text(`Net Balance: $${netBalance.toFixed(2)}`, 14, 85);
    
    // Add transaction details section
    doc.addPage();
    doc.setFontSize(14);
    doc.setTextColor(40, 53, 147);
    doc.setFont('helvetica', 'bold');
    doc.text('Transaction Details', 105, 20, { align: 'center' });
    
    let y = 30;
    const leftCol = 14;
    const rightCol = 110;
    
    filteredTransactions.forEach((tx, index) => {
        // Transaction header
        doc.setFontSize(12);
        doc.setTextColor(40, 53, 147);
        doc.setFont('helvetica', 'bold');
        doc.text(`Transaction #${index + 1}`, leftCol, y);
        
        // Add colored box for transaction type
        const typeColor = tx.transactionType === 'income' ? [46, 125, 50] : [198, 40, 40];
        doc.setFillColor(...typeColor);
        doc.roundedRect(rightCol, y - 5, 30, 8, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text(tx.transactionType.toUpperCase(), rightCol + 15, y, { align: 'center' });
        
        // Transaction details
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        y += 10;
        
        // Left column details
        doc.text(`Date: ${new Date(tx.date).toLocaleDateString()}`, leftCol, y);
        doc.text(`Amount: $${tx.amount.toFixed(2)}`, leftCol, y + 7);
        doc.text(`Wallet: ${tx.account?.slug || "-"}`, leftCol, y + 14);
        
        // Right column details
        doc.text(`Category: ${tx.category?.name || "-"}`, rightCol, y);
        doc.text(`Status: ${tx.transactionStatus}`, rightCol, y + 7);
        doc.text(`Recurring: ${tx.isRecurring ? tx.recurringInterval : "No"}`, rightCol, y + 14);
        
        // Description (full width)
        if (tx.description) {
            const splitDesc = doc.splitTextToSize(`Description: ${tx.description}`, 180);
            doc.text(splitDesc, leftCol, y + 21);
            y += 7 * splitDesc.length;
        }
        
        y += 30; // Space between transactions
        
        // Add horizontal divider
        doc.setDrawColor(200);
        doc.line(leftCol, y - 10, 200, y - 10);
        
        // Check for page break
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
    });
    
    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount}`, 105, 287, { align: 'center' });
        doc.text('Confidential - Your Finance App', 200, 287, { align: 'right' });
    }
    
    doc.save(`Transaction_Report_${new Date().toISOString().slice(0,10)}.pdf`);
};

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
          <AddTransaction
            initialData={transactionData}
            onTransactionAdded={() => setTransactionData(null)}
          />
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

          <button
            onClick={downloadPDF}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Download PDF
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
                key={tx._id || tx.id} // Use _id as it's the MongoDB default
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
