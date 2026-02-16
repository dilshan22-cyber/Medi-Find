import React from 'react';
import { MapPin, Clock, Phone, Navigation } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
interface PharmacyCardProps {
  name: string;
  address: string;
  distance: string;
  price?: string;
  stockStatus?: 'In Stock' | 'Low Stock' | 'Out of Stock';
  phone?: string;
  hours?: string;
  onViewDetails?: () => void;
  onCompare?: () => void;
}
export function PharmacyCard({
  name,
  address,
  distance,
  price,
  stockStatus,
  phone,
  hours,
  onViewDetails,
  onCompare
}: PharmacyCardProps) {
  const getStockVariant = (status?: string) => {
    switch (status) {
      case 'In Stock':
        return 'success';
      case 'Low Stock':
        return 'warning';
      case 'Out of Stock':
        return 'error';
      default:
        return 'default';
    }
  };
  return <Card className="h-full flex flex-col">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-2xl font-bold text-gray-900">{name}</h3>
        <div className="flex items-center mt-2 text-gray-600">
          <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
          <span className="text-lg">{address}</span>
        </div>
      </div>
      {stockStatus && <Badge variant={getStockVariant(stockStatus)} className="text-lg px-4 py-2">
        {stockStatus}
      </Badge>}
    </div>

    <div className="space-y-3 mb-6 flex-grow">
      <div className="flex items-center justify-between">
        <div className="flex items-center text-gray-600">
          <Navigation className="h-5 w-5 mr-2" />
          <span className="text-lg font-medium">{distance} away</span>
        </div>
        {price && <div className="text-2xl font-bold text-blue-600">{price}</div>}
      </div>

      {hours && <div className="flex items-center text-gray-600">
        <Clock className="h-5 w-5 mr-2" />
        <span className="text-lg">{hours}</span>
      </div>}

      {phone && <div className="flex items-center text-gray-600">
        <Phone className="h-5 w-5 mr-2" />
        <span className="text-lg">{phone}</span>
      </div>}
    </div>

    <div className="mt-auto pt-4 border-t border-gray-100 flex gap-3">
      {onCompare && (
        <Button variant="outline" className="flex-1" onClick={onCompare}>
          Compare
        </Button>
      )}
      <Button variant="primary" className="flex-1" onClick={onViewDetails} aria-label={`View details for ${name}`}>
        View Details
      </Button>
    </div>
  </Card>;
}