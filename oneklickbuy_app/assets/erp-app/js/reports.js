import { fetchCollection } from './api.js';

export async function loadReports(containerId) {
  const products = await fetchCollection('products');
  const orders = await fetchCollection('orders');
  const invoices = await fetchCollection('invoices');
  const payments = await fetchCollection('payments');
  const riders = await fetchCollection('riders');
  const container = document.getElementById(containerId);
  if (!container) return;
  const revenue = invoices.reduce((sum, invoice) => sum + Number(invoice.total || 0), 0);
  container.innerHTML = `
    <div class="grid">
      <div class="card"><div class="card-header"><h3>Revenue</h3></div><div class="card-body"><div class="metric-value">${revenue}</div><div class="metric-label">From invoices</div></div></div>
      <div class="card"><div class="card-header"><h3>Orders</h3></div><div class="card-body"><div class="metric-value">${orders.length}</div><div class="metric-label">Assigned / pending</div></div></div>
      <div class="card"><div class="card-header"><h3>Payments</h3></div><div class="card-body"><div class="metric-value">${payments.length}</div><div class="metric-label">Payments received</div></div></div>
      <div class="card"><div class="card-header"><h3>Riders</h3></div><div class="card-body"><div class="metric-value">${riders.length}</div><div class="metric-label">Active riders</div></div></div>
    </div>
    <div class="card"><div class="card-header"><h3>Product Count</h3></div><div class="card-body">${products.length}</div></div>
  `;
}
