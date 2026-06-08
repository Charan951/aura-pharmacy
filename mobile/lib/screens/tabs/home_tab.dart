import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import '../../services/cart_service.dart';
import '../../widgets/top_actions.dart';
import '../../widgets/address_selection_sheet.dart';

class HomeTab extends StatefulWidget {
  final void Function(String?) onNavigateToCategories;
  final VoidCallback onNavigateToSearch;

  const HomeTab({
    super.key,
    required this.onNavigateToCategories,
    required this.onNavigateToSearch,
  });

  @override
  State<HomeTab> createState() => _HomeTabState();
}

class _HomeTabState extends State<HomeTab> {
  List<dynamic> _products = [];
  List<dynamic> _categories = [];
  List<dynamic> _offers = [];
  Map<String, List<dynamic>> _categoryProducts = {};
  bool _isLoading = true;
  Map<String, dynamic>? _selectedAddress;
  String? _error;

  @override
  void initState() {
    super.initState();
    // Use cached data instantly if available to prevent loading spinners
    if (ApiService.cachedProducts != null && ApiService.cachedCategories != null) {
      _categories = ApiService.cachedCategories!;
      final products = ApiService.cachedProducts!;
      
      final Map<String, List<dynamic>> catProductsMap = {};
      for (var category in _categories) {
        final String catName = category['name'] ?? '';
        catProductsMap[catName] = products.where((p) {
          final productCat = p['category'];
          if (productCat == null) return false;
          if (productCat is String) {
            return productCat.toLowerCase() == catName.toLowerCase();
          } else if (productCat is Map) {
            return productCat['name']?.toString().toLowerCase() == catName.toLowerCase();
          }
          return false;
        }).toList();
      }
      
      _products = products.take(4).toList();
      _categoryProducts = catProductsMap;
      _isLoading = false;
      _initDefaultAddress();
    }
    
    _loadData();
  }

  Future<void> _loadData() async {
    if (_categories.isEmpty) {
      setState(() {
        _isLoading = true;
        _error = null;
      });
    }

    try {
      final results = await Future.wait([
        ApiService.getProducts(),
        ApiService.getCategories(),
        ApiService.getOffers(),
      ]);
      
      final products = results[0];
      final categories = results[1];
      final offers = results[2];

      if (mounted) {
        // Pre-compute category products to prevent slow build() method
        final Map<String, List<dynamic>> catProductsMap = {};
        for (var category in categories) {
          final String catName = category['name'] ?? '';
          catProductsMap[catName] = products.where((p) {
            final productCat = p['category'];
            if (productCat == null) return false;
            if (productCat is String) {
              return productCat.toLowerCase() == catName.toLowerCase();
            } else if (productCat is Map) {
              return productCat['name']?.toString().toLowerCase() == catName.toLowerCase();
            }
            return false;
          }).toList();
        }

        setState(() {
          // Take first 4 products as featured
          _products = products.take(4).toList();
          _categories = categories;
          _offers = offers;
          _categoryProducts = catProductsMap;
          _isLoading = false;
          _initDefaultAddress();
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

  void _initDefaultAddress() {
    final addresses = (ApiService.currentUser?['addresses'] as List<dynamic>?) ?? [];
    if (addresses.isNotEmpty && _selectedAddress == null) {
      _selectedAddress = addresses.firstWhere(
        (a) => a['isDefault'] == true, 
        orElse: () => addresses.first,
      );
    }
  }

  void _showAddressSelection() {
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
            onAddressSelected: (address) {
              setState(() => _selectedAddress = address);
            },
          ),
        ),
      ),
    ).then((_) {
      // Re-init in case addresses were deleted or changed
      setState(() => _initDefaultAddress());
    });
  }

  Widget _buildCategoryCard(dynamic category) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final String name = category['name'] ?? 'Category';
    final String imageUrl = category['image'] ?? '';

    IconData getIconForCategory(String catName) {
      final n = catName.toLowerCase();
      if (n == 'medicines') return Icons.medication_rounded;
      if (n == 'heart care') return Icons.favorite_rounded;
      if (n == 'baby care') return Icons.child_care_rounded;
      if (n == 'eye care') return Icons.remove_red_eye_rounded;
      if (n == 'skin care') return Icons.water_drop_rounded;
      if (n == 'fitness') return Icons.fitness_center_rounded;
      if (n == 'devices') return Icons.medical_services_rounded;
      if (n == 'nutrition') return Icons.eco_rounded;
      if (n == 'bags') return Icons.shopping_bag_rounded;
      return Icons.category_rounded;
    }

    final categoryIcon = getIconForCategory(name);

    return HoverableWidget(
      onTap: () {
        widget.onNavigateToCategories(name);
      },
      child: Container(
        width: 76,
        margin: const EdgeInsets.only(right: 16),
        child: Column(
        children: [
          Container(
            width: 64,
            height: 64,
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF1E293B) : Colors.white,
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(isDark ? 0.2 : 0.05),
                  blurRadius: 8,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: ClipOval(
              child: imageUrl.isNotEmpty
                  ? Image.network(
                      imageUrl,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) {
                        return Center(child: Icon(categoryIcon, color: const Color(0xFF6366F1)));
                      },
                    )
                  : Center(child: Icon(categoryIcon, color: const Color(0xFF6366F1))),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            name,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    ));
  }

  Widget _buildProductCard(dynamic product) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final String imageUrl = product['image'] ?? '';
    final String name = product['name'] ?? 'Product';
    final String brand = product['brand'] ?? 'Medicare';
    final double price = (product['price'] is num) ? (product['price'] as num).toDouble() : 0.0;

    return HoverableWidget(
      onTap: () {
        // We can navigate to product details here in the future
      },
      child: Container(
        width: 170,
        margin: const EdgeInsets.only(right: 16, bottom: 12),
        decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E293B) : Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isDark ? Colors.white.withOpacity(0.06) : Colors.black.withOpacity(0.05),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(isDark ? 0.1 : 0.04),
            blurRadius: 12,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Product Image Frame
          Expanded(
            child: Container(
              width: double.infinity,
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
                borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
              ),
              child: ClipRRect(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
                child: imageUrl.isNotEmpty
                    ? Image.network(
                        imageUrl,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) {
                          return const Center(child: Icon(Icons.medication_liquid_rounded, size: 50, color: Color(0xFF6366F1)));
                        },
                      )
                    : const Center(child: Icon(Icons.medication, size: 50, color: Color(0xFF6366F1))),
              ),
            ),
          ),
          // Details
          Padding(
            padding: const EdgeInsets.all(14.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  brand.toUpperCase(),
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 0.5,
                    color: isDark ? const Color(0xFF64748B) : const Color(0xFF94A3B8),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  name,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 10),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '\$${price.toStringAsFixed(2)}',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF10B981),
                      ),
                    ),
                    HoverableWidget(
                      scale: 1.1,
                      onTap: () {
                        cartService.addItem(product);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('${product['name'] ?? 'Product'} added to cart!'),
                            backgroundColor: const Color(0xFF10B981),
                            behavior: SnackBarBehavior.floating,
                            dismissDirection: DismissDirection.up,
                            margin: EdgeInsets.only(
                              bottom: MediaQuery.of(context).size.height - 120,
                              left: 20,
                              right: 20,
                            ),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            duration: const Duration(seconds: 2),
                          ),
                        );
                      },
                      child: Container(
                        width: 28,
                        height: 28,
                        decoration: const BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: LinearGradient(
                            colors: [Color(0xFF6366F1), Color(0xFF4F46E5)],
                          ),
                        ),
                        child: const Center(
                          child: Icon(
                            Icons.add_rounded,
                            size: 18,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    ));
  }


  @override
  Widget build(BuildContext context) {
    final userName = ApiService.currentUser?['name'] ?? 'User';
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // New Header Section
          Container(
            padding: const EdgeInsets.fromLTRB(24, 48, 24, 32),
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFF6366F1), Color(0xFFD946EF)],
                begin: Alignment.centerLeft,
                end: Alignment.centerRight,
              ),
              borderRadius: BorderRadius.vertical(
                bottom: Radius.circular(32),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top Row: Greeting & Actions
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Find Your Medicine',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 24,
                            fontWeight: FontWeight.w900,
                            letterSpacing: -0.5,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Hello, $userName 👋',
                          style: const TextStyle(
                            color: Colors.white70,
                            fontSize: 15,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                    const TopActions(
                      iconColor: Colors.white,
                      transparentBackground: true,
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                
                // Location Card
                GestureDetector(
                  onTap: _showAddressSelection,
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF1E293B) : Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(isDark ? 0.2 : 0.03),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            color: isDark ? const Color(0xFF312E81).withOpacity(0.5) : const Color(0xFFEEF2FF),
                            shape: BoxShape.circle,
                          ),
                          child: const Center(
                            child: Icon(Icons.location_on, color: Color(0xFF6366F1), size: 22),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Deliver to',
                                style: TextStyle(
                                  color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                                  fontSize: 13,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Row(
                                children: [
                                  Text(
                                    _selectedAddress != null 
                                      ? (_selectedAddress!['type']?.toString().toUpperCase() ?? 'OTHER') + ' - ' + (_selectedAddress!['line1'] ?? '')
                                      : 'Add Delivery Address',
                                    style: TextStyle(
                                      color: isDark ? Colors.white : const Color(0xFF0F172A),
                                      fontSize: 14,
                                      fontWeight: FontWeight.bold,
                                    ),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  const SizedBox(width: 4),
                                  Icon(Icons.keyboard_arrow_down_rounded, size: 18, color: isDark ? Colors.white : const Color(0xFF0F172A)),
                                ],
                              ),
                              if (_selectedAddress != null) ...[
                                const SizedBox(height: 4),
                                Row(
                                  children: [
                                    Expanded(
                                      child: Text(
                                        '${_selectedAddress!['city'] ?? ''}, ${_selectedAddress!['state'] ?? ''}',
                                        style: TextStyle(
                                          color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF94A3B8),
                                          fontSize: 12,
                                        ),
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ],
                          ),
                        ),
                        const SizedBox(width: 8),
                        const Text(
                          'Change >',
                          style: TextStyle(
                            color: Color(0xFF6366F1),
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                
                // Search Bar
                GestureDetector(
                  onTap: widget.onNavigateToSearch,
                  child: Container(
                    height: 54,
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF1E293B) : Colors.white,
                      borderRadius: BorderRadius.circular(27),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(isDark ? 0.2 : 0.03),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Row(
                      children: [
                        Icon(Icons.search_rounded, size: 24, color: isDark ? const Color(0xFF64748B) : const Color(0xFF94A3B8)),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            'Search medicines, health products...',
                            style: TextStyle(
                              color: isDark ? const Color(0xFF64748B) : const Color(0xFF94A3B8),
                              fontSize: 15,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Categories Section
          Padding(
            padding: const EdgeInsets.fromLTRB(24, 32, 24, 0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Categories',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w900,
                    letterSpacing: -0.5,
                  ),
                ),
                TextButton(
                  onPressed: () => widget.onNavigateToCategories(null),
                  child: const Text(
                    'See All',
                    style: TextStyle(
                      color: Color(0xFF6366F1),
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),

          // Horizontal Categories List
          SizedBox(
            height: 100,
            child: _isLoading
                ? const Center(
                    child: CircularProgressIndicator(
                      valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF6366F1)),
                    ),
                  )
                : _categories.isEmpty
                    ? const Center(
                        child: Text(
                          'No categories found.',
                          style: TextStyle(fontSize: 13),
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.only(left: 24),
                        scrollDirection: Axis.horizontal,
                        itemCount: _categories.length,
                        physics: const BouncingScrollPhysics(),
                        itemBuilder: (context, index) {
                          return _buildCategoryCard(_categories[index]);
                        },
                      ),
          ),

          // Offers/Coupons Carousel
          if (!_isLoading && _offers.isNotEmpty)
            Container(
              height: 160,
              margin: const EdgeInsets.only(top: 24, bottom: 8),
              child: PageView.builder(
                controller: PageController(viewportFraction: 0.92),
                physics: const BouncingScrollPhysics(),
                itemCount: _offers.length,
                itemBuilder: (context, index) {
                  final offer = _offers[index];
                  final String title = offer['title'] ?? 'Special Offer';
                  final String desc = offer['description'] ?? 'Grab it now';
                  final String code = offer['code'] ?? 'PROMO';
                  final num discount = offer['discount'] ?? 0;
                  final String imageUrl = offer['image'] ?? '';

                  return HoverableWidget(
                    onTap: () {},
                    child: Container(
                      margin: const EdgeInsets.symmetric(horizontal: 8),
                      decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(24),
                      gradient: const LinearGradient(
                        colors: [Color(0xFF6366F1), Color(0xFF8B5CF6)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF6366F1).withOpacity(0.3),
                          blurRadius: 15,
                          offset: const Offset(0, 8),
                        ),
                      ],
                    ),
                    child: Stack(
                      children: [
                        if (imageUrl.isNotEmpty)
                          Positioned.fill(
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(24),
                              child: Opacity(
                                opacity: 0.2,
                                child: Image.network(imageUrl, fit: BoxFit.cover),
                              ),
                            ),
                          ),
                        Padding(
                          padding: const EdgeInsets.all(20),
                          child: Row(
                            children: [
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: Colors.white.withOpacity(0.2),
                                        borderRadius: BorderRadius.circular(20),
                                      ),
                                      child: Text(
                                        '$discount% OFF',
                                        style: const TextStyle(
                                          color: Colors.white,
                                          fontWeight: FontWeight.bold,
                                          fontSize: 12,
                                        ),
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      title,
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontSize: 20,
                                        fontWeight: FontWeight.w900,
                                        letterSpacing: -0.5,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      desc,
                                      style: TextStyle(
                                        color: Colors.white.withOpacity(0.8),
                                        fontSize: 13,
                                      ),
                                      maxLines: 2,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(width: 16),
                              Container(
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                child: Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    const Text(
                                      'Code',
                                      style: TextStyle(
                                        color: Colors.grey,
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    Text(
                                      code,
                                      style: const TextStyle(
                                        color: Color(0xFF6366F1),
                                        fontWeight: FontWeight.w900,
                                        fontSize: 14,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ));
                },
              ),
            ),

          // Featured Products Section
          Padding(
            padding: const EdgeInsets.fromLTRB(24, 16, 24, 0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Featured Medicines',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w900,
                    letterSpacing: -0.5,
                  ),
                ),
                TextButton(
                  onPressed: () => widget.onNavigateToCategories(null),
                  child: const Text(
                    'See All',
                    style: TextStyle(
                      color: Color(0xFF6366F1),
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 12),

          // Horizontal Products List
          SizedBox(
            height: 240,
            child: _isLoading
                ? const Center(
                    child: CircularProgressIndicator(
                      valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF6366F1)),
                    ),
                  )
                : _error != null
                    ? Center(
                        child: Text(
                          _error!,
                          style: const TextStyle(color: Colors.redAccent, fontSize: 13),
                        ),
                      )
                    : _products.isEmpty
                        ? const Center(
                            child: Text(
                              'No products found.',
                              style: TextStyle(fontSize: 13),
                            ),
                          )
                        : ListView.builder(
                            padding: const EdgeInsets.only(left: 24),
                            scrollDirection: Axis.horizontal,
                            itemCount: _products.length,
                            physics: const BouncingScrollPhysics(),
                            itemBuilder: (context, index) {
                              return _buildProductCard(_products[index]);
                            },
                          ),
          ),

          // Categories Products Sections
          if (!_isLoading && _categories.isNotEmpty)
            ..._categories.map((category) {
              final String catName = category['name'] ?? '';
              final List<dynamic> catProducts = _categoryProducts[catName] ?? [];

              if (catProducts.isEmpty) {
                return const SizedBox.shrink();
              }

              final displayProducts = catProducts.take(4).toList();

              return Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Padding(
                    padding: const EdgeInsets.fromLTRB(24, 32, 24, 0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          catName,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w900,
                            letterSpacing: -0.5,
                          ),
                        ),
                        TextButton(
                          onPressed: () => widget.onNavigateToCategories(catName),
                          child: const Text(
                            'See All',
                            style: TextStyle(
                              color: Color(0xFF6366F1),
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    height: 240,
                    child: ListView.builder(
                      padding: const EdgeInsets.only(left: 24),
                      scrollDirection: Axis.horizontal,
                      itemCount: displayProducts.length,
                      physics: const BouncingScrollPhysics(),
                      itemBuilder: (context, index) {
                        return _buildProductCard(displayProducts[index]);
                      },
                    ),
                  ),
                ],
              );
            }).toList(),

          const SizedBox(height: 40),
        ],
      ),
    );
  }
}

class HoverableWidget extends StatefulWidget {
  final Widget child;
  final VoidCallback? onTap;
  final double scale;
  
  const HoverableWidget({super.key, required this.child, this.onTap, this.scale = 1.03});

  @override
  State<HoverableWidget> createState() => _HoverableWidgetState();
}

class _HoverableWidgetState extends State<HoverableWidget> {
  bool _isHovered = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      cursor: widget.onTap != null ? SystemMouseCursors.click : SystemMouseCursors.basic,
      child: GestureDetector(
        onTap: widget.onTap,
        child: AnimatedScale(
          scale: _isHovered && widget.onTap != null ? widget.scale : 1.0,
          duration: const Duration(milliseconds: 200),
          curve: Curves.easeOutCubic,
          child: widget.child,
        ),
      ),
    );
  }
}
