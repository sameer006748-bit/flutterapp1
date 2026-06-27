import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:oneklickbuy_app/main.dart';

void main() {
  testWidgets('app shell exposes the ERP title', (WidgetTester tester) async {
    await tester.pumpWidget(const JavaGoatApp());

    final materialApp = tester.widget<MaterialApp>(find.byType(MaterialApp));
    expect(materialApp.title, 'One Klick Buy ERP');
    expect(find.byType(WebViewScreen), findsOneWidget);
  });
}
