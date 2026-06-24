<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Gender;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    /**
     * Display the public catalog view.
     */
    public function index(): Response
    {
        return Inertia::render('Catalog', [
            'products' => Product::with(['brand', 'categoryRelationship'])
                ->where('is_active', true)
                ->orderBy('created_at', 'desc')
                ->get(),
            'brands' => Brand::orderBy('name', 'asc')->get(),
            'categories' => Category::orderBy('name', 'asc')->get(),
            'genders' => Gender::all(),
        ]);
    }
}
