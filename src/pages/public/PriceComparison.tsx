import React, { useState } from 'react';
import { useSearchParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Check, Navigation, SlidersHorizontal } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

const COMPARISON_DATA = [
  {
    id: 4,
    name: 'Generika Drugstore',
    price: 45.00,
    distance: 3.0,
    address: '321 Mabini St',
    stock: 'Out of Stock',
    generic: true
  },
  {
    id: 2,
    name: 'City Drugstore',
    price: 48.50,
    distance: 1.2,
    address: '456 Rizal Ave',
    stock: 'Low Stock',
    generic: false
  },
  {
    id: 1,
    name: 'HealthPlus Pharmacy',
    price: 50.00,
    distance: 0.5,
    address: '123 Main St',
    stock: 'In Stock',
    generic: false
  },
  {
    id: 3,
    name: 'Mercury Drug',
    price: 52.00,
    distance: 2.5,
    address: '789 Quezon Blvd',
    stock: 'In Stock',
    generic: false
  }
];

export function PriceComparison() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || 'Medicine';
  const [sortBy, setSortBy] = useState<'price' | 'distance'>('price');
  const location = useLocation();
  const isUser = location.pathname.startsWith('/user');
  const searchPath = isUser ? '/user/search' : '/search';

  const sortedData = [...COMPARISON_DATA].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    return a.distance - b.distance;
  });

  const lowestPriceId = [...COMPARISON_DATA].sort((a, b) => a.price - b.price)[0].id;
  const closestId = [...COMPARISON_DATA].sort((a, b) => a.distance - b.distance)[0].id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link
          to={`${searchPath}?q=${query}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 text-lg font-medium mb-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Results
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Price Comparison: {query}</h1>
            <p className="text-lg text-gray-600 mt-2">
              Comparing prices from {sortedData.length} pharmacies.
            </p>
          </div>

          <div className="flex items-center bg-white border rounded-lg p-1 shadow-sm">
            <span className="px-3 text-sm font-medium text-gray-500 flex items-center">
              <SlidersHorizontal className="h-4 w-4 mr-2" /> Sort by:
            </span>
            <button
              onClick={() => setSortBy('price')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${sortBy === 'price' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              Price
            </button>
            <button
              onClick={() => setSortBy('distance')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${sortBy === 'distance' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              Distance
            </button>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-lg font-bold text-gray-900 uppercase tracking-wider">Pharmacy</th>
                <th scope="col" className="px-6 py-4 text-left text-lg font-bold text-gray-900 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-4 text-left text-lg font-bold text-gray-900 uppercase tracking-wider">Stock</th>
                <th scope="col" className="px-6 py-4 text-left text-lg font-bold text-gray-900 uppercase tracking-wider">Distance</th>
                <th scope="col" className="px-6 py-4 text-left text-lg font-bold text-gray-900 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((item) => {
                const isLowest = item.id === lowestPriceId;
                const isClosest = item.id === closestId;

                return (
                  <tr key={item.id} className={isLowest ? 'bg-green-50' : ''}>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-xl font-medium text-gray-900">{item.name}</span>
                        <div className="flex gap-2 mt-1">
                          {isLowest && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-800">
                              <Check className="h-3 w-3 mr-1" /> Best Price
                            </span>
                          )}
                          {isClosest && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800">
                              <Navigation className="h-3 w-3 mr-1" /> Closest
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <span className={`text-2xl font-bold ${isLowest ? 'text-green-700' : 'text-gray-900'}`}>
                        LKR {item.price.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <Badge variant={
                        item.stock === 'In Stock' ? 'success' :
                          item.stock === 'Low Stock' ? 'warning' : 'error'
                      }>
                        {item.stock}
                      </Badge>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-lg text-gray-600">
                      {item.distance} km
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <Button
                        size="default"
                        variant={isLowest ? 'primary' : 'outline'}
                        disabled={item.stock === 'Out of Stock'}
                      >
                        {item.stock === 'Out of Stock' ? 'Unavailable' : 'Select'}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}