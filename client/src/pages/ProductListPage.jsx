import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { HiOutlineAdjustments, HiOutlineSearch, HiX } from 'react-icons/hi';

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products, pagination, loading } = useSelector(state => state.products);

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
    page: searchParams.get('page') || 1,
  });

  useEffect(() => {
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    dispatch(fetchProducts(params));
  }, [filters, dispatch]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      if (key !== 'page') newFilters.page = 1;
      return newFilters;
    });
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', minPrice: '', maxPrice: '', sort: 'newest', page: 1 });
    setSearchParams({});
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  return (
    <div className="pt-[140px] pb-12 min-h-screen bg-dark-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-dark-900">
              {filters.search ? `Results for "${filters.search}"` : 'All Products'}
            </h1>
            <p className="text-dark-400 text-sm mt-1">{pagination?.total || 0} products found</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="input-field !w-auto text-sm !py-2.5"
              id="sort-select"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary !py-2.5 flex items-center space-x-1.5 lg:hidden" id="filter-toggle">
              <HiOutlineAdjustments className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
            <div className="card p-5 sticky top-24 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-dark-800">Filters</h3>
                <button onClick={clearFilters} className="text-xs text-primary-600 hover:underline">Clear all</button>
              </div>

              {/* Search */}
              <div>
                <label className="block text-xs font-medium text-dark-500 mb-1.5">Search</label>
                <div className="relative">
                  <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="input-field !py-2 !pl-9 text-sm"
                  />
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-xs font-medium text-dark-500 mb-1.5">Price Range</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="₹ Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="input-field !py-2 text-sm"
                  />
                  <span className="text-dark-400">—</span>
                  <input
                    type="number"
                    placeholder="₹ Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="input-field !py-2 text-sm"
                  />
                </div>
              </div>

              {/* Sort (mobile visible) */}
              <div className="lg:hidden">
                <label className="block text-xs font-medium text-dark-500 mb-1.5">Sort By</label>
                <select value={filters.sort} onChange={(e) => handleFilterChange('sort', e.target.value)} className="input-field !py-2 text-sm">
                  {sortOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <button onClick={() => setShowFilters(false)} className="lg:hidden btn-primary w-full text-sm">Apply Filters</button>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <LoadingSpinner text="Loading products..." />
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-dark-800 mb-2">No products found</h3>
                <p className="text-dark-400 mb-6">Try adjusting your filters or search term</p>
                <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                  {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <div className="flex justify-center mt-10 space-x-2">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => handleFilterChange('page', page)}
                        className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                          pagination.page === page
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                            : 'bg-white text-dark-600 hover:bg-dark-50 border border-dark-200'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
