<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Recipe;
use App\Models\RecipeIngredient;
use App\Models\RecipeStep;
use App\Models\RecipeTip;
use App\Models\NutritionFact;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

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
        
        // Get base URL for image paths
        $baseUrl = url('/');
        
        return response()->json($products->map(function($product) use ($baseUrl) {
            // Format image URL properly
            $imagePath = $product->image_path;
            
            // Make sure image path is properly formatted
            if ($imagePath && !str_starts_with($imagePath, 'http')) {
                // For paths already starting with /storage
                if (str_starts_with($imagePath, '/storage/')) {
                    $imagePath = $baseUrl . $imagePath;
                } 
                // For paths like 'storage/products/...'
                else if (str_starts_with($imagePath, 'storage/')) {
                    $imagePath = $baseUrl . '/' . $imagePath;
                }
                // For paths without storage prefix
                else {
                    $imagePath = $baseUrl . '/storage/' . ltrim($imagePath, '/');
                }
            }
            
            return [
                'id' => $product->id,
                'name' => $product->name,
                'price' => (float) $product->price,
                'image' => $imagePath,
                'type' => $product->type,
                'path' => "/recipe/{$product->id}"
            ];
        }));
    }
    
    /**
     * Store a newly created product
     */
    public function store(Request $request)
    {
        $request->validate([
            'id' => 'required|string|max:10|unique:products,id',
            'name' => 'required|string|max:100',
            'price' => 'required|numeric|min:0',
            'image_path' => 'nullable|string',
            'type' => 'nullable|string|max:50'
        ]);
        
        $product = Product::create([
            'id' => $request->id,
            'name' => $request->name,
            'price' => $request->price,
            'image_path' => $request->image_path,
            'type' => $request->type
        ]);
        
        return response()->json([
            'id' => $product->id,
            'name' => $product->name,
            'price' => (float) $product->price,
            'image' => $product->image_path,
            'type' => $product->type,
            'path' => "/recipe/{$product->id}"
        ], 201);
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
        
        // Format image URL properly
        $baseUrl = url('/');
        $imagePath = $product->image_path;
        
        // Make sure image path is properly formatted
        if ($imagePath && !str_starts_with($imagePath, 'http')) {
            // For paths already starting with /storage
            if (str_starts_with($imagePath, '/storage/')) {
                $imagePath = $baseUrl . $imagePath;
            } 
            // For paths like 'storage/products/...'
            else if (str_starts_with($imagePath, 'storage/')) {
                $imagePath = $baseUrl . '/' . $imagePath;
            }
            // For paths without storage prefix
            else {
                $imagePath = $baseUrl . '/storage/' . ltrim($imagePath, '/');
            }
        }
        
        $result = [
            'id' => $product->id,
            'name' => $product->name,
            'price' => (float) $product->price,
            'image' => $imagePath,
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
    
    /**
     * Update a product
     */
    public function update(Request $request, $id)
    {
        $product = Product::find($id);
        
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }
        
        $request->validate([
            'name' => 'required|string|max:100',
            'price' => 'required|numeric|min:0',
            'image_path' => 'nullable|string',
            'type' => 'nullable|string|max:50'
        ]);
        
        $product->update([
            'name' => $request->name,
            'price' => $request->price,
            'image_path' => $request->image_path,
            'type' => $request->type
        ]);
        
        return response()->json([
            'id' => $product->id,
            'name' => $product->name,
            'price' => (float) $product->price,
            'image' => $product->image_path,
            'type' => $product->type,
            'path' => "/recipe/{$product->id}"
        ]);
    }
    
    /**
     * Delete a product
     */
    public function destroy($id)
    {
        $product = Product::find($id);
        
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }
        
        try {
            // Start a database transaction
            DB::beginTransaction();
            
            // First, check if there are order items using this product
            $orderItemsCount = DB::table('order_items')->where('product_id', $id)->count();
            
            if ($orderItemsCount > 0) {
                // Option 1: Return error and don't delete
                return response()->json([
                    'error' => 'Cannot delete product because it is referenced in orders',
                    'orderCount' => $orderItemsCount,
                    'message' => 'This product is used in ' . $orderItemsCount . ' order(s). Please archive the product instead of deleting it.'
                ], 422);
                
                /* 
                // Option 2: If you prefer to automatically delete associated order items
                // (Uncomment this section if you want to automatically delete related order items)
                DB::table('order_items')->where('product_id', $id)->delete();
                */
            }
            
            // Delete related recipe data if exists
            if ($product->recipe) {
                $product->recipe->ingredients()->delete();
                $product->recipe->steps()->delete();
                $product->recipe->tips()->delete();
                $product->recipe->nutritionFacts()->delete();
                $product->recipe->delete();
            }
            
            $product->delete();
            
            // Commit the transaction
            DB::commit();
            
            return response()->json(['message' => 'Product deleted successfully']);
            
        } catch (Exception $e) {
            // Rollback the transaction if anything goes wrong
            DB::rollback();
            
            // Log the error
            Log::error('Error deleting product: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Failed to delete product',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Upload a product image
     */
    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:2048', // Max 2MB
        ]);
        
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            
            // Store the file in the public/products directory
            // Note: We're changing from 'public/products' to 'products' with 'public' disk
            // This ensures proper path generation
            $path = $file->storeAs('products', $filename, 'public');
            
            // Log the image path for debugging
            Log::info('Image uploaded', [
                'filename' => $filename,
                'path' => $path,
                'url' => Storage::url($path)
            ]);
            
            // Return the public URL
            return response()->json([
                'image_path' => 'storage/' . $path
            ]);
        }
        
        return response()->json(['error' => 'No image file provided'], 400);
    }
}