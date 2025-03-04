import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    ArrowLeft,
    Plus,
    Trash2,
    Edit,
    Save,
    X,
    Archive,
    RefreshCw,
    Filter,
} from "lucide-react";
import axiosClient from "../axios.client";

// Base API URL - change this to match your Laravel backend URL
const API_URL = "http://localhost:8000/api";

// Embedded base64 fallback image (light gray with "No Image" text)
const noImageFallback =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTUwIDE1MCI+PHJlY3Qgd2lkdGg9IjE1MCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiNmMGYwZjAiLz48dGV4dCB4PSI3NSIgeT0iNzUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzg4OCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+PHBhdGggZD0iTTQwLDExMCBMNjAsODAgTDgwLDkwIEwxMDAsNjAgTDEyMCwxMTAgWiIgZmlsbD0iI2RkZCIgc3Ryb2tlPSIjY2NjIiAvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjEwIiBmaWxsPSIjZGRkIiAvPjwvc3ZnPg==";

// Function to get full URL for images or return fallback
const getFullUrl = (imagePath) => {
    if (!imagePath) return noImageFallback;

    // If the path already starts with http, return it as is
    if (imagePath.startsWith("http")) {
        return imagePath;
    }

    // If path starts with /storage or storage, append to base URL
    const baseUrl = "http://localhost:8000";
    if (imagePath.startsWith("/storage/") || imagePath.startsWith("storage/")) {
        return imagePath.startsWith("/")
            ? `${baseUrl}${imagePath}`
            : `${baseUrl}/${imagePath}`;
    }

    // For other paths, add /storage/ prefix
    return `${baseUrl}/storage/${imagePath}`;
};

const ProductManagement = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);
    const [showArchived, setShowArchived] = useState(false);

    // New product form state
    const [newProduct, setNewProduct] = useState({
        id: "",
        name: "",
        price: "",
        image_path: "",
        type: "Juice",
    });

    // Edited product state
    const [editedProduct, setEditedProduct] = useState({
        id: "",
        name: "",
        price: "",
        image_path: "",
        type: "",
        is_archived: false,
    });

    // File upload state
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    // Fetch products on component mount or when showArchived changes
    useEffect(() => {
        fetchProducts();
    }, [showArchived]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            console.log("Fetching products with showArchived =", showArchived);

            // Make sure parameter name matches what your backend expects
            const response = await axiosClient.get(`/products`, {
                params: {
                    show_archived: showArchived,
                },
            });

            console.log("API Response status:", response.status);
            console.log("Products count:", response.data.length);
            console.log("Sample product:", response.data[0]);

            // Check if the filtering is working properly
            const archivedCount = response.data.filter(
                (p) => p.is_archived
            ).length;
            const activeCount = response.data.filter(
                (p) => !p.is_archived
            ).length;
            console.log(
                `Archived products: ${archivedCount}, Active products: ${activeCount}`
            );

            setProducts(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching products:", err);
            setError("Failed to load products. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct((prev) => ({
            ...prev,
            [name]:
                name === "price"
                    ? value === ""
                        ? ""
                        : parseFloat(value)
                    : value,
        }));
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditedProduct((prev) => ({
            ...prev,
            [name]:
                name === "price"
                    ? value === ""
                        ? ""
                        : parseFloat(value)
                    : value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const resetForm = () => {
        setNewProduct({
            id: "",
            name: "",
            price: "",
            image_path: "",
            type: "Juice",
        });
        setSelectedFile(null);
        setImagePreview("");
    };

    const toggleAddForm = () => {
        setShowAddForm(!showAddForm);
        if (!showAddForm) {
            resetForm();
        }
    };

    const startEditing = (product) => {
        setEditingProductId(product.id);
        setEditedProduct({
            id: product.id,
            name: product.name,
            price: product.price,
            image_path: product.image,
            type: product.type || "Juice",
            is_archived: product.is_archived || false,
        });
    };

    const cancelEditing = () => {
        setEditingProductId(null);
        setEditedProduct({
            id: "",
            name: "",
            price: "",
            image_path: "",
            type: "",
            is_archived: false,
        });
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            // Validate form
            if (!newProduct.id || !newProduct.name || !newProduct.price) {
                setError("Product ID, name, and price are required.");
                setLoading(false);
                return;
            }

            let imageUrl = newProduct.image_path;

            // If there's a file, upload it first
            if (selectedFile) {
                const formData = new FormData();
                formData.append("image", selectedFile);

                // Upload the image
                const uploadResponse = await axiosClient.post(
                    `/upload-image`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                imageUrl = uploadResponse.data.image_path;
            }

            // Create product with the image path
            const productData = {
                ...newProduct,
                image_path: imageUrl,
            };

            // Call your API to create the product
            await axiosClient.post(`/products`, productData);

            // Show success message
            setSuccessMessage("Product added successfully!");
            setTimeout(() => setSuccessMessage(null), 3000);

            // Refresh the product list
            await fetchProducts();

            // Reset the form and close it
            resetForm();
            setShowAddForm(false);
            setError(null);
        } catch (err) {
            console.error("Error adding product:", err);
            setError("Failed to add product. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            // Validate form
            if (!editedProduct.name || !editedProduct.price) {
                setError("Product name and price are required.");
                setLoading(false);
                return;
            }

            // Call your API to update the product
            await axiosClient.put(
                `/products/${editedProduct.id}`,
                editedProduct
            );

            // Show success message
            setSuccessMessage("Product updated successfully!");
            setTimeout(() => setSuccessMessage(null), 3000);

            // Refresh the product list
            await fetchProducts();

            // Reset editing state
            cancelEditing();
            setError(null);
        } catch (err) {
            console.error("Error updating product:", err);
            setError("Failed to update product. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleArchiveProduct = async (productId) => {
        try {
            setLoading(true);
            console.log("Archiving product:", productId);

            const response = await axiosClient.put(
                `/products/${productId}/archive`
            );
            console.log("Archive response:", response.data);

            // Show success message
            setSuccessMessage("Product archived successfully!");
            setTimeout(() => setSuccessMessage(null), 3000);

            if (showArchived) {
                // If we're viewing archived products already, just refresh the list
                await fetchProducts();
            } else {
                // If we're viewing active products, this product should disappear
                // Remove it from the current list without refetching
                setProducts((prevProducts) =>
                    prevProducts.filter((product) => product.id !== productId)
                );
            }

            setError(null);
        } catch (err) {
            console.error("Error archiving product:", err);
            setError("Failed to archive product. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleUnarchiveProduct = async (productId) => {
        try {
            setLoading(true);
            await axiosClient.put(`/products/${productId}/unarchive`);

            // Show success message
            setSuccessMessage("Product unarchived successfully!");
            setTimeout(() => setSuccessMessage(null), 3000);

            // Refresh the product list
            await fetchProducts();
            setError(null);
        } catch (err) {
            console.error("Error unarchiving product:", err);
            setError("Failed to unarchive product. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product?")) {
            return;
        }
        try {
            setLoading(true);
            // Call your API to delete the product
            await axiosClient.delete(`/products/${productId}`);

            // Show success message
            setSuccessMessage("Product deleted successfully!");
            setTimeout(() => setSuccessMessage(null), 3000);

            // Refresh the product list
            await fetchProducts();
            setError(null);
        } catch (err) {
            console.error("Error deleting product:", err);

            // Handle foreign key constraint error
            if (err.response && err.response.data && err.response.data.error) {
                if (err.response.data.suggestion === "archive") {
                    if (
                        window.confirm(
                            err.response.data.message +
                                "\n\nWould you like to archive it instead?"
                        )
                    ) {
                        handleArchiveProduct(productId);
                    }
                } else {
                    setError(
                        err.response.data.message ||
                            "This product can't be deleted because it's being used in orders."
                    );
                }
            } else {
                setError("Failed to delete product. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleShowArchived = () => {
        setShowArchived(!showArchived);
    };

    // Loading state
    if (loading && products.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-t-green-500 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex items-center justify-between">
                    <div className="flex items-center">
                        <button
                            onClick={() => navigate("/")}
                            className="mr-4 p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors cursor-pointer"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-2xl font-bold text-green-700">
                            Product Management
                        </h1>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={toggleShowArchived}
                            className={`flex items-center px-4 py-2 rounded-lg transition-colors cursor-pointer border ${
                                showArchived
                                    ? "bg-blue-500 text-white hover:bg-blue-600"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                            title={
                                showArchived
                                    ? "Hide archived products"
                                    : "Show archived products"
                            }
                        >
                            <Filter size={18} className="mr-2" />
                            <span>
                                {showArchived
                                    ? "Hide Archived"
                                    : "Show Archived"}
                            </span>
                        </button>
                        <button
                            onClick={toggleAddForm}
                            className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
                        >
                            {showAddForm ? (
                                <X size={18} className="mr-2" />
                            ) : (
                                <Plus size={18} className="mr-2" />
                            )}
                            <span>
                                {showAddForm ? "Cancel" : "Add Product"}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 flex justify-between items-center">
                        <p>{successMessage}</p>
                        <button
                            onClick={() => setSuccessMessage(null)}
                            className="text-green-700 hover:text-green-900"
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex justify-between items-center">
                        <p>{error}</p>
                        <button
                            onClick={() => setError(null)}
                            className="text-red-700 hover:text-red-900"
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}

                {/* Add Product Form */}
                {showAddForm && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-bold text-green-700 mb-4">
                            Add New Product
                        </h2>
                        <form onSubmit={handleAddProduct}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Product ID
                                        </label>
                                        <input
                                            type="text"
                                            name="id"
                                            value={newProduct.id}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="e.g. LJ1, CJ2, etc."
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Product Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={newProduct.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="e.g. Lemon Juice"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Price (₱)
                                        </label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={newProduct.price}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="e.g. 45.00"
                                            step="0.01"
                                            min="0"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Type
                                        </label>
                                        <select
                                            name="type"
                                            value={newProduct.type}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        >
                                            <option value="Juice">Juice</option>
                                            <option value="Shake">Shake</option>
                                            <option value="Tea">Tea</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Image
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Or Image URL
                                        </label>
                                        <input
                                            type="text"
                                            name="image_path"
                                            value={newProduct.image_path}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="e.g. /assets/lemon-juice.png"
                                        />
                                    </div>
                                    <div className="mt-4">
                                        {(imagePreview ||
                                            newProduct.image_path) && (
                                            <div className="border rounded-lg p-2 mt-2">
                                                <p className="text-sm text-gray-600 mb-2">
                                                    Image Preview:
                                                </p>
                                                <div className="h-48 flex items-center justify-center bg-gray-100 rounded-lg">
                                                    <img
                                                        src={
                                                            imagePreview ||
                                                            (newProduct.image_path
                                                                ? getFullUrl(
                                                                      newProduct.image_path
                                                                  )
                                                                : noImageFallback)
                                                        }
                                                        alt="Preview"
                                                        className="max-h-full max-w-full object-contain"
                                                        onError={(e) => {
                                                            e.target.onerror =
                                                                null;
                                                            e.target.src =
                                                                noImageFallback;
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end mt-6">
                                <button
                                    type="button"
                                    onClick={toggleAddForm}
                                    className="px-6 py-2 border border-gray-300 rounded-lg mr-2 hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    disabled={loading}
                                >
                                    {loading ? "Adding..." : "Add Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Products List */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-green-700 mb-6">
                        {showArchived ? "Archived Products" : "Active Products"}
                    </h2>

                    {products.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                            {showArchived
                                ? "No archived products found."
                                : "No products found."}
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="border px-4 py-2 text-left">
                                            ID
                                        </th>
                                        <th className="border px-4 py-2 text-left">
                                            Image
                                        </th>
                                        <th className="border px-4 py-2 text-left">
                                            Name
                                        </th>
                                        <th className="border px-4 py-2 text-left">
                                            Price
                                        </th>
                                        <th className="border px-4 py-2 text-left">
                                            Type
                                        </th>
                                        <th className="border px-4 py-2 text-center">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr
                                            key={product.id}
                                            className={`hover:bg-gray-50 ${
                                                product.is_archived
                                                    ? "bg-gray-100"
                                                    : ""
                                            }`}
                                        >
                                            <td className="border px-4 py-2">
                                                {product.id}
                                            </td>
                                            <td className="border px-4 py-2">
                                                <div className="h-16 w-16 flex items-center justify-center">
                                                    <img
                                                        src={getFullUrl(
                                                            product.image
                                                        )}
                                                        alt={product.name}
                                                        className="max-h-full max-w-full object-contain"
                                                        onError={(e) => {
                                                            e.target.onerror =
                                                                null;
                                                            e.target.src =
                                                                noImageFallback;
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                            {editingProductId === product.id ? (
                                                <>
                                                    <td className="border px-4 py-2">
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            value={
                                                                editedProduct.name
                                                            }
                                                            onChange={
                                                                handleEditInputChange
                                                            }
                                                            className="w-full px-2 py-1 border rounded"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="border px-4 py-2">
                                                        <input
                                                            type="number"
                                                            name="price"
                                                            value={
                                                                editedProduct.price
                                                            }
                                                            onChange={
                                                                handleEditInputChange
                                                            }
                                                            className="w-full px-2 py-1 border rounded"
                                                            step="0.01"
                                                            min="0"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="border px-4 py-2">
                                                        <select
                                                            name="type"
                                                            value={
                                                                editedProduct.type
                                                            }
                                                            onChange={
                                                                handleEditInputChange
                                                            }
                                                            className="w-full px-2 py-1 border rounded"
                                                        >
                                                            <option value="Juice">
                                                                Juice
                                                            </option>
                                                            <option value="Shake">
                                                                Shake
                                                            </option>
                                                            <option value="Tea">
                                                                Tea
                                                            </option>
                                                        </select>
                                                    </td>
                                                    <td className="border px-4 py-2 text-center">
                                                        <button
                                                            onClick={
                                                                handleUpdateProduct
                                                            }
                                                            className="p-1 bg-green-100 text-green-600 rounded mr-1 hover:bg-green-200 transition-colors"
                                                            title="Save"
                                                        >
                                                            <Save size={18} />
                                                        </button>
                                                        <button
                                                            onClick={
                                                                cancelEditing
                                                            }
                                                            className="p-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                                                            title="Cancel"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="border px-4 py-2">
                                                        {product.name}
                                                        {product.is_archived && (
                                                            <span className="ml-2 inline-block px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded">
                                                                Archived
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="border px-4 py-2">
                                                        ₱
                                                        {product.price.toFixed(
                                                            2
                                                        )}
                                                    </td>
                                                    <td className="border px-4 py-2">
                                                        {product.type ||
                                                            "Juice"}
                                                    </td>
                                                    <td className="border px-4 py-2 text-center">
                                                        {!product.is_archived ? (
                                                            <>
                                                                <button
                                                                    onClick={() =>
                                                                        startEditing(
                                                                            product
                                                                        )
                                                                    }
                                                                    className="p-1 bg-blue-100 text-blue-600 rounded mr-1 hover:bg-blue-200 transition-colors"
                                                                    title="Edit"
                                                                >
                                                                    <Edit
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handleArchiveProduct(
                                                                            product.id
                                                                        )
                                                                    }
                                                                    className="p-1 bg-yellow-100 text-yellow-600 rounded mr-1 hover:bg-yellow-200 transition-colors"
                                                                    title="Archive"
                                                                >
                                                                    <Archive
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handleDeleteProduct(
                                                                            product.id
                                                                        )
                                                                    }
                                                                    className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    onClick={() =>
                                                                        handleUnarchiveProduct(
                                                                            product.id
                                                                        )
                                                                    }
                                                                    className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors"
                                                                    title="Unarchive"
                                                                >
                                                                    <RefreshCw
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                </button>
                                                            </>
                                                        )}
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Back to POS button */}
                <div className="mt-8 text-center">
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

export default ProductManagement;
