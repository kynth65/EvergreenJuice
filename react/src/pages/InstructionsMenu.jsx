import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import recipeData from "../data/recipeData";

const InstructionsMenu = () => {
    const navigate = useNavigate();

    // Create array from the recipeData object with the object key included
    const recipes = Object.entries(recipeData).map(([key, recipe]) => ({
        key: key, // This is the key in the recipeData object (like "lemon", "calamansi")
        ...recipe,
    }));

    // Modified to use the key from recipeData, not the recipe's id property
    const handleRecipeClick = (recipeKey) => {
        navigate(`/recipe/${recipeKey}`);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex items-center">
                    <button
                        onClick={() => navigate("/")}
                        className="mr-4 p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors cursor-pointer"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-bold text-green-700">
                        Juice Preparation Instructions
                    </h1>
                </div>

                {/* Instructions cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recipes.map((recipe) => (
                        <div
                            key={recipe.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => handleRecipeClick(recipe.key)}
                        >
                            <div className="h-40 overflow-hidden">
                                <img
                                    src={recipe.image}
                                    alt={recipe.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-xl font-bold text-green-700">
                                        {recipe.name}
                                    </h2>
                                    <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
                                        {recipe.id}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm mb-3">
                                    Price: ₱{recipe.price.toFixed(2)}
                                </p>
                                <p className="text-gray-700 mb-4 line-clamp-2">
                                    Learn how to prepare the perfect{" "}
                                    {recipe.name.toLowerCase()} with our
                                    detailed recipe.
                                </p>
                                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-medium transition-colors">
                                    View Recipe
                                </button>
                            </div>
                        </div>
                    ))}
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

export default InstructionsMenu;
