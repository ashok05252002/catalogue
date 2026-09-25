<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\GenderController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [CatalogController::class, 'index'])->name('catalog');

// Redirect default dashboard to admin
Route::get('/dashboard', function () {
    return redirect()->route('admin.overview');
})->middleware(['auth', 'verified'])->name('dashboard');

// Admin panel routes (protected — requires login)
Route::middleware(['auth'])->group(function () {
    Route::get('/admin', [ProductController::class, 'overview'])->name('admin.overview');
    Route::get('/admin/products', [ProductController::class, 'index'])->name('admin.products');
    Route::post('/admin/products', [ProductController::class, 'store'])->name('admin.products.store');
    Route::post('/admin/products/{product}', [ProductController::class, 'update'])->name('admin.products.update');
    Route::delete('/admin/products/{product}', [ProductController::class, 'destroy'])->name('admin.products.destroy');
    Route::delete('/admin/products/{product}/image', [ProductController::class, 'removeCoverImage'])->name('admin.products.removeCoverImage');
    Route::delete('/admin/products/{product}/gallery', [ProductController::class, 'removeGalleryImage'])->name('admin.products.removeGalleryImage');

    // Brands Routes
    Route::get('/admin/brands', [BrandController::class, 'index'])->name('admin.brands');
    Route::post('/admin/brands', [BrandController::class, 'store'])->name('admin.brands.store');
    Route::post('/admin/brands/{brand}', [BrandController::class, 'update'])->name('admin.brands.update');
    Route::delete('/admin/brands/{brand}', [BrandController::class, 'destroy'])->name('admin.brands.destroy');

    // Categories Routes
    Route::get('/admin/categories', [CategoryController::class, 'index'])->name('admin.categories');
    Route::post('/admin/categories', [CategoryController::class, 'store'])->name('admin.categories.store');
    Route::post('/admin/categories/{category}', [CategoryController::class, 'update'])->name('admin.categories.update');
    Route::delete('/admin/categories/{category}', [CategoryController::class, 'destroy'])->name('admin.categories.destroy');

    // Genders Routes (for managing Men/Women cover images)
    Route::get('/admin/genders', [GenderController::class, 'index'])->name('admin.genders');
    Route::post('/admin/genders/{gender}', [GenderController::class, 'update'])->name('admin.genders.update');
    Route::delete('/admin/genders/{gender}/image', [GenderController::class, 'removeImage'])->name('admin.genders.removeImage');
});




Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
