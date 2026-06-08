import 'package:flutter/material.dart';
import 'action_sheets.dart';
import '../services/cart_service.dart';

class TopActions extends StatelessWidget {
  final Color? iconColor;
  final bool transparentBackground;

  const TopActions({
    super.key,
    this.iconColor,
    this.transparentBackground = false,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final resolvedColor = iconColor ?? (isDark ? Colors.white : const Color(0xFF1E293B));
    final bgColor = transparentBackground ? Colors.transparent : (isDark ? const Color(0xFF1E293B) : Colors.white);
    final shadows = transparentBackground ? <BoxShadow>[] : [
      BoxShadow(
        color: Colors.black.withOpacity(isDark ? 0.2 : 0.04),
        blurRadius: 12,
        offset: const Offset(0, 4),
      ),
    ];

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Notification Bell Button
        Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: bgColor,
            borderRadius: BorderRadius.circular(14),
            boxShadow: shadows,
          ),
          child: Stack(
            children: [
              Center(
                child: IconButton(
                  icon: Icon(
                    Icons.notifications_none_rounded,
                    color: resolvedColor,
                    size: 24,
                  ),
                  onPressed: () => ActionSheets.showNotifications(context),
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(),
                ),
              ),
              Positioned(
                top: 10,
                right: 12,
                child: Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: const Color(0xFFEF4444),
                    shape: BoxShape.circle,
                    border: Border.all(color: isDark ? const Color(0xFF1E293B) : Colors.white, width: 1.5),
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(width: 12),
        // Shopping Cart Button
        Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: bgColor,
            borderRadius: BorderRadius.circular(14),
            boxShadow: shadows,
          ),
          child: Stack(
            children: [
              Center(
                child: IconButton(
                  icon: Icon(
                    Icons.shopping_cart_outlined,
                    color: resolvedColor,
                    size: 24,
                  ),
                  onPressed: () => ActionSheets.showCart(context),
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(),
                ),
              ),
              Positioned(
                top: 8,
                right: 8,
                child: ListenableBuilder(
                  listenable: cartService,
                  builder: (context, _) {
                    if (cartService.totalItems == 0) return const SizedBox.shrink();
                    return Container(
                      padding: const EdgeInsets.all(2),
                      decoration: BoxDecoration(
                        color: const Color(0xFF10B981),
                        shape: BoxShape.circle,
                        border: Border.all(color: isDark ? const Color(0xFF1E293B) : Colors.white, width: 1.5),
                      ),
                      constraints: const BoxConstraints(
                        minWidth: 16,
                        minHeight: 16,
                      ),
                      child: Text(
                        '${cartService.totalItems}',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 9,
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
