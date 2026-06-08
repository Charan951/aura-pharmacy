import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import '../../services/cart_service.dart';
import '../../widgets/top_actions.dart';

class CategoriesTab extends StatefulWidget {
  const CategoriesTab({super.key});

  @override
  State<CategoriesTab> createState() => CategoriesTabState();
}

class CategoriesTabState extends State<CategoriesTab> {
  List<dynamic> _categories = [];
  List<dynamic> _categoryProducts = [];
  String? _selectedCategory;
  bool _isLoadingCategories = true;
  bool _isLoadingProducts = false;
  String? _categoriesError;
  String? _productsError;

  @override
  void initState() {
    super.initState();
    _loadCategories();
  }

  void loadCategory(String categoryName) {
    _loadProductsForCategory(categoryName);
  }

  void clearCategory() {
    setState(() {
      _selectedCategory = null;
    });
  }

  Future<void> _loadCategories() async {
    setState(() {
      _isLoadingCategories = true;
      _categoriesError = null;
    });

    try {
      final categories = await ApiService.getCategories();
      if (mounted) {
        setState(() {
          _categories = categories;
          _isLoadingCategories = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _categoriesError = e.toString().replaceAll('Exception:', '').trim();
          _isLoadingCategories = false;
        });
      }
    }
  }

  Future<void> _loadProductsForCategory(String categoryName) async {
    if (ApiService.cachedProducts != null) {
      setState(() {
        _selectedCategory = categoryName;
        _isLoadingProducts = false;
        _productsError = null;
        _categoryProducts = ApiService.cachedProducts!.where((p) {
          final productCat = p['category'];
          if (productCat == null) return false;
          if (productCat is String) {
            return productCat.toLowerCase() == categoryName.toLowerCase();
          } else if (productCat is Map) {
            return productCat['name']?.toString().toLowerCase() == categoryName.toLowerCase();
          }
          return false;
        }).toList();
      });
      return;
    }

    setState(() {
      _selectedCategory = categoryName;
      _isLoadingProducts = true;
      _productsError = null;
      _categoryProducts = [];
    });

    try {
      final products = await ApiService.getProducts(category: categoryName);
      if (mounted) {
        setState(() {
          _categoryProducts = products;
          _isLoadingProducts = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _productsError = e.toString().replaceAll('Exception:', '').trim();
          _isLoadingProducts = false;
        });
      }
    }
  }

  Widget _buildProductGridItem(dynamic product) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final String name = product['name'] ?? '';
    final String brand = product['brand'] ?? 'Medicare';
    final String imageUrl = product['image'] ?? '';
    final double price = (product['price'] is num) ? (product['price'] as num).toDouble() : 0.0;

    return Container(
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E293B) : Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isDark ? Colors.white.withOpacity(0.06) : Colors.black.withOpacity(0.05),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Image
          Expanded(
            child: Container(
              width: double.infinity,
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF1F5F9),
                borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
              ),
              child: ClipRRect(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
                child: imageUrl.isNotEmpty
                    ? Image.network(
                        imageUrl,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) => const Icon(Icons.medical_services_outlined, color: Color(0xFF6366F1)),
                      )
                    : const Icon(Icons.medical_services_outlined, color: Color(0xFF6366F1)),
              ),
            ),
          ),
          // Info
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  brand,
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: isDark ? const Color(0xFF64748B) : const Color(0xFF94A3B8),
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  name,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 6),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '\$${price.toStringAsFixed(2)}',
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF10B981),
                      ),
                    ),
                    GestureDetector(
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
                        width: 24,
                        height: 24,
                        decoration: const BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: LinearGradient(
                            colors: [Color(0xFF6366F1), Color(0xFFD946EF)],
                          ),
                        ),
                        child: const Center(
                          child: Icon(
                            Icons.shopping_cart_rounded,
                            size: 13,
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
    );
  }

  IconData _getIconForCategory(String catName) {
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

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    if (_selectedCategory == null && _categories.isNotEmpty) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _loadProductsForCategory(_categories.first['name'] ?? '');
      });
    }

    return Row(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // LEFT SIDE: Categories
        Container(
          width: 250,
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
            border: Border(
              right: BorderSide(
                color: isDark ? Colors.white.withOpacity(0.1) : Colors.black.withOpacity(0.05),
              ),
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 24, 20, 16),
                child: Text(
                  'Categories',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w900,
                    letterSpacing: -0.5,
                    color: isDark ? Colors.white : const Color(0xFF0F172A),
                  ),
                ),
              ),
              Expanded(
                child: _isLoadingCategories
                    ? const Center(
                        child: CircularProgressIndicator(
                          valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF6366F1)),
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        itemCount: _categories.length,
                        physics: const BouncingScrollPhysics(),
                        itemBuilder: (context, index) {
                          final category = _categories[index];
                          final name = category['name'] ?? 'Category';
                          final isSelected = _selectedCategory == name;
                          return Material(
                            color: Colors.transparent,
                            child: InkWell(
                              onTap: () => _loadProductsForCategory(name),
                              borderRadius: BorderRadius.circular(12),
                              hoverColor: const Color(0xFF6366F1).withOpacity(0.05),
                              child: Container(
                                margin: const EdgeInsets.only(bottom: 8),
                                padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 16),
                                decoration: BoxDecoration(
                                  color: isSelected 
                                      ? const Color(0xFF6366F1).withOpacity(0.1) 
                                      : Colors.transparent,
                                  borderRadius: BorderRadius.circular(12),
                                  border: isSelected
                                      ? Border.all(color: const Color(0xFF6366F1).withOpacity(0.5))
                                      : Border.all(color: Colors.transparent),
                                ),
                                child: Row(
                                  children: [
                                    Icon(
                                      _getIconForCategory(name),
                                      color: isSelected ? const Color(0xFF6366F1) : (isDark ? Colors.grey[400] : Colors.grey),
                                      size: 22,
                                    ),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: Text(
                                        name,
                                        style: TextStyle(
                                          fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
                                          fontSize: 14,
                                          color: isSelected 
                                              ? const Color(0xFF6366F1) 
                                              : (isDark ? Colors.white70 : Colors.black87),
                                        ),
                                      ),
                                    ),
                                    if (isSelected)
                                      const Icon(Icons.chevron_right_rounded, color: Color(0xFF6366F1), size: 20),
                                  ],
                                ),
                              ),
                            ),
                          );
                        },
                      ),
              ),
            ],
          ),
        ),

        // RIGHT SIDE: Products
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Header Bar
              Padding(
                padding: const EdgeInsets.fromLTRB(24, 16, 24, 16),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            _selectedCategory ?? 'Select a Category',
                            style: const TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.w900,
                              letterSpacing: -0.5,
                            ),
                          ),
                          Text(
                            'Browse products in this category',
                            style: TextStyle(
                              fontSize: 13,
                              color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              // Products Grid
              Expanded(
                child: AnimatedSwitcher(
                  duration: const Duration(milliseconds: 300),
                  switchInCurve: Curves.easeOut,
                  switchOutCurve: Curves.easeIn,
                  child: _isLoadingProducts
                      ? const Center(
                          key: ValueKey('loading'),
                          child: CircularProgressIndicator(
                            valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF6366F1)),
                          ),
                        )
                      : _productsError != null
                          ? Center(
                              key: const ValueKey('error'),
                              child: Padding(
                                padding: const EdgeInsets.all(24.0),
                                child: Text(_productsError!, style: const TextStyle(color: Colors.redAccent)),
                              ),
                            )
                          : _categoryProducts.isEmpty
                              ? Center(
                                  key: ValueKey('empty_$_selectedCategory'),
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      const Icon(Icons.medication_rounded, size: 64, color: Colors.grey),
                                      const SizedBox(height: 16),
                                      Text(
                                        _selectedCategory == null ? 'Select a category to view products.' : 'No medicines in this category yet.',
                                        style: const TextStyle(fontSize: 14, color: Colors.grey),
                                      ),
                                    ],
                                  ),
                                )
                              : GridView.builder(
                                  key: ValueKey('grid_$_selectedCategory'),
                                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
                                  gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
                                    maxCrossAxisExtent: 220,
                                    crossAxisSpacing: 16,
                                    mainAxisSpacing: 16,
                                    childAspectRatio: 0.72,
                                  ),
                                  itemCount: _categoryProducts.length,
                                  physics: const BouncingScrollPhysics(),
                                  itemBuilder: (context, index) {
                                    return _buildProductGridItem(_categoryProducts[index]);
                                  },
                                ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
