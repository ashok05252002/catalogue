<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Brand;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ProductController extends Controller
{
    /**
     * Display the admin overview stats.
     */
    public function overview(): Response
    {
        return Inertia::render('Admin/Overview', [
            'brandsCount' => Brand::count(),
            'categoriesCount' => Category::count(),
            'productsCount' => Product::count(),
            'recentProducts' => Product::orderBy('created_at', 'desc')->take(4)->get(),
        ]);
    }

    /**
     * Display the admin dashboard with products.
     */
    public function index(): Response
    {
        $products = Product::with(['brand', 'categoryRelationship'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/Products', [
            'products' => $products,
            'brands' => Brand::orderBy('name', 'asc')->get(),
            'categories' => Category::orderBy('name', 'asc')->get(),
        ]);
    }

    /**
     * Store a newly created product.
     */
    public function store(Request $request): RedirectResponse
    {
        // Normalise: treat empty strings as null for nullable FK fields
        $request->merge([
            'brand_id'    => $request->input('brand_id')    ?: null,
            'category_id' => $request->input('category_id') ?: null,
        ]);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category' => 'nullable|string|max:255',
            'brand_id' => 'nullable|exists:brands,id',
            'category_id' => 'nullable|exists:categories,id',
            'gender' => 'required|in:men,women',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:1024',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp,gif|max:1024',
            'whatsapp_number' => 'nullable|string|max:50',
            'in_stock' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $data = $request->only([
            'name', 'sku', 'description', 'price', 'category', 
            'brand_id', 'category_id', 'gender', 'whatsapp_number'
        ]);
        
        $data['is_active'] = $request->boolean('is_active', true);
        $data['in_stock'] = $request->boolean('in_stock', true);

        // Upload gallery images
        $galleryPaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('products/gallery', 'public');
                $galleryPaths[] = '/storage/' . $path;
            }
        }
        $data['images'] = $galleryPaths;

        // Upload main image
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $data['image_path'] = '/storage/' . $path;
        } elseif (!empty($galleryPaths)) {
            $data['image_path'] = $galleryPaths[0];
            // Prepend main image to gallery if not already present
            if (!in_array($data['image_path'], $data['images'])) {
                array_unshift($data['images'], $data['image_path']);
            }
        }

        Product::create($data);

        return redirect()->back()->with('success', 'Product created successfully.');
    }

    /**
     * Update the specified product.
     */
    public function update(Request $request, Product $product): RedirectResponse
    {
        // Normalise: treat empty strings as null for nullable FK fields
        $request->merge([
            'brand_id'    => $request->input('brand_id')    ?: null,
            'category_id' => $request->input('category_id') ?: null,
        ]);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category' => 'nullable|string|max:255',
            'brand_id' => 'nullable|exists:brands,id',
            'category_id' => 'nullable|exists:categories,id',
            'gender' => 'required|in:men,women',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:1024',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp,gif|max:1024',
            'whatsapp_number' => 'nullable|string|max:50',
            'in_stock' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $data = $request->only([
            'name', 'sku', 'description', 'price', 'category', 
            'brand_id', 'category_id', 'gender', 'whatsapp_number'
        ]);
        
        $data['is_active'] = $request->boolean('is_active', true);
        $data['in_stock'] = $request->boolean('in_stock', true);

        // Upload gallery images
        if ($request->hasFile('images')) {
            $galleryPaths = is_array($product->images) ? $product->images : [];

            foreach ($request->file('images') as $file) {
                $path = $file->store('products/gallery', 'public');
                $galleryPaths[] = '/storage/' . $path;
            }
            $data['images'] = array_values(array_unique($galleryPaths));
        }

        // Upload main image
        if ($request->hasFile('image')) {
            if ($product->image_path) {
                $oldPath = str_replace('/storage/', '', $product->image_path);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('products', 'public');
            $data['image_path'] = '/storage/' . $path;
        } elseif ($request->hasFile('images') && !empty($galleryPaths) && empty($product->image_path)) {
            // If they uploaded gallery images and we don't have a cover,
            // make the first gallery image the cover
            $data['image_path'] = $galleryPaths[0];
        }

        $product->update($data);

        return redirect()->back()->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified product.
     */
    public function destroy(Product $product): RedirectResponse
    {
        // Delete main image
        if ($product->image_path) {
            $oldPath = str_replace('/storage/', '', $product->image_path);
            Storage::disk('public')->delete($oldPath);
        }

        // Delete gallery images
        $galleryImages = $product->images ?? [];
        foreach ($galleryImages as $galleryImg) {
            $galleryImgPath = str_replace('/storage/', '', $galleryImg);
            Storage::disk('public')->delete($galleryImgPath);
        }

        $product->delete();

        return redirect()->back()->with('success', 'Product deleted successfully.');
    }
}
