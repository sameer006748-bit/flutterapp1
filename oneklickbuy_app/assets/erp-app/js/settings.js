import { createDocument, fetchCollection } from './api.js';

export async function loadSettings(containerId) {
  const users = await fetchCollection('users');
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = users.length ? users.map((user) => `<div class="card"><strong>${user.name}</strong><div class="muted">${user.email}</div></div>`).join('') : '<div class="muted">No users yet.</div>';
}

export async function saveSettings(payload) {
  await createDocument('settings', payload);
}
