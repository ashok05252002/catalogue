<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class BrandController extends Controller
{
    /**
     * Display the brands management page.
     */
    public function index(): Response
    {
        return Inertia::render('Admin/Brands', [
            'brands'     => Brand::with('category')->orderBy('created_at', 'desc')->get(),
            'categories' => Category::orderBy('name', 'asc')->get(),
        ]);
    }

    /**
     * Store a newly created brand.
     */
    public function store(Request $request): RedirectResponse
    {
        // Normalise: treat empty string as null before validation
        $request->merge([
            'category_id' => $request->input('category_id') ?: null,
        ]);

        $request->validate([
            'name'        => 'required|string|max:255',
            'logo'        => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:1024',
            'description' => 'nullable|string',
            'gender'      => 'required|in:men,women',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $data = [
            'name'        => $request->input('name'),
            'description' => $request->input('description'),
            'gender'      => $request->input('gender'),
            'category_id' => $request->input('category_id'),   // already null if empty
        ];

        if ($request->hasFile('logo')) {
            $path          = $request->file('logo')->store('brands', 'public');
            $data['logo']  = '/storage/' . $path;
        }

        Brand::create($data);

        return redirect()->back()->with('success', 'Brand created successfully.');
    }

    /**
     * Update the specified brand.
     */
    public function update(Request $request, Brand $brand): RedirectResponse
    {
        // Normalise: treat empty string as null before validation
        $request->merge([
            'category_id' => $request->input('category_id') ?: null,
        ]);

        $request->validate([
            'name'        => 'required|string|max:255',
            'logo'        => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:1024',
            'description' => 'nullable|string',
            'gender'      => 'required|in:men,women',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $data = [
            'name'        => $request->input('name'),
            'description' => $request->input('description'),
            'gender'      => $request->input('gender'),
            'category_id' => $request->input('category_id'),
        ];

        if ($request->hasFile('logo')) {
            if ($brand->logo) {
                $oldPath = str_replace('/storage/', '', $brand->logo);
                Storage::disk('public')->delete($oldPath);
            }
            $path         = $request->file('logo')->store('brands', 'public');
            $data['logo'] = '/storage/' . $path;
        }

        $brand->update($data);

        return redirect()->back()->with('success', 'Brand updated successfully.');
    }

    /**
     * Remove the specified brand.
     */
    public function destroy(Brand $brand): RedirectResponse
    {
        if ($brand->logo) {
            $oldPath = str_replace('/storage/', '', $brand->logo);
            Storage::disk('public')->delete($oldPath);
        }

        $brand->delete();

        return redirect()->back()->with('success', 'Brand deleted successfully.');
    }
}
