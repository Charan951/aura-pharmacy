import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import '../../widgets/top_actions.dart';

class OrdersTab extends StatefulWidget {
  const OrdersTab({super.key});

  @override
  State<OrdersTab> createState() => OrdersTabState();
}

class OrdersTabState extends State<OrdersTab> {
  List<dynamic> _orders = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    loadOrders();
  }

  Future<void> loadOrders() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final orders = await ApiService.getMyOrders();
      if (mounted) {
        setState(() {
          _orders = orders;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = e.toString().replaceAll('Exception:', '').trim();
          _isLoading = false;
        });
      }
    }
  }

  Widget _buildStatusBadge(String status) {
    Color color;
    Color textColor;

    switch (status.toLowerCase()) {
      case 'delivered':
        color = const Color(0xFFD1FAE5);
        textColor = const Color(0xFF065F46);
        break;
      case 'shipped':
        color = const Color(0xFFDBEAFE);
        textColor = const Color(0xFF1E40AF);
        break;
      case 'packed':
        color = const Color(0xFFF3E8FF);
        textColor = const Color(0xFF6B21A8);
        break;
      case 'confirmed':
        color = const Color(0xFFE0F2FE);
        textColor = const Color(0xFF0369A1);
        break;
      case 'cancelled':
        color = const Color(0xFFFEE2E2);
        textColor = const Color(0xFF991B1B);
        break;
      case 'pending':
      default:
        color = const Color(0xFFFEF3C7);
        textColor = const Color(0xFF92400E);
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        status.toUpperCase(),
        style: TextStyle(
          color: textColor,
          fontSize: 10,
          fontWeight: FontWeight.w800,
          letterSpacing: 0.5,
        ),
      ),
    );
  }

  Widget _buildOrderCard(dynamic order) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final String id = order['_id'] ?? 'Order ID';
    final double total = (order['total'] is num) ? (order['total'] as num).toDouble() : 0.0;
    final String status = order['status'] ?? 'pending';
    final String paymentMethod = order['paymentMethod'] ?? 'cod';
    final List<dynamic> items = order['items'] ?? [];
    
    // Parse date
    String dateStr = '';
    if (order['createdAt'] != null) {
      try {
        final parsedDate = DateTime.parse(order['createdAt']);
        dateStr = '${parsedDate.day}/${parsedDate.month}/${parsedDate.year}';
      } catch (_) {
        dateStr = order['createdAt'].toString().split('T')[0];
      }
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E293B) : Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: isDark ? Colors.white.withOpacity(0.06) : Colors.black.withOpacity(0.05),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(isDark ? 0.15 : 0.02),
            blurRadius: 15,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: ExpansionTile(
        tilePadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        childrenPadding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
        expandedCrossAxisAlignment: CrossAxisAlignment.stretch,
        shape: const Border(), // Removes bottom divider line on expansion
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Order #${id.substring(id.length - 6).toUpperCase()}',
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                _buildStatusBadge(status),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Icon(Icons.calendar_today_rounded, size: 12, color: isDark ? Colors.white54 : Colors.black45),
                const SizedBox(width: 6),
                Text(
                  dateStr,
                  style: TextStyle(
                    fontSize: 12,
                    color: isDark ? Colors.white54 : Colors.black45,
                  ),
                ),
                const SizedBox(width: 16),
                Icon(Icons.payment_rounded, size: 12, color: isDark ? Colors.white54 : Colors.black45),
                const SizedBox(width: 6),
                Text(
                  paymentMethod.toUpperCase(),
                  style: TextStyle(
                    fontSize: 12,
                    color: isDark ? Colors.white54 : Colors.black45,
                  ),
                ),
              ],
            ),
          ],
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 8.0),
          child: Text(
            '\$${total.toStringAsFixed(2)}',
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w900,
              color: Color(0xFF10B981),
            ),
          ),
        ),
        children: [
          const Divider(),
          const SizedBox(height: 12),
          const Text(
            'Order Items:',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
          ),
          const SizedBox(height: 8),
          ...items.map((item) {
            final String itemName = item['name'] ?? 'Product';
            final int quantity = item['quantity'] ?? 1;
            final double itemPrice = (item['price'] is num) ? (item['price'] as num).toDouble() : 0.0;
            return Padding(
              padding: const EdgeInsets.symmetric(vertical: 4.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      '$itemName x $quantity',
                      style: const TextStyle(fontSize: 13),
                    ),
                  ),
                  Text(
                    '\$${(itemPrice * quantity).toStringAsFixed(2)}',
                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            );
          }),
          const SizedBox(height: 16),
          // Address details
          if (order['shippingAddress'] != null) ...[
            const Text(
              'Delivery Address:',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
            ),
            const SizedBox(height: 4),
            Text(
              '${order['shippingAddress']['line1']}, ${order['shippingAddress']['city']}, ${order['shippingAddress']['state']} ${order['shippingAddress']['postalCode']}',
              style: TextStyle(
                fontSize: 12,
                color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                height: 1.4,
              ),
            ),
          ],
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Title Block
        Padding(
          padding: const EdgeInsets.fromLTRB(24, 24, 24, 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'My Orders',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w900,
                      letterSpacing: -0.5,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    'Track status of your medication shipments',
                    style: TextStyle(
                      fontSize: 13,
                      color: Colors.grey,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),

        // Scrollable List
        Expanded(
          child: _isLoading
              ? const Center(
                  child: CircularProgressIndicator(
                    valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF6366F1)),
                  ),
                )
              : _error != null
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(_error!, style: const TextStyle(color: Colors.redAccent)),
                          const SizedBox(height: 12),
                          ElevatedButton(
                            onPressed: loadOrders,
                            child: const Text('Retry'),
                          ),
                        ],
                      ),
                    )
                  : _orders.isEmpty
                      ? RefreshIndicator(
                          onRefresh: loadOrders,
                          color: const Color(0xFF6366F1),
                          child: SingleChildScrollView(
                            physics: const AlwaysScrollableScrollPhysics(),
                            child: SizedBox(
                              height: MediaQuery.of(context).size.height * 0.6,
                              child: const Center(
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(Icons.local_shipping_outlined, size: 64, color: Colors.grey),
                                    SizedBox(height: 16),
                                    Text(
                                      'You haven\'t placed any orders yet.',
                                      style: TextStyle(fontSize: 14, color: Colors.grey),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        )
                      : RefreshIndicator(
                          onRefresh: loadOrders,
                          color: const Color(0xFF6366F1),
                          child: ListView.builder(
                            padding: const EdgeInsets.all(24),
                            itemCount: _orders.length,
                            physics: const AlwaysScrollableScrollPhysics(parent: BouncingScrollPhysics()),
                            itemBuilder: (context, index) {
                              return _buildOrderCard(_orders[index]);
                            },
                          ),
                        ),
        ),
      ],
    );
  }
}
