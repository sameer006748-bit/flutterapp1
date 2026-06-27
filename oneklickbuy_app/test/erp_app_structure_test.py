import os
import unittest


ROOT = os.path.join(os.path.dirname(__file__), '..', 'assets', 'erp-app')


class ErpAppStructureTest(unittest.TestCase):
    def test_pages_have_render_targets(self):
        expectations = {
            'products.html': 'products-table',
            'invoices.html': 'invoice-manager',
            'orders.html': 'orders-list',
            'inventory.html': 'inventory-list',
            'reports.html': 'reports-list',
            'settings.html': 'settings-list',
        }
        for page, target in expectations.items():
            path = os.path.join(ROOT, page)
            with open(path, 'r', encoding='utf-8') as handle:
                content = handle.read()
            self.assertIn(target, content, f'{page} is missing render target {target}')

    def test_feature_modules_exist(self):
        modules = [
            'js/products.js',
            'js/invoice.js',
            'js/orders.js',
            'js/inventory.js',
            'js/reports.js',
            'js/settings.js',
        ]
        for module in modules:
            self.assertTrue(os.path.exists(os.path.join(ROOT, module)), f'Missing module {module}')


if __name__ == '__main__':
    unittest.main()
