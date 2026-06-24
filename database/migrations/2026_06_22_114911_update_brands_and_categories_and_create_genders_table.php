<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('genders', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // 'men' or 'women'
            $table->string('image')->nullable();
            $table->timestamps();
        });

        Schema::table('brands', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable()->constrained('categories')->onDelete('cascade');
            $table->string('gender')->default('men');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->string('gender')->default('men')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            // Reverting string to enum is database specific, but we'll leave it as string to prevent failures
        });

        Schema::table('brands', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropColumn(['category_id', 'gender']);
        });

        Schema::dropIfExists('genders');
    }
};
