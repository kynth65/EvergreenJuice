<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Recipe;
use App\Models\RecipeIngredient;
use App\Models\RecipeStep;
use App\Models\RecipeTip;
use App\Models\NutritionFact;

class ProductController extends Controller
{
    /**
     * Get all products with optional type filter
     */
    public function index(Request $request)
    {
        $query = Product::query();
        
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }
        
        $products = $query->orderBy('name')->get();
        
        return response()->json($products->map(function($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'price' => (float) $product->price,
                'image' => $product->image_path,
                'type' => $product->type,
                'path' => "/recipe/{$product->id}"
            ];
        }));
    }
    
    /**
     * Get a specific product with all its details
     */
    public function show($id)
    {
        $product = Product::with([
            'recipe.ingredients',
            'recipe.steps',
            'recipe.tips',
            'recipe.nutritionFacts'
        ])->find($id);
        
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }
        
        $result = [
            'id' => $product->id,
            'name' => $product->name,
            'price' => (float) $product->price,
            'image' => $product->image_path,
            'type' => $product->type
        ];
        
        if ($product->recipe) {
            // Add ingredients
            $result['ingredients'] = $product->recipe->ingredients->pluck('ingredient_text')->toArray();
            
            // Add steps
            $result['steps'] = $product->recipe->steps->pluck('step_text')->toArray();
            
            // Add tips
            $result['tips'] = $product->recipe->tips->pluck('tip_text')->toArray();
            
            // Add nutrition facts
            $result['nutritionFacts'] = [];
            foreach ($product->recipe->nutritionFacts as $fact) {
                $result['nutritionFacts'][$fact->nutrient_name] = $fact->nutrient_value;
            }
        }
        
        return response()->json($result);
    }
}