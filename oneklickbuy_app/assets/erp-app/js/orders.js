import { createDocument, fetchCollection } from './api.js';

export async function loadOrders(containerId) {
  const orders = await fetchCollection('orders');
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = orders.length ? orders.map((order) => `<div class="card"><strong>Order ${order.id}</strong><div class="muted">${order.status || 'Pending'}</div></div>`).join('') : '<div class="muted">No orders yet.</div>';
}

export async function saveOrder(payload) {
  await createDocument('orders', payload);
}
