import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Search, Edit, Trash2, Plus, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getPharmacyInventory, addMedicineToInventory, updateInventoryItem, InventoryItem } from '../../services/api';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export function StockList({ defaultFilter = 'all' }: { defaultFilter?: 'all' | 'low' | 'out' }) {
  const { user } = useAuth();
  const [stockItems, setStockItems] = useState<InventoryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>(defaultFilter);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: ''
  });

  useEffect(() => {
    if (user) {
      loadInventory();
    }
  }, [user]);

  const loadInventory = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const items = await getPharmacyInventory(user.uid);
      setStockItems(items);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item?: InventoryItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.medicineName,
        category: item.category || '',
        price: item.price.toString(),
        stock: item.stock.toString(),
        description: item.description || ''
      });
    } else {
      setEditingItem(null);
      setFormData({ name: '', category: '', price: '', stock: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const price = parseFloat(formData.price);
    const stock = parseInt(formData.stock);

    if (!formData.name.trim()) {
      alert("Medicine name is required");
      return;
    }
    if (isNaN(price) || price < 0) {
      alert("Please enter a valid price");
      return;
    }
    if (isNaN(stock) || stock < 0) {
      alert("Please enter a valid stock quantity");
      return;
    }

    const lowStockThreshold = 50; // Default
    const available = stock > 0;

    try {
      if (editingItem && editingItem.id) {
        await updateInventoryItem(editingItem.id, {
          medicineName: formData.name,
          price,
          stock,
          available,
          lowStockThreshold,
          category: formData.category,
          description: formData.description
        });

        // Update local state directly
        setStockItems(prev => prev.map(item =>
          item.id === editingItem.id
            ? {
              ...item,
              medicineName: formData.name,
              price,
              stock,
              available,
              lowStockThreshold,
              category: formData.category,
              description: formData.description
            }
            : item
        ));
      } else {
        const newId = await addMedicineToInventory(user.uid, {
          medicineId: 'manual-' + Date.now(), // Placeholder
          medicineName: formData.name,
          price,
          stock,
          available,
          lowStockThreshold,
          category: formData.category,
          description: formData.description
        });

        // Add to local state
        const newItem: InventoryItem = {
          id: newId,
          pharmacyId: user.uid,
          medicineId: 'manual-' + Date.now(),
          medicineName: formData.name,
          price,
          stock,
          available,
          lowStockThreshold,
          lastUpdated: Date.now(),
          category: formData.category,
          description: formData.description
        };
        setStockItems(prev => [...prev, newItem]);
      }
      handleCloseModal();
    } catch (e) {
      console.error(e);
      alert("Failed to save item. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteDoc(doc(db, "inventory", id));
        setStockItems(prev => prev.filter(item => item.id !== id));
      } catch (e) {
        console.error(e);
        alert("Failed to delete item");
      }
    }
  };

  const filteredItems = stockItems.filter(item => {
    // Basic status calculation since DB might not have accurate 'available' flag if logic is complex
    const status = item.stock === 0 ? 'Out of Stock' : (item.stock < (item.lowStockThreshold || 50) ? 'Low Stock' : 'In Stock');

    if (filter === 'all') return true;
    if (filter === 'low') return status === 'Low Stock';
    if (filter === 'out') return status === 'Out of Stock';
    return true;
  });

  return (
    <div className="p-8 space-y-8 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {defaultFilter === 'low' ? 'Low Stock Alerts' : 'Stock Inventory'}
        </h1>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-5 w-5" />
          Add New Item
        </Button>
      </div>

      <Card>
        <div className="p-6 border-b border-gray-200">
          {/* Search and Filters UI (kept same) */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search inventory..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              <select
                className="border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
              >
                <option value="all">All Items</option>
                <option value="low">Low Stock Only</option>
                <option value="out">Out of Stock Only</option>
              </select>
            </div>
            <Button variant="outline">Export</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-lg font-semibold text-gray-900">Medicine Name</th>
                <th className="px-6 py-4 text-lg font-semibold text-gray-900">Category</th>
                <th className="px-6 py-4 text-lg font-semibold text-gray-900">Price</th>
                <th className="px-6 py-4 text-lg font-semibold text-gray-900">Stock</th>
                <th className="px-6 py-4 text-lg font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-lg font-semibold text-gray-900 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.map((item) => {
                const status = item.stock === 0 ? 'Out of Stock' : (item.stock < (item.lowStockThreshold || 50) ? 'Low Stock' : 'In Stock');
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-lg font-medium text-gray-900">
                      <div>
                        <div>{item.medicineName}</div>
                        {item.description && <div className="text-sm text-gray-500 font-normal">{item.description}</div>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-lg text-gray-700">{item.category || '-'}</td>
                    <td className="px-6 py-4 text-lg text-gray-900">LKR {item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-lg text-gray-900">{item.stock}</td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        status === 'In Stock' ? 'success' :
                          status === 'Low Stock' ? 'warning' : 'error'
                      }>
                        {status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        aria-label="Edit"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => { if (item.id) handleDelete(item.id) }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                )
              })}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 text-lg">
                    {loading ? "Loading..." : "No items found. Add some stock to get started."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg p-6 relative bg-white">
            <button
              onClick={handleCloseModal}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold mb-6">
              {editingItem ? 'Edit Stock Item' : 'Add New Item'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Medicine Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <Input
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. Pain Killers, Antibiotics"
              />

              <div className="space-y-1">
                <label className="block text-lg font-medium text-gray-900">Description</label>
                <textarea
                  className="w-full rounded-lg border-2 border-gray-300 p-3 min-h-[100px] text-lg focus:border-blue-500 focus:ring-blue-500"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Medicine details, dosage info, etc."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Price (LKR)"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
                <Input
                  label="Stock Quantity"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button type="button" variant="outline" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingItem ? 'Update Item' : 'Add Item'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}