import { createDocument, fetchCollection } from './api.js';

export async function loadProducts(tableId) {
  const products = await fetchCollection('products');
  const table = document.getElementById(tableId);
  if (!table) return;
  table.innerHTML = products.map((product) => `
    <tr>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>${product.brand}</td>
      <td>${product.stock}</td>
      <td>${product.salePrice}</td>
    </tr>
  `).join('');
}

export async function saveProduct(payload) {
  await createDocument('products', payload);
}
