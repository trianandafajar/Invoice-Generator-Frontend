<template>
  <Header />

  <form @submit.prevent="submitForm" class="max-w-5xl mx-auto p-6 bg-white border-l border-r border-l-green-500 border-r-green-500 space-y-6">
    <h1 class="text-2xl font-bold text-gray-800">Create Invoice</h1>

    <!-- Invoice Info -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="form-label">Invoice Number</label>
        <input v-model="form.invoice_number" type="text" class="form-input" />
      </div>
      <div>
        <label class="form-label">Process Date</label>
        <input v-model="form.process_date" type="date" class="form-input" />
      </div>
      <div>
        <label class="form-label">Due Date</label>
        <input v-model="form.due_date" type="date" class="form-input" />
      </div>
    </div>

    <!-- Customer Info -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="form-label">Customer Name</label>
        <input v-model="form.customer_name" type="text" class="form-input" />
      </div>
      <div>
        <label class="form-label">Customer ID</label>
        <input v-model="form.customer_id" type="text" class="form-input" />
      </div>
      <div class="md:col-span-2">
        <label class="form-label">Customer Address</label>
        <textarea v-model="form.customer_address" class="form-input"></textarea>
      </div>
    </div>

    <!-- Contact Info -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="form-label">Previous Balance</label>
        <input v-model.number="form.previous_balance" type="number" class="form-input" />
      </div>
      <div>
        <label class="form-label">Contact Person</label>
        <input v-model="form.contact_person" type="text" class="form-input" />
      </div>
      <div>
        <label class="form-label">Contact Phone</label>
        <input v-model="form.contact_phone" type="text" class="form-input" />
      </div>
      <div>
        <label class="form-label">Payment Account</label>
        <input v-model="form.payment_account" type="text" class="form-input" />
      </div>
      <div>
        <label class="form-label">Contact Email</label>
        <input v-model="form.contact_email" type="email" class="form-input" />
      </div>
    </div>

    <!-- Notes -->
    <div>
      <label class="form-label">Notes</label>
      <textarea v-model="form.notes" class="form-input"></textarea>
    </div>

    <!-- Image Paths -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="form-label">Signature Image Path</label>
        <input v-model="form.signature_image_path" type="text" class="form-input" />
      </div>
      <div>
        <label class="form-label">Logo Image Path</label>
        <input v-model="form.logo_image_path" type="text" class="form-input" />
      </div>
    </div>

    <!-- Items Table -->
    <div>
      <h3 class="text-lg font-semibold text-gray-700 mb-2">Items</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full border border-gray-200 text-sm">
          <thead class="bg-gray-100 text-gray-700">
            <tr>
              <th class="table-th">Name</th>
              <th class="table-th">Description</th>
              <th class="table-th">Qty</th>
              <th class="table-th">Price</th>
              <th class="table-th">Subtotal</th>
              <th class="table-th">Amount</th>
              <th class="table-th w-12"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in form.items" :key="index" class="hover:bg-gray-50">
              <td><input v-model="item.name" type="text" class="form-input" /></td>
              <td><input v-model="item.description" type="text" class="form-input" /></td>
              <td><input v-model.number="item.qty" type="number" class="form-input" /></td>
              <td><input v-model.number="item.price" type="number" class="form-input" /></td>
              <td><input v-model.number="item.subtotal" type="number" class="form-input" /></td>
              <td><input v-model.number="item.amount" type="number" class="form-input" /></td>
              <td class="text-center">
                <button type="button" @click="removeItem(index)" class="text-red-500 hover:text-red-700 cursor-pointer">✖</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <button type="button" @click="addItem" class="mt-3 px-4 py-2 bg-green-500 hover:bg-green-600 text-white">+ Add Item</button>
    </div>

    <!-- Submit -->
     <div class="w-[calc(100%+24px)] h-[1px] relative">
      <div class="absolute w-[calc(100%+24px)] top-0 -left-6 h-[1px] bg-green-500"></div>
     </div>
    <div>
      <button type="submit" class="px-6 py-2 bg-green-700 hover:bg-green-800 cursor-pointer text-white font-medium shadow">
        Submit Invoice
      </button>
    </div>
  </form>

  <Footer />
</template>

<script setup>
import { reactive } from "vue";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";

const form = reactive({
  invoice_number: "INV/001/08/2025",
  process_date: "2025-08-07",
  due_date: "2025-08-14",
  customer_name: "Mas Devan",
  customer_id: "CUST-001",
  customer_address: "Jl. Developer No. 42, Jakarta",
  previous_balance: 150000.0,
  contact_person: "Rizky Dev",
  contact_phone: "081234567890",
  payment_account: "BCA 1234567890 a.n. Mas Devan",
  contact_email: "masdevan@example.com",
  notes: "Harap dibayar sebelum due date.",
  signature_image_path: "uploads/signatures/devan.png",
  logo_image_path: "uploads/logos/company.png",
  items: [
    {
      name: "Jasa Desain UI/UX",
      description: "Redesign homepage & dashboard",
      qty: 1,
      price: 2000000,
      subtotal: 2000000,
      amount: 200000,
    },
    {
      name: "Hosting 1 Tahun",
      description: "Shared Hosting Premium",
      qty: 1,
      price: 500000,
      subtotal: 500000,
      amount: 500000,
    },
  ],
});

const addItem = () => {
  form.items.push({
    name: "",
    description: "",
    qty: 1,
    price: 0,
    subtotal: 0,
    amount: 0,
  });
};

const removeItem = (index) => {
  form.items.splice(index, 1);
};

const submitForm = () => {
  console.log(JSON.stringify(form, null, 2));
};
</script>
