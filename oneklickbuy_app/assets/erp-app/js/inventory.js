import { createDocument, fetchCollection } from './api.js';

export async function loadInventory(containerId) {
  const inventory = await fetchCollection('inventory');
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = inventory.length ? inventory.map((entry) => `<div class="card"><strong>${entry.type}</strong><div class="muted">${entry.note || 'Inventory change'}</div></div>`).join('') : '<div class="muted">No stock history yet.</div>';
}

export async function saveInventory(payload) {
  await createDocument('inventory', payload);
}
