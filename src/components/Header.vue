<template>
<header class="w-full border-b border-green-500">
  <!-- Bagian atas: logo + menu utama -->
  <div class="bg-white">
    <div class="max-w-[1024px] mx-auto flex items-center justify-between px-6 md:px-0 py-4">
      <!-- Logo -->
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
          IG
        </div>
        <span class="text-xl font-semibold text-green-600">
          Invoice Generator
        </span>
      </div>

      <!-- Menu kanan -->
      <nav class="flex space-x-6 text-green-600 font-medium">
        <a href="#" class="hover:text-green-700 transition">Home</a>
        <a href="#" class="hover:text-green-700 transition">About</a>
        <a href="#" class="hover:text-green-700 transition">Support</a>
      </nav>
    </div>
  </div>

  <!-- Navigasi kedua: full hijau -->
  <div class="bg-green-500">
    <div class="max-w-[1024px] mx-auto flex space-x-6 px-6 md:px-0 py-2 text-white font-medium">
      <a href="#" class="hover:text-green-100 transition">Create Invoice</a>
      <a href="#" class="hover:text-green-100 transition">Templates</a>
      <a href="#" class="hover:text-green-100 transition">History</a>
    </div>
  </div>
</header>
</template>
