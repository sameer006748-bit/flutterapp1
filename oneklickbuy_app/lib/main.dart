import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const JavaGoatApp());
}

class JavaGoatApp extends StatelessWidget {
  const JavaGoatApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'One Klick Buy ERP',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF7C3AED)),
        useMaterial3: true,
      ),
      home: const WebViewScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class WebViewScreen extends StatefulWidget {
  const WebViewScreen({super.key});

  @override
  State<WebViewScreen> createState() => _WebViewScreenState();
}

class _WebViewScreenState extends State<WebViewScreen> {
  WebViewController? _controller;

  bool get _canUseWebView {
    return !kIsWeb &&
        (defaultTargetPlatform == TargetPlatform.android ||
            defaultTargetPlatform == TargetPlatform.iOS) &&
        Platform.isAndroid;
  }

  @override
  void initState() {
    super.initState();
    if (_canUseWebView) {
      _controller = WebViewController()
        ..setJavaScriptMode(JavaScriptMode.unrestricted)
        ..setBackgroundColor(const Color(0xFFF3F4F6))
        ..loadFlutterAsset('assets/index.html');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF3F4F6),
      body: SafeArea(
        child: _canUseWebView
            ? WebViewWidget(controller: _controller!)
            : const Center(
                child: Padding(
                  padding: EdgeInsets.all(24),
                  child: Text('The ERP workspace is ready to render in a supported mobile shell.'),
                ),
              ),
      ),
    );
  }
}
