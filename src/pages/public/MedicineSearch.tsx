import { useNavigate, useLocation } from 'react-router-dom';
import { SearchBar } from '../../components/ui/SearchBar';
import { Card } from '../../components/ui/Card';
import { Pill, Search, Map } from 'lucide-react';
export function MedicineSearch() {
  const location = useLocation();
  const navigate = useNavigate();
  const handleSearch = (query: string) => {
    if (query.trim()) {
      const isUser = location.pathname.startsWith('/user');
      navigate(`${isUser ? '/user' : ''}/search?q=${encodeURIComponent(query)}`);
    }
  };
  return <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
    <div className="w-full max-w-4xl text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">
          Find Medicine Availability & Prices
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
          Easily check stock, compare prices, and find nearby pharmacies.
        </p>
      </div>

      <div className="max-w-2xl mx-auto w-full py-8">
        <SearchBar onSearch={handleSearch} placeholder="Enter medicine name (e.g., Paracetamol)..." className="shadow-lg" />
        <p className="mt-4 text-lg text-gray-500">
          Popular searches:{' '}
          <button className="text-blue-600 hover:underline font-medium" onClick={() => handleSearch('Paracetamol')}>
            Paracetamol
          </button>
          ,{' '}
          <button className="text-blue-600 hover:underline font-medium" onClick={() => handleSearch('Amoxicillin')}>
            Amoxicillin
          </button>
          ,{' '}
          <button className="text-blue-600 hover:underline font-medium" onClick={() => handleSearch('Vitamin C')}>
            Vitamin C
          </button>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <Card className="text-center p-6 hover:shadow-lg transition-shadow">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 mb-4">
            <Search className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Check Availability
          </h3>
          <p className="text-lg text-gray-600">
            Instantly see which pharmacies have your medicine in stock.
          </p>
        </Card>

        <Card className="text-center p-6 hover:shadow-lg transition-shadow">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
            <Pill className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Compare Prices
          </h3>
          <p className="text-lg text-gray-600">
            Find the best deals and save money on your prescriptions.
          </p>
        </Card>

        <Card className="text-center p-6 hover:shadow-lg transition-shadow">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 mb-4">
            <Map className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Locate Nearby
          </h3>
          <p className="text-lg text-gray-600">
            Get directions to the closest pharmacy with stock.
          </p>
        </Card>
      </div>
    </div>
  </div>;
}