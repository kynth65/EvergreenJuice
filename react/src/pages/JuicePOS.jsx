import React, { useState, useEffect } from "react";
import {
    Search,
    ShoppingCart,
    ChevronUp,
    ChevronDown,
    Trash2,
    X,
    Printer,
} from "lucide-react";

const JuicePOS = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [cart, setCart] = useState([]);
    const [isCartVisible, setIsCartVisible] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [orderNumber, setOrderNumber] = useState(1);
    const [currentDate, setCurrentDate] = useState("");
    const [currentTime, setCurrentTime] = useState("");

    const menuItems = [
        { id: "CJ1", name: "Calamansi Juice", price: 45 },
        { id: "CN1", name: "Coconut Juice", price: 55 },
        { id: "PJ1", name: "Papaya Juice", price: 50 },
        { id: "LJ1", name: "Lemon Juice", price: 45 },
        { id: "CU1", name: "Cucumber Juice", price: 45 },
        { id: "MS1", name: "Mango Shake", price: 65 },
        { id: "BS1", name: "Banana Shake", price: 60 },
        { id: "SP1", name: "Sweet Potato Milk Tea", price: 75 },
    ];

    // Set current date and time when component loads
    useEffect(() => {
        const now = new Date();
        setCurrentDate(
            now.toLocaleDateString("en-PH", {
                year: "numeric",
                month: "short",
                day: "numeric",
            })
        );
        setCurrentTime(
            now.toLocaleTimeString("en-PH", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            })
        );
    }, []);

    const filteredItems = menuItems.filter(
        (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addToCart = (item) => {
        const existingItem = cart.find((cartItem) => cartItem.id === item.id);

        if (existingItem) {
            setCart(
                cart.map((cartItem) =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                )
            );
        } else {
            setCart([...cart, { ...item, quantity: 1 }]);
            // Auto-show cart when first item is added on mobile
            if (window.innerWidth < 768) {
                setIsCartVisible(true);
            }
        }
    };

    const removeFromCart = (itemId) => {
        const existingItem = cart.find((cartItem) => cartItem.id === itemId);

        if (existingItem.quantity === 1) {
            setCart(cart.filter((cartItem) => cartItem.id !== itemId));
        } else {
            setCart(
                cart.map((cartItem) =>
                    cartItem.id === itemId
                        ? { ...cartItem, quantity: cartItem.quantity - 1 }
                        : cartItem
                )
            );
        }
    };

    // Delete item completely from cart
    const deleteFromCart = (itemId) => {
        setCart(cart.filter((cartItem) => cartItem.id !== itemId));
    };

    const calculateTotal = () => {
        return cart.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
    };

    // Calculate total items in cart
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    // Toggle cart visibility
    const toggleCart = () => {
        setIsCartVisible(!isCartVisible);
    };

    // Handle confirm order
    const handleConfirmOrder = () => {
        if (cart.length === 0) return;
        setShowConfirmModal(true);
    };

    // Finalize order and show receipt
    const finalizeOrder = () => {
        setShowConfirmModal(false);
        setShowReceipt(true);
    };

    // Reset after order
    const resetOrder = () => {
        setCart([]);
        setShowReceipt(false);
        setOrderNumber((prev) => prev + 1);
        const now = new Date();
        setCurrentDate(
            now.toLocaleDateString("en-PH", {
                year: "numeric",
                month: "short",
                day: "numeric",
            })
        );
        setCurrentTime(
            now.toLocaleTimeString("en-PH", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            })
        );
    };

    // Print receipt
    const printReceipt = () => {
        window.print();
    };

    // Make sure we hide mobile cart when switching to desktop view
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                // We're on desktop, make sure cart is visible
                setIsCartVisible(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-100 p-2 pb-16 md:pb-2">
            {/* Menu Section */}
            <div className="w-full md:w-2/3 bg-white rounded-lg shadow-md p-4 mb-4 md:mb-0 md:mr-4 overflow-y-auto">
                <div className="flex items-center bg-gray-100 rounded-md p-2 mb-4">
                    <Search className="text-gray-400 mr-2" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or code..."
                        className="bg-gray-100 outline-none w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <h1 className="text-2xl font-bold mb-4 text-green-700">
                    Juice Menu
                </h1>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-green-50 transition-all border border-green-100"
                            onClick={() => addToCart(item)}
                        >
                            <div className="flex justify-between items-start">
                                <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
                                    {item.id}
                                </span>
                            </div>
                            <h3 className="font-semibold mt-2">{item.name}</h3>
                            <p className="text-gray-700">
                                ₱{item.price.toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile Cart Toggle Button - Only visible on mobile */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-lg z-20">
                <button
                    onClick={toggleCart}
                    className="w-full py-2 px-4 flex items-center justify-between bg-green-600 text-white rounded-t-lg cursor-pointer"
                >
                    <div className="flex items-center">
                        <ShoppingCart size={20} className="mr-2" />
                        <span className="font-semibold">Order Cart</span>
                    </div>
                    <div className="flex items-center">
                        <span className="mr-2 bg-white text-green-600 rounded-full px-2 py-1 text-sm font-bold">
                            {totalItems}
                        </span>
                        {isCartVisible ? (
                            <ChevronDown size={20} />
                        ) : (
                            <ChevronUp size={20} />
                        )}
                    </div>
                </button>

                {/* Cart Summary (always visible even when collapsed) */}
                {!isCartVisible && cart.length > 0 && (
                    <div className="flex justify-between items-center px-4 py-2 bg-green-50">
                        <div className="flex flex-col">
                            <span className="font-semibold">
                                Total: ₱{calculateTotal().toFixed(2)}
                            </span>
                            <span className="text-xs text-gray-600">
                                {totalItems} juice{totalItems !== 1 ? "s" : ""}
                            </span>
                        </div>
                        <button
                            className="bg-green-600 text-white px-4 py-1 rounded-lg text-sm cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleConfirmOrder();
                            }}
                        >
                            Confirm
                        </button>
                    </div>
                )}
            </div>

            {/* Order Section - Full size on desktop, collapsible on mobile */}
            <div
                className={`w-full md:w-1/3 bg-white rounded-lg shadow-md p-4 flex flex-col 
                           md:static fixed bottom-0 left-0 right-0 z-10
                           transition-all duration-300 ease-in-out
                           ${
                               isCartVisible
                                   ? "max-h-[70vh] overflow-y-auto pb-20"
                                   : "max-h-0 overflow-hidden md:max-h-full md:overflow-visible"
                           } 
                           hidden md:flex`}
            >
                <h2 className="text-xl font-bold mb-4 text-green-700">
                    Order Menu
                </h2>

                <div className="flex-grow overflow-y-auto mb-4">
                    {cart.length === 0 ? (
                        <p className="text-gray-500 text-center my-8">
                            No items in order
                        </p>
                    ) : (
                        cart.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between items-center mb-4 border-b pb-2"
                            >
                                <div>
                                    <div className="flex items-center">
                                        <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded mr-2">
                                            {item.id}
                                        </span>
                                        <h3 className="font-medium">
                                            {item.name}
                                        </h3>
                                    </div>
                                    <p className="text-gray-600">
                                        ₱{item.price.toFixed(2)}
                                    </p>
                                </div>

                                <div className="flex items-center">
                                    <button
                                        className="bg-gray-200 px-2 rounded-l cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFromCart(item.id);
                                        }}
                                    >
                                        -
                                    </button>
                                    <span className="bg-gray-100 px-3 py-1">
                                        {item.quantity}
                                    </span>
                                    <button
                                        className="bg-gray-200 px-2 rounded-r cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addToCart(item);
                                        }}
                                    >
                                        +
                                    </button>
                                    <button
                                        className="ml-2 p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteFromCart(item.id);
                                        }}
                                        title="Remove item"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Total Items:</span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
                            {totalItems} juice{totalItems !== 1 ? "s" : ""}
                        </span>
                    </div>
                    <div className="flex justify-between font-bold text-lg mt-2">
                        <span>Total</span>
                        <span>₱{calculateTotal().toFixed(2)}</span>
                    </div>

                    <button
                        className="w-full bg-green-600 text-white font-bold py-3 rounded-lg mt-4 hover:bg-green-700 transition-colors cursor-pointer"
                        onClick={handleConfirmOrder}
                        disabled={cart.length === 0}
                    >
                        Confirm
                    </button>
                </div>
            </div>

            {/* Mobile Order Cart (Separate from desktop version) */}
            {isCartVisible && (
                <div className="md:hidden fixed bottom-0 left-0 right-0 z-10 bg-neutral-50 border-t-4 border-green-800 rounded-t-lg shadow-md p-4 max-h-[70vh] overflow-y-auto pb-20 mt-12">
                    <div className="flex-grow overflow-y-auto mb-4">
                        {cart.length === 0 ? (
                            <p className="text-gray-500 text-center my-8">
                                No items in order
                            </p>
                        ) : (
                            cart.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between items-center mb-4 border-b pb-2"
                                >
                                    <div>
                                        <div className="flex items-center">
                                            <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded mr-2">
                                                {item.id}
                                            </span>
                                            <h3 className="font-medium">
                                                {item.name}
                                            </h3>
                                        </div>
                                        <p className="text-gray-600">
                                            ₱{item.price.toFixed(2)}
                                        </p>
                                    </div>

                                    <div className="flex items-center">
                                        <button
                                            className="bg-gray-200 px-2 rounded-l cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFromCart(item.id);
                                            }}
                                        >
                                            -
                                        </button>
                                        <span className="bg-gray-100 px-3 py-1">
                                            {item.quantity}
                                        </span>
                                        <button
                                            className="bg-gray-200 px-2 rounded-r cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addToCart(item);
                                            }}
                                        >
                                            +
                                        </button>
                                        <button
                                            className="ml-2 p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteFromCart(item.id);
                                            }}
                                            title="Remove item"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Total Items:</span>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
                                {totalItems} juice{totalItems !== 1 ? "s" : ""}
                            </span>
                        </div>
                        <div className="flex justify-between font-bold text-lg mt-2">
                            <span>Total</span>
                            <span>₱{calculateTotal().toFixed(2)}</span>
                        </div>

                        <button
                            className="w-full bg-green-600 text-white font-bold py-3 rounded-lg mt-4 hover:bg-green-700 transition-colors cursor-pointer"
                            onClick={handleConfirmOrder}
                            disabled={cart.length === 0}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">
                                Confirm Order
                            </h3>
                            <button
                                className="p-1 hover:bg-gray-100 rounded cursor-pointer"
                                onClick={() => setShowConfirmModal(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <p className="mb-4">
                            Are you sure you want to confirm this order?
                        </p>

                        <div className="max-h-60 overflow-y-auto border rounded p-2 mb-4">
                            {cart.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between mb-2"
                                >
                                    <span>
                                        {item.name} x {item.quantity}
                                    </span>
                                    <span>
                                        ₱
                                        {(item.price * item.quantity).toFixed(
                                            2
                                        )}
                                    </span>
                                </div>
                            ))}
                            <div className="border-t mt-2 pt-2 font-bold flex justify-between">
                                <span>Total ({totalItems} items):</span>
                                <span>₱{calculateTotal().toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                className="w-1/2 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors cursor-pointer"
                                onClick={() => setShowConfirmModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="w-1/2 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors cursor-pointer"
                                onClick={finalizeOrder}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Receipt Modal */}
            {showReceipt && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-bold">Receipt</h3>
                            <div className="flex space-x-2">
                                <button
                                    className="p-1 hover:bg-gray-100 rounded cursor-pointer"
                                    onClick={printReceipt}
                                    title="Print receipt"
                                >
                                    <Printer size={20} />
                                </button>
                                <button
                                    className="p-1 hover:bg-gray-100 rounded cursor-pointer"
                                    onClick={resetOrder}
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Receipt Content */}
                        <div className="border rounded p-6 mb-4 bg-white font-mono text-sm print:border-0">
                            {/* Receipt Header */}
                            <div className="text-center mb-4">
                                <h2 className="font-bold text-lg">
                                    FRESH JUICE SHOP
                                </h2>
                                <p>123 Refreshment Ave.</p>
                                <p>Juiceville, Metro Manila</p>
                                <p>Tel: 123-456-7890</p>
                                <p className="text-xs mt-2">
                                    VAT Reg TIN: 123-456-789-000
                                </p>
                                <div className="border-t border-b border-dashed my-2 py-1">
                                    <p>
                                        Order #:{" "}
                                        {String(orderNumber).padStart(4, "0")}
                                    </p>
                                    <p>Date: {currentDate}</p>
                                    <p>Time: {currentTime}</p>
                                    <p>Cashier: ADMIN</p>
                                </div>
                            </div>

                            {/* Receipt Items */}
                            <div className="mb-4">
                                <div className="flex justify-between border-b pb-1 mb-1 font-bold">
                                    <span>Item</span>
                                    <div className="flex">
                                        <span className="w-12 text-center">
                                            Qty
                                        </span>
                                        <span className="w-16 text-right">
                                            Price
                                        </span>
                                        <span className="w-20 text-right">
                                            Amount
                                        </span>
                                    </div>
                                </div>

                                {cart.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between py-1 text-sm"
                                    >
                                        <span className="truncate max-w-[150px]">
                                            {item.name}
                                        </span>
                                        <div className="flex">
                                            <span className="w-12 text-center">
                                                {item.quantity}
                                            </span>
                                            <span className="w-16 text-right">
                                                ₱{item.price.toFixed(2)}
                                            </span>
                                            <span className="w-20 text-right">
                                                ₱
                                                {(
                                                    item.price * item.quantity
                                                ).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Receipt Totals */}
                            <div className="border-t border-dashed pt-2">
                                <div className="flex justify-between font-bold">
                                    <span>TOTAL</span>
                                    <span>₱{calculateTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm mt-1">
                                    <span>CASH</span>
                                    <span>₱{calculateTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>CHANGE</span>
                                    <span>₱0.00</span>
                                </div>

                                <div className="border-t border-b border-dashed my-2 py-2 text-center">
                                    <p className="font-bold mb-1">
                                        Total Items: {totalItems}
                                    </p>
                                    <p className="text-xs">
                                        This serves as your official receipt
                                    </p>
                                </div>

                                <div className="text-center text-xs mt-3">
                                    <p>Thank you for your purchase!</p>
                                    <p>Please come again</p>
                                </div>
                            </div>
                        </div>

                        <button
                            className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors cursor-pointer"
                            onClick={resetOrder}
                        >
                            New Order
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JuicePOS;
