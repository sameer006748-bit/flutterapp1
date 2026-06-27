import { createDocument, fetchCollection } from './api.js';

export async function loadInvoices(containerId) {
  const invoices = await fetchCollection('invoices');
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = invoices.length ? invoices.map((invoice) => `<div class="card"><strong>${invoice.invoiceNo || invoice.id}</strong><div class="muted">${invoice.status || 'Pending'}</div></div>`).join('') : '<div class="muted">No invoices yet.</div>';
}

export async function saveInvoice(payload) {
  await createDocument('invoices', payload);
}
