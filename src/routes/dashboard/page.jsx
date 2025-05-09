import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "./../../hooks/use-theme";
import { Footer } from "../../layouts/footer";
import { HandCoins, DollarSign, Package, TrendingUp, ArrowUp, ArrowDown, MoreHorizontal } from "lucide-react";
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
                    totalSavings: totalIncome * 0.2, // Assuming 20% savings rate
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
            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-40 rounded-xl bg-white p-5 shadow-sm dark:bg-gray-800 animate-pulse">
                            <div className="flex items-center justify-between">
                                <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                                <div className="h-6 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
                            </div>
                            <div className="mt-4">
                                <div className="h-8 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
                                <div className="mt-2 h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="h-80 rounded-xl bg-white p-5 shadow-sm dark:bg-gray-800 animate-pulse lg:col-span-2"></div>
                    <div className="h-80 rounded-xl bg-white p-5 shadow-sm dark:bg-gray-800 animate-pulse"></div>
                </div>
                <div className="h-96 rounded-xl bg-white p-5 shadow-sm dark:bg-gray-800 animate-pulse"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 p-4 md:p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 p-5 shadow-lg dark:from-blue-700 dark:to-blue-800">
                    <div className="flex items-center justify-between">
                        <div className="rounded-lg bg-white/20 p-2 text-white">
                            <Package size={24} />
                        </div>
                        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white">
                            {dashboardData.totalBalance > 0 ? (
                                <span className="flex items-center gap-1">
                                    <ArrowUp size={14} /> Positive
                                </span>
                            ) : (
                                <span className="flex items-center gap-1">
                                    <ArrowDown size={14} /> Negative
                                </span>
                            )}
                        </span>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm font-medium text-white/80">Total Balance</p>
                        <p className="mt-1 text-2xl font-bold text-white">
                            {formatCurrency(dashboardData.totalBalance)}
                        </p>
                        <p className="mt-2 text-xs text-white/80">
                            {dashboardData.totalBalance > 0 ? 'Good financial health' : 'Consider reducing expenses'}
                        </p>
                    </div>
                </div>

                <div className="rounded-xl bg-gradient-to-r from-green-500 to-green-600 p-5 shadow-lg dark:from-green-700 dark:to-green-800">
                    <div className="flex items-center justify-between">
                        <div className="rounded-lg bg-white/20 p-2 text-white">
                            <TrendingUp size={24} />
                        </div>
                        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white">
                            <span className="flex items-center gap-1">
                                <ArrowUp size={14} /> Income
                            </span>
                        </span>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm font-medium text-white/80">Total Income</p>
                        <p className="mt-1 text-2xl font-bold text-white">
                            {formatCurrency(dashboardData.totalIncome)}
                        </p>
                        <p className="mt-2 text-xs text-white/80">
                            {dashboardData.totalIncome > 0 ? 'Keep it up!' : 'No income recorded'}
                        </p>
                    </div>
                </div>

                <div className="rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 p-5 shadow-lg dark:from-rose-700 dark:to-rose-800">
                    <div className="flex items-center justify-between">
                        <div className="rounded-lg bg-white/20 p-2 text-white">
                            <TrendingUp size={24} />
                        </div>
                        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white">
                            <span className="flex items-center gap-1">
                                <ArrowDown size={14} /> Expense
                            </span>
                        </span>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm font-medium text-white/80">Total Expense</p>
                        <p className="mt-1 text-2xl font-bold text-white">
                            {formatCurrency(dashboardData.totalExpense)}
                        </p>
                        <p className="mt-2 text-xs text-white/80">
                            {dashboardData.totalExpense > 0 ? 'Track your spending' : 'No expenses recorded'}
                        </p>
                    </div>
                </div>

                <div className="rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 p-5 shadow-lg dark:from-purple-700 dark:to-purple-800">
                    <div className="flex items-center justify-between">
                        <div className="rounded-lg bg-white/20 p-2 text-white">
                            <HandCoins size={24} />
                        </div>
                        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white">
                            {dashboardData.totalSavings > 0 ? (
                                <span className="flex items-center gap-1">
                                    <ArrowUp size={14} /> Saving
                                </span>
                            ) : (
                                <span className="flex items-center gap-1">
                                    <ArrowDown size={14} /> Not Saving
                                </span>
                            )}
                        </span>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm font-medium text-white/80">Total Savings</p>
                        <p className="mt-1 text-2xl font-bold text-white">
                            {formatCurrency(dashboardData.totalSavings)}
                        </p>
                        <p className="mt-2 text-xs text-white/80">
                            {dashboardData.totalSavings > 0 ? 'Great savings habit!' : 'Start saving today'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Charts and Categories */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Overview Chart */}
                <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-800 lg:col-span-2">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Financial Overview</h3>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">Income</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="h-3 w-3 rounded-full bg-rose-500"></div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">Expense</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 h-64">
                        <ResponsiveContainer width="100%" height="100%">
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
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Tooltip
                                    cursor={false}
                                    formatter={(value) => formatCurrency(value)}
                                    contentStyle={{
                                        backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                                        borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
                                        borderRadius: '0.5rem',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                                <XAxis
                                    dataKey="name"
                                    strokeWidth={0}
                                    stroke={theme === "light" ? "#6B7280" : "#9CA3AF"}
                                    tickMargin={10}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis
                                    strokeWidth={0}
                                    stroke={theme === "light" ? "#6B7280" : "#9CA3AF"}
                                    tickFormatter={(value) => formatCurrency(value)}
                                    tickMargin={10}
                                    tick={{ fontSize: 12 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="income"
                                    stroke="#22C55E"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorIncome)"
                                    name="Income"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="expense"
                                    stroke="#EF4444"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorExpense)"
                                    name="Expense"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Categories */}
                <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Categories</h3>
                        <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                            <MoreHorizontal size={18} />
                        </button>
                    </div>
                    <div className="mt-4 space-y-4">
                        {dashboardData.categories.length > 0 ? (
                            dashboardData.categories.map((category) => (
                                <div
                                    key={category._id}
                                    className="flex items-center justify-between rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300">
                                            {category.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {category.name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {category.type}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                        category.onTrack ? 
                                        'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' : 
                                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'
                                    }`}>
                                        {category.onTrack ? 'On Track' : 'Needs Attention'}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                                <p className="text-gray-500 dark:text-gray-400">No categories found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="rounded-xl bg-white shadow-sm dark:bg-gray-800">
                <div className="flex items-center justify-between p-5">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                        View All
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Type
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Amount
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Description
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Category
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                            {dashboardData.transactions.length > 0 ? (
                                dashboardData.transactions.map((tx) => (
                                    <tr 
                                        key={tx._id} 
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                                        onClick={() => setSelectedTransaction(tx)}
                                    >
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                                            {tx.date ? new Date(tx.date).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                                                tx.transactionType === 'income' ? 
                                                'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' : 
                                                'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200'
                                            }`}>
                                                {tx.transactionType === 'income' ? (
                                                    <ArrowUp size={12} />
                                                ) : (
                                                    <ArrowDown size={12} />
                                                )}
                                                {tx.transactionType}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                            {formatCurrency(tx.amount)}
                                        </td>
                                        <td className="max-w-xs px-6 py-4 text-sm text-gray-500 dark:text-gray-400 truncate">
                                            {tx.description || '-'}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {tx.category?.name || '-'}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                                                tx.transactionStatus === "completed"
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
                                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200"
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

            <Footer />
        </div>
    );
};

export default DashboardPage;