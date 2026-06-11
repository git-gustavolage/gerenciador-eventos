<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void
  {
    Schema::create('certificate_templates', function (Blueprint $table) {
      $table->id();
      $table->foreignId('id_evento')->constrained('eventos')->cascadeOnDelete();
      $table->string('template_name');
      $table->string('background_path')->nullable();
      $table->json('fields')->default('[]');
      $table->timestamps();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('certificate_templates');
  }
};
