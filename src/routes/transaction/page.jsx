import { useState, useEffect } from "react";
import axios from "axios";
import AddTransaction from "./AddTransaction";
import TransactionDetailsPopup from "./TransactionDetailsPopup";
import { FiActivity, FiSearch, FiX, FiDownload } from "react-icons/fi";
import AIReceiptExtraction from "./AIReceiptExtraction";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

axios.defaults.withCredentials = true;

const TransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAIExtraction, setShowAIExtraction] = useState(false);
  const [showReceiptExtraction, setShowReceiptExtraction] = useState(false);
  const [transactionData, setTransactionData] = useState(null);

  const handleExtractionSuccess = (extractedData) => {
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
        const transactionsData = await axios.get("http://127.0.0.1:8088/api/v1/transactions", {
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
        setTransactions(transactions.filter((tx) => tx._id !== id));
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

  const generatePDF = () => {
    if (filteredTransactions.length === 0) {
      alert("No transactions to generate report");
      return;
    }

    const doc = new jsPDF();
    
    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Transaction Report", 14, 22);
    doc.setFont("helvetica", "normal");
    
    // Filters info
    doc.setFontSize(10);
    let filtersText = "All Transactions";
    if (filterDate) filtersText = `Transactions for ${filterDate}`;
    if (searchTerm) filtersText += filterDate ? ` containing "${searchTerm}"` : `Transactions containing "${searchTerm}"`;
    doc.text(filtersText, 14, 30);
    
    // Report generation date
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 38);
    
    // Table data with proper formatting
    const tableData = filteredTransactions.map(tx => [
      tx.date ? new Date(tx.date).toLocaleDateString() : "-",
      tx.transactionType ? tx.transactionType.charAt(0).toUpperCase() + tx.transactionType.slice(1) : "-",
      tx.amount !== undefined ? `$${tx.amount.toFixed(2)}` : "-",
      tx.description || "-",
      tx.category?.name || "-",
      tx.account?.name || tx.account?.slug || "-",
      tx.transactionStatus || "-",
      tx.isRecurring ? tx.recurringInterval || "Yes" : "No"
    ]);

    // AutoTable
    doc.autoTable({
      head: [["Date", "Type", "Amount", "Description", "Category", "Wallet", "Status", "Recurring"]],
      body: tableData,
      startY: 45,
      styles: { 
        fontSize: 8,
        cellPadding: 2,
        overflow: "linebreak"
      },
      headStyles: { 
        fillColor: [103, 58, 183],
        textColor: 255,
        fontStyle: "bold"
      },
      alternateRowStyles: { 
        fillColor: [240, 240, 240] 
      },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 15 },
        2: { cellWidth: 15 },
        3: { cellWidth: 40 },
        4: { cellWidth: 20 },
        5: { cellWidth: 20 },
        6: { cellWidth: 15 },
        7: { cellWidth: 15 }
      }
    });

    // Calculate totals
    const totalCount = filteredTransactions.length;
    const totalIncome = filteredTransactions
      .filter(tx => tx.transactionType === "income")
      .reduce((sum, tx) => sum + (tx.amount || 0), 0);
    const totalExpense = filteredTransactions
      .filter(tx => tx.transactionType === "expense")
      .reduce((sum, tx) => sum + (tx.amount || 0), 0);

    const finalY = doc.lastAutoTable.finalY || 45;
    doc.setFontSize(10);
    doc.text(`Total Transactions: ${totalCount}`, 14, finalY + 10);
    doc.text(`Total Income: $${totalIncome.toFixed(2)}`, 14, finalY + 16);
    doc.text(`Total Expense: $${totalExpense.toFixed(2)}`, 14, finalY + 22);
    doc.text(`Net Balance: $${(totalIncome - totalExpense).toFixed(2)}`, 14, finalY + 28);

    // Save with fallback
    try {
      doc.save(`Transaction_Report_${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (e) {
      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `Transaction_Report_${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (filterDate) {
      const txDate = new Date(tx.date).toISOString().split('T')[0];
      if (txDate !== filterDate) return false;
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        (tx.description?.toLowerCase().includes(searchLower)) ||
        (tx.category?.name?.toLowerCase().includes(searchLower)) ||
        (tx.account?.name?.toLowerCase().includes(searchLower)) ||
        (tx.amount?.toString().includes(searchTerm)) ||
        (tx.transactionType?.toLowerCase().includes(searchLower))
      );
    }

    return true;
  });

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Transactions</h2>
          <div className="flex space-x-4">
            <AddTransaction initialData={transactionData} onTransactionAdded={() => setTransactionData(null)} />
            <button
              onClick={() => {
                setShowAIExtraction(true);
                setTransactionData(null);
              }}
              className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
            >
              <FiActivity />
              <span>transIt</span>
            </button>
            <button
              onClick={generatePDF}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              <FiDownload />
              <span>Generate PDF</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <FiX className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          
          <div>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            />
          </div>
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
                Description
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
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <tr
                  key={tx._id || tx.id}
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
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {tx.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tx.category?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tx.account?.name || tx.account?.slug}
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
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                  {searchTerm || filterDate 
                    ? "No transactions match your search criteria" 
                    : "No transactions found"}
                </td>
              </tr>
            )}
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