import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Bell, Lock, User, Save } from 'lucide-react';

export function PharmacySettings() {
    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Navigation Sidebar (Mock) */}
                <div className="lg:col-span-1 space-y-4">
                    <Card className="p-4">
                        <nav className="space-y-1">
                            <Button variant="ghost" className="w-full justify-start" leftIcon={<User className="h-5 w-5" />}>
                                Account
                            </Button>
                            <Button variant="ghost" className="w-full justify-start" leftIcon={<Bell className="h-5 w-5" />}>
                                Notifications
                            </Button>
                            <Button variant="ghost" className="w-full justify-start" leftIcon={<Lock className="h-5 w-5" />}>
                                Security
                            </Button>
                        </nav>
                    </Card>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Account Information">
                        <form className="space-y-4">
                            <Input label="Pharmacy Name" defaultValue="HealthPlus Pharmacy" />
                            <Input label="Email Address" defaultValue="contact@healthplus.com" type="email" />
                            <Input label="Phone Number" defaultValue="(02) 8123-4567" />
                            <Input label="Address" defaultValue="123 Main St, Downtown" />

                            <div className="flex justify-end pt-4">
                                <Button leftIcon={<Save className="h-4 w-4" />}>
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </Card>

                    <Card title="Notification Preferences">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                <div>
                                    <p className="font-medium text-gray-900">Low Stock Alerts</p>
                                    <p className="text-sm text-gray-500">Get notified when stock drops below threshold</p>
                                </div>
                                <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                <div>
                                    <p className="font-medium text-gray-900">Order Updates</p>
                                    <p className="text-sm text-gray-500">Receive updates about new orders</p>
                                </div>
                                <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
