import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Package, AlertTriangle, TrendingUp, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PharmacyUser } from '../../types/auth';

export function PharmacyDashboard() {
  const { userData } = useAuth();
  const pharmacyUser = userData as PharmacyUser;
  const pharmacyName = pharmacyUser?.pharmacyName || 'Pharmacy';
  const isVerified = pharmacyUser?.status === 'verified';
  const isPending = pharmacyUser?.status === 'pending';

  const navigate = useNavigate();
  return <div className="p-8 space-y-8">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-lg text-gray-600 mt-1">
          Welcome back, {pharmacyName}
        </p>
        {!isVerified && (
          <div className={`mt-4 p-4 rounded-lg border ${isPending ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            <p className="font-medium">
              {isPending
                ? "Your account is currently under review. Some features are restricted until verification is complete."
                : "Your account verification was rejected. Please contact support."}
            </p>
          </div>
        )}
      </div>
      {isVerified && (
        <Button leftIcon={<Plus className="h-5 w-5" />} onClick={() => navigate('/pharmacy/stock')}>Add Medicine</Button>
      )}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Card className="p-6 border-l-4 border-l-blue-500">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <Package className="h-8 w-8" />
          </div>
          <div className="ml-4">
            <p className="text-lg font-medium text-gray-600">
              Total Medicines
            </p>
            <p className="text-3xl font-bold text-gray-900">1,245</p>
          </div>
        </div>
      </Card>

      <div onClick={() => window.location.href = '/pharmacy/alerts'} className="cursor-pointer transition-transform hover:scale-105">
        <Card className="p-6 border-l-4 border-l-yellow-500 h-full">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-lg font-medium text-gray-600">
                Low Stock Items
              </p>
              <p className="text-3xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 border-l-4 border-l-green-500">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <TrendingUp className="h-8 w-8" />
          </div>
          <div className="ml-4">
            <p className="text-lg font-medium text-gray-600">
              Pending Updates
            </p>
            <p className="text-3xl font-bold text-gray-900">5</p>
          </div>
        </div>
      </Card>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card title="Recent Activity">
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <div>
              <p className="text-lg font-medium text-gray-900">
                Stock Updated: Paracetamol
              </p>
              <p className="text-base text-gray-500">Added 500 units</p>
            </div>
            <span className="text-sm text-gray-400">2 hours ago</span>
          </div>)}
        </div>
      </Card>

      <Card title="Quick Actions">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-auto py-6 flex flex-col items-center justify-center gap-2"
            onClick={() => navigate('/pharmacy/stock')}
            disabled={!isVerified}
          >
            <Package className="h-8 w-8 text-blue-600" />
            <span>Update Stock</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-6 flex flex-col items-center justify-center gap-2"
            onClick={() => navigate('/pharmacy/prices')} // Assuming prices route exists, originally pointed to stock
            disabled={!isVerified}
          >
            <Tag className="h-8 w-8 text-green-600" />
            <span>Update Prices</span>
          </Button>
        </div>
      </Card>
    </div>
  </div>;
}
// Helper component for icon
function Tag(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
    <path d="M7 7h.01" />
  </svg>;
}