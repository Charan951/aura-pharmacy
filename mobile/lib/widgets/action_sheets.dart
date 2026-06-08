import 'package:flutter/material.dart';
import '../services/cart_service.dart';
import '../services/api_service.dart';
import 'address_selection_sheet.dart';

class ActionSheets {
  static void showNotifications(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) {
        final isDark = Theme.of(context).brightness == Brightness.dark;
        return Container(
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF1E293B) : Colors.white,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
          ),
          padding: const EdgeInsets.all(24),
          child: SingleChildScrollView(
            child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Center(
                child: Container(
                  width: 50,
                  height: 5,
                  decoration: BoxDecoration(
                    color: isDark ? Colors.white24 : Colors.black12,
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
              const SizedBox(height: 24),
              const Row(
                children: [
                  Icon(Icons.notifications_active_rounded, color: Color(0xFF6366F1)),
                  SizedBox(width: 12),
                  Text(
                    'Notifications',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              
              // Notification items
              _buildNotificationItem(
                context,
                title: 'Prescription Verified',
                desc: 'Your uploaded prescription for Amoxicillin has been reviewed and verified by our pharmacist.',
                time: 'Just now',
                icon: Icons.check_circle_rounded,
                iconColor: const Color(0xFF10B981),
              ),
              const Divider(height: 20),
              _buildNotificationItem(
                context,
                title: 'Order Dispatched',
                desc: 'Order #71A9B2 containing Vitamin C has been packed and handed over to delivery partner.',
                time: '2 hours ago',
                icon: Icons.local_shipping_rounded,
                iconColor: const Color(0xFF0EA5E9),
              ),
              const Divider(height: 20),
              _buildNotificationItem(
                context,
                title: 'Special Summer Offers Live',
                desc: 'Get flat 20% discount on skincare products and summer protection creams.',
                time: '1 day ago',
                icon: Icons.percent_rounded,
                iconColor: const Color(0xFFD946EF),
              ),
              const SizedBox(height: 20),
              
              ElevatedButton(
                onPressed: () => Navigator.pop(context),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF6366F1),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                child: const Text(
                  'Dismiss All',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
          ),
        );
      },
    );
  }

  static Widget _buildNotificationItem(
    BuildContext context, {
    required String title,
    required String desc,
    required String time,
    required IconData icon,
    required Color iconColor,
  }) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: iconColor.withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: iconColor, size: 20),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    title,
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                  ),
                  Text(
                    time,
                    style: TextStyle(
                      fontSize: 10,
                      color: isDark ? const Color(0xFF64748B) : const Color(0xFF94A3B8),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 4),
              Text(
                desc,
                style: TextStyle(
                  fontSize: 11,
                  height: 1.4,
                  color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF475569),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  static void showCart(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) {
        String stage = 'cart'; // 'cart', 'loading'

        return StatefulBuilder(
          builder: (context, setState) {
            final isDark = Theme.of(context).brightness == Brightness.dark;
            
            return Container(
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF1E293B) : Colors.white,
                borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
              ),
              padding: EdgeInsets.only(
                left: 24, 
                right: 24, 
                top: 24, 
                bottom: MediaQuery.of(context).viewInsets.bottom + 24,
              ),
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Center(
                      child: Container(
                        width: 50,
                        height: 5,
                        decoration: BoxDecoration(
                          color: isDark ? Colors.white24 : Colors.black12,
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
                    
                    Row(
                      children: [
                        if (stage != 'cart') ...[
                          GestureDetector(
                            onTap: () {
                              if (stage != 'loading') {
                                setState(() => stage = 'cart');
                              }
                            },
                            child: const Icon(Icons.arrow_back_rounded, color: Color(0xFF6366F1)),
                          ),
                          const SizedBox(width: 12),
                        ],
                        Icon(
                          stage == 'cart' ? Icons.shopping_cart_rounded : Icons.local_shipping_rounded, 
                          color: const Color(0xFF6366F1),
                        ),
                        const SizedBox(width: 12),
                        Text(
                          stage == 'cart' ? 'Shopping Cart' : 'Shipping Details',
                          style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    
                    if (stage == 'loading')
                      const Padding(
                        padding: EdgeInsets.symmetric(vertical: 60),
                        child: Center(
                          child: CircularProgressIndicator(
                            valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF6366F1)),
                          ),
                        ),
                      )
                    else 
                      ListenableBuilder(
                        listenable: cartService,
                        builder: (context, _) {
                          if (cartService.items.isEmpty) {
                            return const Padding(
                              padding: EdgeInsets.symmetric(vertical: 40),
                              child: Center(
                                child: Text(
                                  'Your cart is empty',
                                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                                ),
                              ),
                            );
                          }

                          return Column(
                            children: [
                              ...cartService.items.map((item) => Padding(
                                    padding: const EdgeInsets.only(bottom: 16),
                                    child: _buildCartItem(context, item),
                                  )),
                              const SizedBox(height: 8),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  const Text('Subtotal', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                                  Text(
                                    '\$${cartService.totalAmount.toStringAsFixed(2)}',
                                    style: TextStyle(
                                      fontWeight: FontWeight.w900,
                                      fontSize: 18,
                                      color: isDark ? const Color(0xFF10B981) : const Color(0xFF059669),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 24),
                              ElevatedButton(
                                onPressed: () {
                                  Navigator.pop(context); // close cart
                                  showModalBottomSheet(
                                    context: context,
                                    isScrollControlled: true,
                                    backgroundColor: Colors.transparent,
                                    builder: (context) => Padding(
                                      padding: EdgeInsets.only(
                                        bottom: MediaQuery.of(context).viewInsets.bottom,
                                      ),
                                      child: SizedBox(
                                        height: MediaQuery.of(context).size.height * 0.7,
                                        child: AddressSelectionSheet(
                                          onAddressSelected: (address) async {
                                            // Place order directly
                                            try {
                                              showDialog(
                                                context: context,
                                                barrierDismissible: false,
                                                builder: (c) => const Center(child: CircularProgressIndicator(color: Color(0xFF6366F1))),
                                              );
                                              
                                              final items = cartService.items.map((item) => {
                                                'productId': item.id,
                                                'name': item.name,
                                                'price': item.price,
                                                'quantity': item.quantity,
                                              }).toList();
                                              
                                              await ApiService.createOrder(
                                                items: items,
                                                shippingAddress: {
                                                  'line1': address['line1'] ?? '',
                                                  'city': address['city'] ?? '',
                                                  'state': address['state'] ?? '',
                                                  'postalCode': address['postalCode'] ?? '',
                                                },
                                                paymentMethod: 'cod',
                                              );
                                              
                                              cartService.clearCart();
                                              if (context.mounted) {
                                                Navigator.pop(context); // close loading
                                                ScaffoldMessenger.of(context).showSnackBar(
                                                  SnackBar(
                                                    content: const Row(
                                                      children: [
                                                        Icon(Icons.check_circle_rounded, color: Colors.white),
                                                        SizedBox(width: 12),
                                                        Text('Order placed successfully! Check My Orders.'),
                                                      ],
                                                    ),
                                                    backgroundColor: const Color(0xFF10B981),
                                                    behavior: SnackBarBehavior.floating,
                                                    dismissDirection: DismissDirection.up,
                                                    margin: EdgeInsets.only(
                                                      bottom: MediaQuery.of(context).size.height - 120,
                                                      left: 20,
                                                      right: 20,
                                                    ),
                                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                                  ),
                                                );
                                              }
                                            } catch (e) {
                                              if (context.mounted) {
                                                Navigator.pop(context); // close loading
                                                ScaffoldMessenger.of(context).showSnackBar(
                                                  SnackBar(content: Text('Failed to place order: $e'), backgroundColor: Colors.redAccent),
                                                );
                                              }
                                            }
                                          },
                                        ),
                                      ),
                                    ),
                                  );
                                },
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF6366F1),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(16),
                                  ),
                                  padding: const EdgeInsets.symmetric(vertical: 16),
                                  minimumSize: const Size(double.infinity, 50),
                                ),
                                child: const Text(
                                  'Checkout',
                                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                                ),
                              ),
                            ],
                          );
                        },
                      ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  static Widget _buildCartItem(
    BuildContext context,
    CartItem item,
  ) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: const Color(0xFF6366F1).withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: const Icon(Icons.medication_rounded, color: Color(0xFF6366F1), size: 24),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                item.name,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
              ),
              const SizedBox(height: 6),
              Row(
                children: [
                  GestureDetector(
                    onTap: () => cartService.decrementItem(item.id),
                    child: Container(
                      padding: const EdgeInsets.all(4),
                      decoration: BoxDecoration(
                        color: isDark ? Colors.white12 : Colors.black12,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: const Icon(Icons.remove, size: 14),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Text(
                    '${item.quantity}',
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                  ),
                  const SizedBox(width: 12),
                  GestureDetector(
                    onTap: () => cartService.incrementItem(item.id),
                    child: Container(
                      padding: const EdgeInsets.all(4),
                      decoration: BoxDecoration(
                        color: isDark ? Colors.white12 : Colors.black12,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: const Icon(Icons.add, size: 14),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        Column(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(
              '\$${(item.price * item.quantity).toStringAsFixed(2)}',
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
            ),
            const SizedBox(height: 4),
            GestureDetector(
              onTap: () => cartService.removeItem(item.id),
              child: const Icon(Icons.delete_outline_rounded, color: Colors.redAccent, size: 20),
            ),
          ],
        ),
      ],
    );
  }
}
