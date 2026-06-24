<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class CategoryController extends Controller
{
    /**
     * Display the categories management page.
     */
    public function index(): Response
    {
        return Inertia::render('Admin/Categories', [
            'categories' => Category::withCount('products')->orderBy('created_at', 'desc')->get(),
        ]);
    }

    /**
     * Store a newly created category.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'gender' => 'required|in:men,women',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:1024',
        ]);

        $data = $request->only(['name', 'gender']);
        $data['slug'] = Str::slug($request->name);

        // Ensure unique slug
        $originalSlug = $data['slug'];
        $count = 1;
        while (Category::where('slug', $data['slug'])->exists()) {
            $data['slug'] = $originalSlug . '-' . $count++;
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('categories', 'public');
            $data['image'] = '/storage/' . $path;
        }

        Category::create($data);

        return redirect()->back()->with('success', 'Category created successfully.');
    }

    /**
     * Update the specified category.
     */
    public function update(Request $request, Category $category): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'gender' => 'required|in:men,women',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:1024',
        ]);

        $data = $request->only(['name', 'gender']);
        
        // Generate new slug if name changed
        if ($category->name !== $request->name) {
            $data['slug'] = Str::slug($request->name);
            $originalSlug = $data['slug'];
            $count = 1;
            while (Category::where('slug', $data['slug'])->where('id', '!=', $category->id)->exists()) {
                $data['slug'] = $originalSlug . '-' . $count++;
            }
        }

        if ($request->hasFile('image')) {
            if ($category->image) {
                $oldPath = str_replace('/storage/', '', $category->image);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('categories', 'public');
            $data['image'] = '/storage/' . $path;
        }

        $category->update($data);

        return redirect()->back()->with('success', 'Category updated successfully.');
    }

    /**
     * Remove the specified category.
     */
    public function destroy(Category $category): RedirectResponse
    {
        if ($category->image) {
            $oldPath = str_replace('/storage/', '', $category->image);
            Storage::disk('public')->delete($oldPath);
        }

        $category->delete();

        return redirect()->back()->with('success', 'Category deleted successfully.');
    }
}
