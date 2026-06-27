import { createDocument, fetchCollection } from './api.js';

export async function loadCustomers(tableId) {
  const customers = await fetchCollection('customers');
  const table = document.getElementById(tableId);
  if (!table) return;
  table.innerHTML = customers.map((customer) => `
    <tr>
      <td>${customer.name || ''}</td>
      <td>${customer.phone || ''}</td>
      <td>${customer.email || ''}</td>
      <td>${customer.address || ''}</td>
    </tr>
  `).join('');
}

export async function saveCustomer(payload) {
  await createDocument('customers', payload);
}
