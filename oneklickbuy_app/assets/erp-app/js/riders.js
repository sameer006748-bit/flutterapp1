import { createDocument, fetchCollection } from './api.js';

export async function loadRiders(containerId) {
  const riders = await fetchCollection('riders');
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = riders.length ? riders.map((rider) => `<div class="card"><strong>${rider.name}</strong><div class="muted">${rider.zone || ''} • ${rider.status || 'Active'}</div></div>`).join('') : '<div class="muted">No riders assigned yet.</div>';
}

export async function saveRider(payload) {
  await createDocument('riders', payload);
}
