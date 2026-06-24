<?php

namespace App\Http\Controllers;

use App\Models\Gender;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class GenderController extends Controller
{
    /**
     * Display the genders management page (admin).
     */
    public function index(): Response
    {
        return Inertia::render('Admin/Genders', [
            'genders' => Gender::all(),
        ]);
    }

    /**
     * Update the cover image for a gender (men / women).
     */
    public function update(Request $request, Gender $gender): RedirectResponse
    {
        $request->validate([
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:1024',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($gender->image) {
                $oldPath = str_replace('/storage/', '', $gender->image);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('genders', 'public');
            $gender->update(['image' => '/storage/' . $path]);
        }

        return redirect()->back()->with('success', ucfirst($gender->name) . ' cover updated successfully.');
    }

    /**
     * Remove the cover image for a gender.
     */
    public function removeImage(Gender $gender): RedirectResponse
    {
        if ($gender->image) {
            $oldPath = str_replace('/storage/', '', $gender->image);
            Storage::disk('public')->delete($oldPath);
            $gender->update(['image' => null]);
        }

        return redirect()->back()->with('success', 'Cover image removed.');
    }
}
