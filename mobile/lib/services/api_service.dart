import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart' show kIsWeb;

class ApiService {
  // Use 127.0.0.1 on web to prevent slow IPv6 timeouts, and emulator loopback on android
  static const String baseUrl = kIsWeb ? 'http://127.0.0.1:5000' : 'http://10.0.2.2:5000';

  // Global Session Variables
  static String? token;
  static Map<String, dynamic>? currentUser;
  
  // Cache for fast loading
  static List<dynamic>? cachedProducts;
  static List<dynamic>? cachedCategories;

  static Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}),
      ).timeout(const Duration(seconds: 10));

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 || response.statusCode == 201) {
        token = data['token'];
        currentUser = data['user'];
        return data;
      } else {
        throw Exception(data['message'] ?? 'Failed to login');
      }
    } catch (e) {
      if (e is Exception) rethrow;
      throw Exception('Connection to backend failed. Please make sure the backend is running.');
    }
  }

  static Future<Map<String, dynamic>> register({
    required String name,
    required String email,
    required String password,
    required String phone,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/auth/register'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'name': name,
          'email': email,
          'password': password,
          'phone': phone,
        }),
      ).timeout(const Duration(seconds: 10));

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 || response.statusCode == 201) {
        return data;
      } else {
        throw Exception(data['message'] ?? 'Failed to register');
      }
    } catch (e) {
      if (e is Exception) rethrow;
      throw Exception('Connection to backend failed. Please make sure the backend is running.');
    }
  }

  // Get all active products (optionally filtered by category or search term)
  static Future<List<dynamic>> getProducts({String? category, String? search}) async {
    try {
      String urlString = '$baseUrl/api/products';
      final params = <String>[];
      if (category != null && category.isNotEmpty) {
        params.add('category=${Uri.encodeComponent(category)}');
      }
      if (search != null && search.isNotEmpty) {
        params.add('search=${Uri.encodeComponent(search)}');
      }
      if (params.isNotEmpty) {
        urlString += '?${params.join('&')}';
      }

      final response = await http.get(
        Uri.parse(urlString),
        headers: {'Accept': 'application/json'},
      ).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body) as List<dynamic>;
        if (category == null && search == null) {
          cachedProducts = data;
        }
        return data;
      } else {
        throw Exception('Failed to load products');
      }
    } catch (e) {
      throw Exception('Error loading products: $e');
    }
  }

  // Get active categories
  static Future<List<dynamic>> getCategories() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/categories'),
        headers: {'Accept': 'application/json'},
      ).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body) as List<dynamic>;
        cachedCategories = data;
        return data;
      } else {
        throw Exception('Failed to load categories');
      }
    } catch (e) {
      throw Exception('Error loading categories: $e');
    }
  }

  // Get current user's orders
  static Future<List<dynamic>> getMyOrders() async {
    try {
      if (token == null) {
        throw Exception('User is not authenticated');
      }

      final response = await http.get(
        Uri.parse('$baseUrl/api/orders/my'),
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer $token',
        },
      ).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        return jsonDecode(response.body) as List<dynamic>;
      } else {
        final errData = jsonDecode(response.body);
        throw Exception(errData['message'] ?? 'Failed to load orders');
      }
    } catch (e) {
      throw Exception('Error loading orders: $e');
    }
  }

  // Create new order
  static Future<dynamic> createOrder({
    required List<Map<String, dynamic>> items,
    required Map<String, String> shippingAddress,
    required String paymentMethod,
  }) async {
    try {
      if (token == null) {
        throw Exception('User is not authenticated');
      }

      final response = await http.post(
        Uri.parse('$baseUrl/api/orders'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'items': items,
          'shippingAddress': shippingAddress,
          'paymentMethod': paymentMethod,
        }),
      ).timeout(const Duration(seconds: 15));

      if (response.statusCode == 201 || response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        final errData = jsonDecode(response.body);
        throw Exception(errData['message'] ?? 'Failed to create order');
      }
    } catch (e) {
      throw Exception('Error creating order: $e');
    }
  }

  // Get active offers
  static Future<List<dynamic>> getOffers() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/offers'),
        headers: {'Accept': 'application/json'},
      ).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        return jsonDecode(response.body) as List<dynamic>;
      } else {
        throw Exception('Failed to load offers');
      }
    } catch (e) {
      throw Exception('Error loading offers: $e');
    }
  }

  // Address Management
  static Future<List<dynamic>> addAddress({
    required String type,
    required String line1,
    required String city,
    required String state,
    required String postalCode,
    Map<String, double>? coordinates,
  }) async {
    try {
      if (token == null) throw Exception('User is not authenticated');

      final response = await http.post(
        Uri.parse('$baseUrl/api/auth/addresses'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'type': type,
          'line1': line1,
          'city': city,
          'state': state,
          'postalCode': postalCode,
          'coordinates': coordinates,
        }),
      ).timeout(const Duration(seconds: 10));

      final data = jsonDecode(response.body);
      if (response.statusCode == 200) {
        if (currentUser != null) {
          currentUser!['addresses'] = data['addresses'];
        }
        return data['addresses'] as List<dynamic>;
      } else {
        throw Exception(data['message'] ?? 'Failed to add address');
      }
    } catch (e) {
      throw Exception('Error adding address: $e');
    }
  }

  static Future<List<dynamic>> setDefaultAddress(String addressId) async {
    try {
      if (token == null) throw Exception('User is not authenticated');

      final response = await http.put(
        Uri.parse('$baseUrl/api/auth/addresses/$addressId/default'),
        headers: {'Authorization': 'Bearer $token'},
      ).timeout(const Duration(seconds: 10));

      final data = jsonDecode(response.body);
      if (response.statusCode == 200) {
        if (currentUser != null) {
          currentUser!['addresses'] = data['addresses'];
        }
        return data['addresses'] as List<dynamic>;
      } else {
        throw Exception(data['message'] ?? 'Failed to set default address');
      }
    } catch (e) {
      throw Exception('Error setting default address: $e');
    }
  }

  static Future<List<dynamic>> deleteAddress(String addressId) async {
    try {
      if (token == null) throw Exception('User is not authenticated');

      final response = await http.delete(
        Uri.parse('$baseUrl/api/auth/addresses/$addressId'),
        headers: {'Authorization': 'Bearer $token'},
      ).timeout(const Duration(seconds: 10));

      final data = jsonDecode(response.body);
      if (response.statusCode == 200) {
        if (currentUser != null) {
          currentUser!['addresses'] = data['addresses'];
        }
        return data['addresses'] as List<dynamic>;
      } else {
        throw Exception(data['message'] ?? 'Failed to delete address');
      }
    } catch (e) {
      throw Exception('Error deleting address: $e');
    }
  }
}
