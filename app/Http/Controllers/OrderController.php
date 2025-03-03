<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\DailySummary;
use App\Models\ProductDailySale;
use Carbon\Carbon;

class OrderController extends Controller
{
    /**
     * Create a new order with items
     */
    public function store(Request $request)
    {
        $request->validate([
            'order' => 'required',
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0'
        ]);
        
        // Begin transaction
        DB::beginTransaction();
        
        try {
            $orderData = $request->order;
            
            // Generate order number (YYYYMMDD-XXXX format)
            $now = Carbon::now();
            $datePart = $now->format('Ymd');
            $orderNumber = $datePart . '-' . rand(1000, 9999);
            
            // Create the order
            $order = Order::create([
                'order_number' => $orderNumber,
                'order_date' => $now,
                'total_amount' => $orderData['totalAmount'],
                'payment_method' => $orderData['paymentMethod'] ?? 'Cash',
                'payment_amount' => $orderData['paymentAmount'] ?? $orderData['totalAmount'],
                'change_amount' => ($orderData['paymentAmount'] ?? $orderData['totalAmount']) - $orderData['totalAmount'],
                'status' => 'Completed'
            ]);
            
            // Add order items
            $totalItems = 0;
            
            foreach ($request->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['price'],
                    'subtotal' => $item['price'] * $item['quantity']
                ]);
                
                $totalItems += $item['quantity'];
                
                // Update product daily sales
                $this->updateProductDailySales($now->toDateString(), $item['id'], $item['quantity'], $item['price'] * $item['quantity']);
            }
            
            // Update daily summary
            $this->updateDailySummary($now->toDateString(), 1, $totalItems, $orderData['totalAmount']);
            
            DB::commit();
            
            return response()->json([
                'id' => $order->id,
                'order_number' => $order->order_number
            ], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    /**
     * Get all orders with pagination and optional date filtering
     */
    public function index(Request $request)
    {
        $query = Order::query();
        
        // Apply date filtering if provided
        if ($request->has('start_date')) {
            $query->whereDate('order_date', '>=', $request->start_date);
        }
        
        if ($request->has('end_date')) {
            $query->whereDate('order_date', '<=', $request->end_date);
        }
        
        // Apply pagination
        $perPage = $request->input('limit', 10);
        $orders = $query->orderBy('order_date', 'desc')->paginate($perPage);
        
        return response()->json([
            'orders' => $orders->items(),
            'pagination' => [
                'total' => $orders->total(),
                'per_page' => $orders->perPage(),
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage()
            ]
        ]);
    }
    
    /**
     * Get a specific order with its items
     */
    public function show($id)
    {
        $order = Order::with(['items.product'])->find($id);
        
        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }
        
        $result = [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'order_date' => $order->order_date->format('Y-m-d H:i:s'),
            'total_amount' => (float) $order->total_amount,
            'payment_method' => $order->payment_method,
            'payment_amount' => (float) $order->payment_amount,
            'change_amount' => (float) $order->change_amount,
            'status' => $order->status,
            'items' => $order->items->map(function($item) {
                return [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'product_name' => $item->product->name,
                    'quantity' => $item->quantity,
                    'unit_price' => (float) $item->unit_price,
                    'subtotal' => (float) $item->subtotal
                ];
            })
        ];
        
        return response()->json($result);
    }
    
    /**
     * Get sales summary by date range
     */
    public function salesSummary(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date'
        ]);
        
        $startDate = $request->start_date;
        $endDate = $request->end_date;
        
        // Get daily summaries
        $dailySales = DailySummary::whereBetween('summary_date', [$startDate, $endDate])
            ->orderBy('summary_date')
            ->get();
            
        // Get product sales by type
        $productSales = DB::table('product_daily_sales')
            ->join('products', 'product_daily_sales.product_id', '=', 'products.id')
            ->select(
                'products.type',
                'products.id as product_id',
                'products.name as product_name',
                DB::raw('SUM(product_daily_sales.quantity_sold) as quantity_sold'),
                DB::raw('SUM(product_daily_sales.revenue) as revenue')
            )
            ->whereBetween('product_daily_sales.summary_date', [$startDate, $endDate])
            ->groupBy('products.type', 'products.id', 'products.name')
            ->orderBy('products.type')
            ->orderByRaw('SUM(product_daily_sales.revenue) DESC')
            ->get();
            
        // Calculate totals
        $totalOrders = $dailySales->sum('total_orders');
        $totalItems = $dailySales->sum('total_items_sold');
        $totalRevenue = $dailySales->sum('total_revenue');
        
        // Group products by type
        $productsByType = [];
        foreach ($productSales as $product) {
            $type = $product->type ?? 'Uncategorized';
            if (!isset($productsByType[$type])) {
                $productsByType[$type] = [];
            }
            $productsByType[$type][] = $product;
        }
        
        return response()->json([
            'summary' => [
                'total_orders' => $totalOrders,
                'total_items' => $totalItems,
                'total_revenue' => $totalRevenue,
                'start_date' => $startDate,
                'end_date' => $endDate
            ],
            'daily_sales' => $dailySales,
            'products_by_type' => $productsByType
        ]);
    }
    
    /**
     * Helper method to update daily summary
     */
    private function updateDailySummary($date, $orderCount, $itemCount, $revenue)
    {
        $summary = DailySummary::firstOrNew(['summary_date' => $date]);
        
        if ($summary->exists) {
            $summary->increment('total_orders', $orderCount);
            $summary->increment('total_items_sold', $itemCount);
            $summary->increment('total_revenue', $revenue);
        } else {
            $summary->total_orders = $orderCount;
            $summary->total_items_sold = $itemCount;
            $summary->total_revenue = $revenue;
            $summary->save();
        }
    }
    
    /**
     * Helper method to update product daily sales
     */
    private function updateProductDailySales($date, $productId, $quantity, $revenue)
    {
        $productSale = ProductDailySale::firstOrNew([
            'summary_date' => $date,
            'product_id' => $productId
        ]);
        
        if ($productSale->exists) {
            $productSale->increment('quantity_sold', $quantity);
            $productSale->increment('revenue', $revenue);
        } else {
            $productSale->quantity_sold = $quantity;
            $productSale->revenue = $revenue;
            $productSale->save();
        }
    }
}