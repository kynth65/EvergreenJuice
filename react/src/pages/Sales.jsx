import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axios.client";
import {
    ArrowLeft,
    Printer,
    BarChart3,
    Calendar,
    RefreshCw,
    DollarSign,
    ShoppingCart,
    PieChart,
} from "lucide-react";

const Sales = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateRange, setDateRange] = useState({
        startDate: getTodayDate(),
        endDate: getTodayDate(),
        period: "today",
    });
    const [salesData, setSalesData] = useState({
        summary: {
            total_orders: 0,
            total_items: 0,
            total_revenue: 0,
        },
        daily_sales: [],
        products_by_type: {},
    });

    // Helper function to get today's date in YYYY-MM-DD format
    function getTodayDate() {
        return new Date().toISOString().split("T")[0];
    }

    // Helper function to get the first day of current month
    function getFirstDayOfMonth() {
        const date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), 1)
            .toISOString()
            .split("T")[0];
    }

    // Helper function to get the first day of current year
    function getFirstDayOfYear() {
        const date = new Date();
        return new Date(date.getFullYear(), 0, 1).toISOString().split("T")[0];
    }

    // Set date range based on period selection
    const setPeriod = (period) => {
        const endDate = getTodayDate();
        let startDate = endDate;

        switch (period) {
            case "today":
                startDate = endDate;
                break;
            case "week":
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                startDate = weekAgo.toISOString().split("T")[0];
                break;
            case "month":
                startDate = getFirstDayOfMonth();
                break;
            case "year":
                startDate = getFirstDayOfYear();
                break;
            default:
                startDate = endDate;
        }

        setDateRange({
            startDate,
            endDate,
            period,
        });
    };

    // Fetch sales data from API
    const fetchSalesData = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get(`/sales/summary`, {
                params: {
                    start_date: dateRange.startDate,
                    end_date: dateRange.endDate,
                },
            });

            setSalesData(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching sales data:", err);
            setError("Failed to load sales data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Update data when date range changes
    useEffect(() => {
        fetchSalesData();
    }, [dateRange.startDate, dateRange.endDate]);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 2,
        }).format(amount);
    };

    // Calculate total items sold per type
    const calculateTotalsByType = () => {
        const typeData = {};

        Object.entries(salesData.products_by_type || {}).forEach(
            ([type, products]) => {
                typeData[type] = {
                    quantity: products.reduce(
                        (sum, product) => sum + product.quantity_sold,
                        0
                    ),
                    revenue: products.reduce(
                        (sum, product) => sum + parseFloat(product.revenue),
                        0
                    ),
                };
            }
        );

        return typeData;
    };

    const typeData = calculateTotalsByType();

    // Calculate each product's percentage of total sales
    const calculateProductPercentages = () => {
        const totalQuantity = salesData.summary.total_items || 0;

        let productData = [];

        Object.entries(salesData.products_by_type || {}).forEach(
            ([type, products]) => {
                products.forEach((product) => {
                    productData.push({
                        id: product.product_id,
                        name: product.product_name,
                        type: type,
                        quantity: product.quantity_sold,
                        revenue: parseFloat(product.revenue),
                        percentage: totalQuantity
                            ? (
                                  (product.quantity_sold / totalQuantity) *
                                  100
                              ).toFixed(1)
                            : 0,
                    });
                });
            }
        );

        // Sort by quantity sold (descending)
        return productData.sort((a, b) => b.quantity - a.quantity);
    };

    const productData = calculateProductPercentages();

    // Handle date input changes
    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setDateRange((prev) => ({
            ...prev,
            [name]: value,
            period: "custom",
        }));
    };

    // Handle refresh button
    const handleRefresh = () => {
        fetchSalesData();
    };

    // Handle print report
    const handlePrint = () => {
        window.print();
    };

    // Loading state
    if (loading && !salesData.summary.total_orders) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-t-green-500 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading sales data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 print:bg-white print:p-0">
            <div className="max-w-6xl mx-auto">
                {/* Header - Hide on print */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex items-center justify-between print:hidden">
                    <div className="flex items-center">
                        <button
                            onClick={() => navigate("/")}
                            className="mr-4 p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors cursor-pointer"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-2xl font-bold text-green-700">
                            Sales Dashboard
                        </h1>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={handleRefresh}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            title="Refresh Data"
                        >
                            <RefreshCw size={20} />
                        </button>
                        <button
                            onClick={handlePrint}
                            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                            title="Print Report"
                        >
                            <Printer size={20} />
                        </button>
                    </div>
                </div>

                {/* Print Header - Only show on print */}
                <div className="hidden print:block mb-6 text-center">
                    <h1 className="text-2xl font-bold text-green-700">
                        Evergreen Juice Booth - Sales Report
                    </h1>
                    <p className="text-gray-600">
                        Period:{" "}
                        {new Date(dateRange.startDate).toLocaleDateString()} -{" "}
                        {new Date(dateRange.endDate).toLocaleDateString()}
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        <p>{error}</p>
                    </div>
                )}

                {/* Date Range Selector - Hide on print */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6 print:hidden">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setPeriod("today")}
                                className={`px-3 py-1 rounded-md ${
                                    dateRange.period === "today"
                                        ? "bg-green-600 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                                Today
                            </button>
                            <button
                                onClick={() => setPeriod("week")}
                                className={`px-3 py-1 rounded-md ${
                                    dateRange.period === "week"
                                        ? "bg-green-600 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                                Last 7 Days
                            </button>
                            <button
                                onClick={() => setPeriod("month")}
                                className={`px-3 py-1 rounded-md ${
                                    dateRange.period === "month"
                                        ? "bg-green-600 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                                This Month
                            </button>
                            <button
                                onClick={() => setPeriod("year")}
                                className={`px-3 py-1 rounded-md ${
                                    dateRange.period === "year"
                                        ? "bg-green-600 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                                This Year
                            </button>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                                <span className="text-gray-600 mr-2">
                                    From:
                                </span>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={dateRange.startDate}
                                    onChange={handleDateChange}
                                    className="border rounded-md p-1"
                                />
                            </div>
                            <div className="flex items-center">
                                <span className="text-gray-600 mr-2">To:</span>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={dateRange.endDate}
                                    onChange={handleDateChange}
                                    className="border rounded-md p-1"
                                    max={getTodayDate()}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* Total Orders */}
                    <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                        <div className="mr-4 p-3 bg-blue-100 text-blue-600 rounded-full">
                            <ShoppingCart size={24} />
                        </div>
                        <div>
                            <h3 className="text-gray-500 text-sm">
                                Total Orders
                            </h3>
                            <p className="text-2xl font-bold">
                                {salesData.summary.total_orders}
                            </p>
                        </div>
                    </div>

                    {/* Total Items Sold */}
                    <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                        <div className="mr-4 p-3 bg-purple-100 text-purple-600 rounded-full">
                            <BarChart3 size={24} />
                        </div>
                        <div>
                            <h3 className="text-gray-500 text-sm">
                                Items Sold
                            </h3>
                            <p className="text-2xl font-bold">
                                {salesData.summary.total_items}
                            </p>
                        </div>
                    </div>

                    {/* Total Revenue */}
                    <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                        <div className="mr-4 p-3 bg-green-100 text-green-600 rounded-full">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <h3 className="text-gray-500 text-sm">
                                Total Revenue
                            </h3>
                            <p className="text-2xl font-bold">
                                {formatCurrency(
                                    salesData.summary.total_revenue
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sales by Product Type */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-bold text-green-700 mb-4">
                        Sales by Product Type
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border px-4 py-2 text-left">
                                        Product Type
                                    </th>
                                    <th className="border px-4 py-2 text-right">
                                        Items Sold
                                    </th>
                                    <th className="border px-4 py-2 text-right">
                                        Revenue
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(typeData).map(
                                    ([type, data]) => (
                                        <tr
                                            key={type}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="border px-4 py-2 font-medium">
                                                {type}
                                            </td>
                                            <td className="border px-4 py-2 text-right">
                                                {data.quantity}
                                            </td>
                                            <td className="border px-4 py-2 text-right">
                                                {formatCurrency(data.revenue)}
                                            </td>
                                        </tr>
                                    )
                                )}
                                <tr className="bg-gray-100 font-bold">
                                    <td className="border px-4 py-2">Total</td>
                                    <td className="border px-4 py-2 text-right">
                                        {salesData.summary.total_items}
                                    </td>
                                    <td className="border px-4 py-2 text-right">
                                        {formatCurrency(
                                            salesData.summary.total_revenue
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Product Performance */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-bold text-green-700 mb-4">
                        Product Performance
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border px-4 py-2 text-left">
                                        Product
                                    </th>
                                    <th className="border px-4 py-2 text-left">
                                        Type
                                    </th>
                                    <th className="border px-4 py-2 text-right">
                                        Quantity Sold
                                    </th>
                                    <th className="border px-4 py-2 text-right">
                                        Revenue
                                    </th>
                                    <th className="border px-4 py-2 text-right">
                                        % of Sales
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {productData.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="border px-4 py-2 font-medium">
                                            {product.name}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {product.type}
                                        </td>
                                        <td className="border px-4 py-2 text-right">
                                            {product.quantity}
                                        </td>
                                        <td className="border px-4 py-2 text-right">
                                            {formatCurrency(product.revenue)}
                                        </td>
                                        <td className="border px-4 py-2 text-right">
                                            <div className="flex items-center justify-end">
                                                <span className="mr-2">
                                                    {product.percentage}%
                                                </span>
                                                <div className="w-20 bg-gray-200 rounded-full h-2.5">
                                                    <div
                                                        className="bg-green-600 h-2.5 rounded-full"
                                                        style={{
                                                            width: `${product.percentage}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Daily Sales Table (Show only for periods longer than 'today') */}
                {dateRange.period !== "today" &&
                    salesData.daily_sales &&
                    salesData.daily_sales.length > 0 && (
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-xl font-bold text-green-700 mb-4">
                                Daily Sales
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="border px-4 py-2 text-left">
                                                Date
                                            </th>
                                            <th className="border px-4 py-2 text-right">
                                                Orders
                                            </th>
                                            <th className="border px-4 py-2 text-right">
                                                Items Sold
                                            </th>
                                            <th className="border px-4 py-2 text-right">
                                                Revenue
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {salesData.daily_sales.map((day) => (
                                            <tr
                                                key={day.summary_date}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="border px-4 py-2">
                                                    {new Date(
                                                        day.summary_date
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td className="border px-4 py-2 text-right">
                                                    {day.total_orders}
                                                </td>
                                                <td className="border px-4 py-2 text-right">
                                                    {day.total_items_sold}
                                                </td>
                                                <td className="border px-4 py-2 text-right">
                                                    {formatCurrency(
                                                        day.total_revenue
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                {/* Back to POS button - Hide on print */}
                <div className="mt-8 text-center print:hidden">
                    <button
                        onClick={() => navigate("/")}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                    >
                        Back to POS System
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sales;
