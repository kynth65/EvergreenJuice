// RecipePage.jsx
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import recipeData from "../data/recipeData";

const RecipePage = () => {
    const { recipeId } = useParams();
    const navigate = useNavigate();

    // Get the recipe data for the current recipeId (which is now the key in recipeData)
    const recipe = recipeData[recipeId];

    // Log for debugging
    useEffect(() => {
        if (!recipe) {
            console.error(`Recipe not found for ID: ${recipeId}`);
            console.log(
                "Available keys in recipeData:",
                Object.keys(recipeData)
            );
        }
    }, [recipe, recipeId]);

    // If recipe not found, navigate back to instructions
    if (!recipe) {
        navigate("/instructions");
        return null;
    }

    const { name, image, ingredients, steps, tips, nutritionFacts } = recipe;

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header with back button */}
                <div className="bg-green-600 text-white px-6 py-4 flex items-center">
                    <button
                        onClick={() => navigate("/instructions")}
                        className="mr-4 p-1 rounded-full hover:bg-green-700 transition-colors cursor-pointer"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-xl font-bold">{name} Recipe</h1>
                </div>

                <div className="p-6">
                    {/* Image and Intro */}
                    <div className="flex flex-col md:flex-row items-center mb-8">
                        <div className="w-full md:w-1/3 flex justify-center mb-4 md:mb-0">
                            <img
                                src={image}
                                alt={name}
                                className="w-48 h-48 object-contain rounded-lg border border-gray-200"
                            />
                        </div>
                        <div className="w-full md:w-2/3 md:pl-6">
                            <h2 className="text-lg font-semibold text-green-700 mb-2">
                                About this drink
                            </h2>
                            <p className="text-gray-700 mb-4">
                                This recipe guides you through making the
                                perfect {name.toLowerCase()}. Follow these steps
                                to create a refreshing and healthy beverage.
                            </p>

                            {nutritionFacts && (
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-green-800 mb-2">
                                        Nutrition Facts (Per Serving)
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.entries(nutritionFacts).map(
                                            ([key, value]) => (
                                                <div
                                                    key={key}
                                                    className="flex justify-between"
                                                >
                                                    <span className="text-sm text-gray-700">
                                                        {key}:
                                                    </span>
                                                    <span className="text-sm font-medium">
                                                        {value}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Ingredients */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-green-700 mb-4 border-b pb-2">
                            Ingredients
                        </h2>
                        <ul className="list-disc pl-6 space-y-2">
                            {ingredients.map((ingredient, index) => (
                                <li key={index} className="text-gray-700">
                                    {ingredient}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Instructions */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-green-700 mb-4 border-b pb-2">
                            Instructions
                        </h2>
                        <ol className="list-decimal pl-6 space-y-4">
                            {steps.map((step, index) => (
                                <li key={index} className="text-gray-700">
                                    <p>{step}</p>
                                </li>
                            ))}
                        </ol>
                    </div>

                    {/* Tips */}
                    {tips && tips.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-green-700 mb-4 border-b pb-2">
                                Tips for Perfect Results
                            </h2>
                            <ul className="list-disc pl-6 space-y-2">
                                {tips.map((tip, index) => (
                                    <li key={index} className="text-gray-700">
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Back buttons */}
                    <div className="mt-8 flex justify-center space-x-4">
                        <button
                            onClick={() => navigate("/instructions")}
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
                        >
                            Back to Instructions
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                        >
                            Back to POS System
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipePage;
