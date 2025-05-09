import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "./../../hooks/use-theme";
import { Footer } from "../../layouts/footer";
import { HandCoins, DollarSign, Package, TrendingUp } from "lucide-react";
import axios from "axios";
import { useState, useEffect } from "react";

// Configure axios to send cookies
axios.defaults.withCredentials = true;

const DashboardPage = () => {
    const { theme } = useTheme();
    const [dashboardData, setDashboardData] = useState({
        totalBalance: 0,
        totalIncome: 0,
        totalExpense: 0,
        totalSavings: 0,
        overview: [],
        categories: [],
        transactions: []
    });
    const [loading, setLoading] = useState(true);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                
                // Fetch transactions for overview chart and table
                const transactionsRes = await axios.get("http://127.0.0.1:8088/api/v1/transactions");
                const transactions = transactionsRes.data?.data?.transactions || [];
                
                // Fetch categories
                const categoriesRes = await axios.get("http://127.0.0.1:8088/api/v1/categories");
                const categories = categoriesRes.data?.data?.categories || [];
                
                // Calculate totals
                const totalIncome = transactions
                    .filter(tx => tx.transactionType === 'income')
                    .reduce((sum, tx) => sum + (tx.amount || 0), 0);
                
                const totalExpense = transactions
                    .filter(tx => tx.transactionType === 'expense')
                    .reduce((sum, tx) => sum + (tx.amount || 0), 0);
                
                // Prepare overview data (last 7 days)
                const today = new Date();
                const overviewData = [];
                
                for (let i = 6; i >= 0; i--) {
                    const date = new Date(today);
                    date.setDate(date.getDate() - i);
                    const dateStr = date.toISOString().split('T')[0];
                    
                    const dayIncome = transactions
                        .filter(tx => tx.transactionType === 'income' && tx.date?.includes(dateStr))
                        .reduce((sum, tx) => sum + (tx.amount || 0), 0);
                    
                    const dayExpense = transactions
                        .filter(tx => tx.transactionType === 'expense' && tx.date?.includes(dateStr))
                        .reduce((sum, tx) => sum + (tx.amount || 0), 0);
                    
                    overviewData.push({
                        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
                        income: dayIncome,
                        expense: dayExpense
                    });
                }
                
                // Get recent transactions (last 5)
                const recentTransactions = transactions
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 5);
                
                setDashboardData({
                    totalBalance: totalIncome - totalExpense,
                    totalIncome,
                    totalExpense,
                    totalSavings: 0, // You might want to calculate this based on your logic
                    overview: overviewData,
                    categories: categories.slice(0, 5), // Show top 5 categories
                    transactions: recentTransactions
                });
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchDashboardData();
    }, []);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 2
        }).format(value || 0);
    };

    if (loading) {
        return (
            <div className="flex flex-col gap-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="card h-32 animate-pulse">
                            <div className="card-header">
                                <div className="w-fit rounded-lg bg-gray-200 p-2 dark:bg-gray-700"></div>
                                <p className="card-title bg-gray-200 h-6 w-3/4 rounded dark:bg-gray-700"></p>
                            </div>
                            <div className="card-body bg-slate-100 dark:bg-gray-800">
                                <p className="text-3xl font-bold bg-gray-200 h-8 w-1/2 rounded dark:bg-gray-700"></p>
                                <span className="flex w-fit items-center gap-x-2 rounded-full border border-gray-200 px-2 py-1 dark:border-gray-700">
                                    <div className="h-4 w-4 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                                    <div className="h-4 w-6 bg-gray-200 rounded dark:bg-gray-700"></div>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="card">
                    <div className="card-header">
                        <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-[#8470FF] dark:text-white">
                            <Package size={26} />
                        </div>
                        <p className="card-title">Total Balance</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-[#9c8feffc]">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">
                            {formatCurrency(dashboardData.totalBalance)}
                        </p>
                        <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-white dark:text-white">
                            <TrendingUp size={18} />
                            {dashboardData.totalBalance > 0 ? 'Positive' : 'Negative'}
                        </span>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-[#8470FF] dark:text-white">
                            <DollarSign size={26} />
                        </div>
                        <p className="card-title">Income</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-[#9c8feffc]">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">
                            {formatCurrency(dashboardData.totalIncome)}
                        </p>
                        <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-white dark:text-white">
                            <TrendingUp size={18} />
                            {dashboardData.totalIncome > 0 ? 'Positive' : 'Negative'}
                        </span>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-[#8470FF] dark:text-white">
                            <DollarSign size={26} />
                        </div>
                        <p className="card-title">Expense</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-[#9c8feffc]">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">
                            {formatCurrency(dashboardData.totalExpense)}
                        </p>
                        <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-white dark:text-white">
                            <TrendingUp size={18} />
                            {dashboardData.totalExpense > 0 ? 'Positive' : 'Negative'}
                        </span>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-[#8470FF] dark:text-white">
                            <HandCoins size={26} />
                        </div>
                        <p className="card-title">Total Savings</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-[#9c8feffc]">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">
                            {formatCurrency(dashboardData.totalSavings)}
                        </p>
                        <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-white dark:text-white">
                            <TrendingUp size={18} />
                            {dashboardData.totalSavings > 0 ? 'Positive' : 'Negative'}
                        </span>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="card col-span-1 md:col-span-2 lg:col-span-4">
                    <div className="card-header">
                        <p className="card-title">Overview</p>
                    </div>
                    <div className="card-body p-0">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart
                                data={dashboardData.overview}
                                margin={{
                                    top: 0,
                                    right: 0,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <defs>
                                    <linearGradient
                                        id="colorIncome"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#22C55E"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#22C55E"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                    <linearGradient
                                        id="colorExpense"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#EF4444"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#EF4444"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <Tooltip
                                    cursor={false}
                                    formatter={(value) => formatCurrency(value)}
                                />

                                <XAxis
                                    dataKey="name"
                                    strokeWidth={0}
                                    stroke={theme === "light" ? "#475569" : "#94a3b8"}
                                    tickMargin={6}
                                />
                                <YAxis
                                    strokeWidth={0}
                                    stroke={theme === "light" ? "#475569" : "#94a3b8"}
                                    tickFormatter={(value) => formatCurrency(value)}
                                    tickMargin={6}
                                />

                                <Area
                                    type="monotone"
                                    dataKey="income"
                                    stroke="#22C55E"
                                    fillOpacity={1}
                                    fill="url(#colorIncome)"
                                    name="Income"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="expense"
                                    stroke="#EF4444"
                                    fillOpacity={1}
                                    fill="url(#colorExpense)"
                                    name="Expense"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="card col-span-1 md:col-span-2 lg:col-span-3">
                    <div className="card-header">
                        <p className="card-title">Top Categories</p>
                    </div>
                    <div className="card-body h-[300px] overflow-auto p-0">
                        {dashboardData.categories.length > 0 ? (
                            dashboardData.categories.map((category) => (
                                <div
                                    key={category._id}
                                    className="flex items-center justify-between gap-x-4 p-4 border-b border-gray-200 dark:border-gray-700"
                                >
                                    <div className="flex items-center gap-x-4">
                                        <div className="size-10 flex-shrink-0 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 dark:bg-purple-900 dark:text-purple-300">
                                            {category.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex flex-col gap-y-1">
                                            <p className="font-medium text-slate-900 dark:text-slate-50">
                                                {category.name}
                                            </p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {category.type}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            category.onTrack ? 
                                            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                        }`}>
                                            {category.onTrack ? 'On Track' : 'Needs Attention'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-500">No categories found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Transaction History Table */}
            <div className="card">
                <div className="card-header">
                    <p className="card-title">Recent Transactions</p>
                </div>
                <div className="card-body p-0">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 dark:bg-[#9c8feffc]">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-[#9c8feffc] dark:divide-gray-700">
                                {dashboardData.transactions.length > 0 ? (
                                    dashboardData.transactions.map((tx) => (
                                        <tr 
                                            key={tx._id} 
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                                            onClick={() => setSelectedTransaction(tx)}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                {tx.date ? new Date(tx.date).toLocaleDateString() : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                <span className={`capitalize ${
                                                    tx.transactionType === 'income' ? 
                                                    'text-green-600 dark:text-green-400' : 
                                                    'text-red-600 dark:text-red-400'
                                                }`}>
                                                    {tx.transactionType}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {formatCurrency(tx.amount)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                                {tx.description || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {tx.category?.name || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    tx.transactionStatus === "completed"
                                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                                }`}>
                                                    {tx.transactionStatus || '-'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                            No transactions found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
};

export default DashboardPage;