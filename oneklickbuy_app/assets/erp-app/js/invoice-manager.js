import { createDocument, fetchCollection } from './api.js';

const PAYMENT_MODES = ['Cash', 'Card', 'Online', 'Bank Transfer', 'In Store', 'Out of Karachi'];
const CHANNELS = ['In Store', 'Online', 'Out of Karachi', 'Bank Transfer'];

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}

function getTotal(items) {
  return items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
}

export async function loadInvoiceManager(rootId) {
  const root = document.getElementById(rootId);
  if (!root) return;

  const products = await fetchCollection('products');
  const customers = await fetchCollection('customers');
  const riders = await fetchCollection('riders');
  const invoices = await fetchCollection('invoices');
  const payments = await fetchCollection('payments');
  const orders = await fetchCollection('orders');

  root.innerHTML = `
    <div class="grid" style="grid-template-columns:1.1fr 0.9fr; align-items:start;">
      <div class="card">
        <div class="card-header"><h3>Create Invoice</h3></div>
        <div class="card-body">
          <form id="invoice-form">
            <div class="row">
              <div class="field">
                <label>Customer Name</label>
                <input name="customerName" required placeholder="Enter customer name" />
              </div>
              <div class="field">
                <label>Customer Number</label>
                <input name="customerNumber" required placeholder="03xx..." />
              </div>
            </div>
            <div class="row">
              <div class="field">
                <label>Sale Type</label>
                <select name="saleType">
                  <option value="In Store">In Store</option>
                  <option value="Online">Online</option>
                  <option value="Out of Karachi">Out of Karachi</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
              <div class="field">
                <label>Payment Mode</label>
                <select name="paymentMode">
                  ${PAYMENT_MODES.map((mode) => `<option value="${mode}">${mode}</option>`).join('')}
                </select>
              </div>
            </div>
            <div class="field">
              <label>Item</label>
              <select id="invoice-item-select" name="itemId">
                <option value="">Select item</option>
                ${products.map((product) => `<option value="${product.id}" data-price="${product.salePrice || 0}">${product.name} — ${product.salePrice || 0}</option>`).join('')}
              </select>
            </div>
            <div class="row">
              <div class="field">
                <label>Quantity</label>
                <input name="quantity" type="number" min="1" value="1" />
              </div>
              <div class="field">
                <label>Price</label>
                <input name="price" type="number" step="0.01" value="0" />
              </div>
            </div>
            <div class="field">
              <label>Notes</label>
              <textarea name="notes" placeholder="Delivery note, special instructions..."></textarea>
            </div>
            <div class="field">
              <label>Assign Rider</label>
              <select name="riderId">
                <option value="">No rider</option>
                ${riders.map((rider) => `<option value="${rider.id}">${rider.name} — ${rider.zone || 'Zone'}</option>`).join('')}
              </select>
            </div>
            <button type="submit" class="btn btn-primary">Create Invoice</button>
            <div id="invoice-status" class="muted" style="margin-top:10px;"></div>
          </form>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h3>Invoice Preview</h3></div>
        <div class="card-body">
          <div id="invoice-preview" class="invoice-preview">
            <strong>No invoice created yet</strong>
            <div class="muted">Customer, product, payment and rider details will appear here.</div>
          </div>
          <div class="topbar-actions" style="margin-top:12px;">
            <button id="print-invoice" class="btn">Print</button>
            <button id="pdf-invoice" class="btn">Download PDF</button>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><h3>Saved Invoices</h3></div>
      <div class="card-body">
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Invoice</th><th>Customer</th><th>Mode</th><th>Sale Type</th><th>Status</th><th>Rider</th><th>Total</th></tr></thead>
            <tbody>
              ${invoices.map((invoice) => `
                <tr>
                  <td>${escapeHtml(invoice.invoiceNo || invoice.id)}</td>
                  <td>${escapeHtml(invoice.customerName || '')}</td>
                  <td>${escapeHtml(invoice.paymentMode || '')}</td>
                  <td>${escapeHtml(invoice.saleType || '')}</td>
                  <td>${escapeHtml(invoice.status || 'Pending')}</td>
                  <td>${escapeHtml(invoice.riderName || '—')}</td>
                  <td>${escapeHtml(invoice.total || 0)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr));">
      <div class="card">
        <div class="card-header"><h3>Payments</h3></div>
        <div class="card-body">
          ${payments.map((payment) => `<div class="list-card"><span>${escapeHtml(payment.paymentMode || payment.mode || '')}</span><strong>${escapeHtml(payment.amount || 0)}</strong></div>`).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h3>Orders</h3></div>
        <div class="card-body">
          ${orders.map((order) => `<div class="list-card"><span>${escapeHtml(order.id || '')}</span><strong>${escapeHtml(order.status || '')}</strong></div>`).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h3>Rider Performance</h3></div>
        <div class="card-body">
          ${riders.map((rider) => `<div class="list-card"><span>${escapeHtml(rider.name || '')}</span><strong>${escapeHtml(rider.status || 'Active')}</strong></div>`).join('')}
        </div>
      </div>
    </div>
  `;

  const form = root.querySelector('#invoice-form');
  const preview = root.querySelector('#invoice-preview');
  const itemSelect = root.querySelector('#invoice-item-select');

  const updatePreview = () => {
    const formData = new FormData(form);
    const customerName = formData.get('customerName') || 'Customer';
    const customerNumber = formData.get('customerNumber') || 'N/A';
    const paymentMode = formData.get('paymentMode') || 'Cash';
    const saleType = formData.get('saleType') || 'In Store';
    const quantity = Number(formData.get('quantity') || 1);
    const price = Number(formData.get('price') || 0);
    const total = quantity * price;
    const riderId = formData.get('riderId') || '';
    const riderName = riders.find((rider) => rider.id === riderId)?.name || 'No rider';
    preview.innerHTML = `
      <strong>${customerName}</strong>
      <div class="muted">Phone: ${customerNumber}</div>
      <div class="muted">Payment: ${paymentMode}</div>
      <div class="muted">Sale Type: ${saleType}</div>
      <div class="muted">Rider: ${riderName}</div>
      <div class="muted">Total: ${total}</div>
    `;
  };

  form.addEventListener('input', updatePreview);
  form.addEventListener('change', updatePreview);
  itemSelect.addEventListener('change', (event) => {
    const selected = event.target.selectedOptions[0];
    const priceInput = form.querySelector('input[name="price"]');
    const price = selected?.dataset?.price || 0;
    priceInput.value = price;
    updatePreview();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const paymentMode = formData.get('paymentMode');
    const saleType = formData.get('saleType');
    const riderId = formData.get('riderId');
    const rider = riders.find((entry) => entry.id === riderId);
    const invoicePayload = {
      invoiceNo: `INV-${Date.now()}`,
      customerName: formData.get('customerName') || 'Walk-in',
      customerNumber: formData.get('customerNumber') || '',
      saleType,
      paymentMode,
      itemId: formData.get('itemId') || '',
      quantity: Number(formData.get('quantity') || 1),
      price: Number(formData.get('price') || 0),
      total: Number(formData.get('price') || 0) * Number(formData.get('quantity') || 1),
      notes: formData.get('notes') || '',
      status: paymentMode === 'Online' ? 'Pending Online' : 'Paid',
      riderId: rider?.id || '',
      riderName: rider?.name || '',
      createdAt: new Date().toISOString()
    };

    await createDocument('invoices', invoicePayload);
    await createDocument('payments', {
      paymentMode,
      amount: invoicePayload.total,
      source: 'invoice',
      status: paymentMode === 'Online' ? 'Pending' : 'Received',
      createdAt: new Date().toISOString()
    });

    if (saleType === 'Online' && rider) {
      await createDocument('orders', {
        invoiceNo: invoicePayload.invoiceNo,
        riderId: rider.id,
        riderName: rider.name,
        status: 'Assigned',
        createdAt: new Date().toISOString()
      });
    }

    const status = root.querySelector('#invoice-status');
    if (status) {
      status.textContent = 'Invoice created successfully.';
    }
    form.reset();
    updatePreview();
    await loadInvoiceManager(rootId);
  });

  root.querySelector('#print-invoice').addEventListener('click', () => window.print());
  root.querySelector('#pdf-invoice').addEventListener('click', () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<html><body>${preview.innerHTML}</body></html>`);
    printWindow.print();
  });
}
