import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useLocation } from 'react-router-dom';
import { Info } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { PharmacyCard } from '../../components/PharmacyCard';
import { Alert } from '../../components/ui/Alert';
import { SearchBar } from '../../components/ui/SearchBar';
import { useNavigate } from 'react-router-dom';
import { searchMedicines } from '../../services/api';

export function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || 'Medicine';
  const location = useLocation();
  const isUser = location.pathname.startsWith('/user');
  const searchPath = isUser ? '/user/search' : '/search';
  const comparePath = isUser ? '/user/compare' : '/compare';
  const navigate = useNavigate();

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLoc, setUserLoc] = useState<{ lat: number, lng: number } | undefined>(undefined);

  // Sort and Filter State
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [filterInStock, setFilterInStock] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    // Try to get location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log("Loc error", err)
      );
    }
  }, []);

  useEffect(() => {
    fetchResults();
  }, [query, userLoc]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const data = await searchMedicines(query, userLoc);
      setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newQuery: string) => {
    if (newQuery.trim()) {
      navigate(`${searchPath}?q=${encodeURIComponent(newQuery)}`);
    }
  };

  const handleCompare = () => {
    navigate(`${comparePath}?q=${encodeURIComponent(query)}`);
  };

  const isOpenNow = (hours?: string) => {
    if (!hours) return false; // Assume closed if no hours known or just filter out? Let's say false.
    // Very basic check logic mock
    return hours.toLowerCase().includes('open') || hours.includes('24');
  };

  const filteredResults = results.filter(item => {
    const stockStatus = item.stock === 0 ? 'Out of Stock' : (item.stock < (item.lowStockThreshold || 50) ? 'Low Stock' : 'In Stock');
    if (filterInStock && stockStatus !== 'In Stock') return false;
    if (filterOpen && !isOpenNow(item.openingHours)) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto mb-8">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search for another medicine..."
          className="shadow-md"
        />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Results for "{query}"</h1>
          <p className="text-lg text-gray-600 mt-1">
            Found {filteredResults.length} pharmacies nearby
          </p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-300 px-3 py-2">
            <span className="text-sm text-gray-600 font-medium">Sort by:</span>
            <select
              className="border-none bg-transparent text-sm font-medium focus:ring-0 cursor-pointer text-gray-900"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="default">Best Match</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          <Button
            variant={filterInStock ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilterInStock(!filterInStock)}
          >
            In Stock Only
          </Button>
          {/* <Button
            variant={filterOpen ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            Open Now
          </Button> */}

          <Link to={`${comparePath}?q=${query}`}>
            <Button variant="primary" size="sm">Compare Prices</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Main Results Column */}
        <div className="lg:col-span-3">
          {loading ? (
            <p className="text-center text-gray-500">Searching...</p>
          ) : filteredResults.length === 0 ? (
            <Alert variant="warning" title="No results found">
              We couldn't find any pharmacies matching your criteria.
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredResults.map((item) => {
                const stockStatus = item.stock === 0 ? 'Out of Stock' : (item.stock < (item.lowStockThreshold || 50) ? 'Low Stock' : 'In Stock');
                return (
                  <PharmacyCard
                    key={item.id}
                    name={item.pharmacyName}
                    address={item.address || 'Address not available'}
                    distance={item.distance ? `${item.distance.toFixed(1)} km` : 'Unknown distance'}
                    price={`LKR ${item.price.toFixed(2)}`}
                    stockStatus={stockStatus}
                    phone={item.phone}
                    hours={item.openingHours}
                    onViewDetails={() => console.log('View details', item.id)}
                    onCompare={handleCompare}
                  />
                )
              })}
            </div>
          )}
        </div>

        {/* Alternatives Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 sticky top-4">
            <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
              <Info className="h-5 w-5 mr-2" />
              Smart Suggestions
            </h2>
            <p className="text-sm text-blue-800 mb-6">
              Consider generic alternatives to save money. Always consult your doctor.
            </p>

            <div className="space-y-4">
              <p className="text-center text-gray-500 italic">No suggestions available.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}