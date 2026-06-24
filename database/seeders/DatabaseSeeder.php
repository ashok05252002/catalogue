<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Gender;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed the admin user
        User::updateOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('admin123'),
                'email_verified_at' => now(),
            ]
        );

        // Seed default gender collection covers
        Gender::updateOrCreate(
            ['name' => 'men'],
            ['image' => null]
        );
        Gender::updateOrCreate(
            ['name' => 'women'],
            ['image' => null]
        );
    }
}
