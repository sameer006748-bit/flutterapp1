import { createDocument } from './api.js';

export async function seedDemoData() {
  const demoProducts = [
    { name: 'Wireless Mouse', category: 'Accessories', salePrice: 2999, stock: 20 },
    { name: 'USB-C Hub', category: 'Accessories', salePrice: 4950, stock: 10 },
    { name: 'Keyboard', category: 'Peripherals', salePrice: 8900, stock: 8 }
  ];
  const demoCustomers = [
    { name: 'Amina Khan', phone: '03001234567', email: 'amina@example.com' },
    { name: 'Bilal Ahmed', phone: '03007654321', email: 'bilal@example.com' }
  ];
  const demoRiders = [
    { name: 'Hassan Ali', zone: 'Gulberg', status: 'Active' },
    { name: 'Sara Noor', zone: 'Model Town', status: 'Active' }
  ];

  for (const product of demoProducts) await createDocument('products', product);
  for (const customer of demoCustomers) await createDocument('customers', customer);
  for (const rider of demoRiders) await createDocument('riders', rider);
}
