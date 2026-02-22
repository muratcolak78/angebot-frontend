import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardLayout() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />

            {/* Mobil için üst bar */}
            <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 fixed top-0 left-0 right-0 z-10">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-primary-600">Angebot</h1>
                    <span className="text-sm text-gray-600">{user?.email}</span>
                </div>
            </div>

            {/* Ana içerik */}
            <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}