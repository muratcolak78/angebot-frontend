import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    LayoutDashboard,
    Settings,
    CreditCard,
    FileText,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { useState } from 'react';
import Button from '../Common/Button';

export default function Sidebar() {
    const { logout, hasSettings, hasRateCard } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const canCreateOffer = hasSettings && hasRateCard;

    const menuItems = [
        {
            path: '/',
            name: 'Dashboard',
            icon: <LayoutDashboard className="h-5 w-5" />
        },
        {
            path: '/settings',
            name: 'Einstellungen',
            icon: <Settings className="h-5 w-5" />,
            badge: !hasSettings && 'Erforderlich'
        },
        {
            path: '/ratecard',
            name: 'Preiskarte',
            icon: <CreditCard className="h-5 w-5" />,
            badge: !hasRateCard && 'Erforderlich'
        },
        {
            path: '/offers/new',
            name: 'Angebot erstellen',
            icon: <FileText className="h-5 w-5" />,
            disabled: !canCreateOffer,
            tooltip: !canCreateOffer && 'Füllen Sie zunächst die Einstellungen und die Preiskarte aus'
        }
    ];

    const SidebarContent = () => (
        <>
            <div className="flex items-center justify-between mb-8 px-4">
                <h1 className="text-2xl font-bold text-white">Angebot</h1>
                <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="lg:hidden text-white/60 hover:text-white"
                >
                    <X className="h-6 w-6" />
                </button>
            </div>

            <nav className="space-y-1">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.disabled ? '#' : item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) => `
              flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors
              ${item.disabled
                                ? 'text-gray-400 cursor-not-allowed opacity-50'
                                : isActive
                                    ? 'bg-primary-700 text-white'
                                    : 'text-primary-100 hover:bg-primary-700 hover:text-white'
                            }
            `}
                        title={item.tooltip}
                    >
                        <div className="flex items-center">
                            {item.icon}
                            <span className="ml-3">{item.name}</span>
                        </div>
                        {item.badge && (
                            <span className="bg-yellow-500 text-xs px-2 py-1 rounded-full text-white">
                                {item.badge}
                            </span>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4">
                <Button
                    variant="secondary"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center text-primary-100 hover:text-white hover:bg-primary-700"
                >
                    <LogOut className="h-5 w-5 mr-2" />
                    Abmelden
                </Button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobil Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden fixed top-3 left-4 z-20 p-2 bg-primary-600 text-white rounded-lg"
            >
                <Menu className="h-6 w-6" />
            </button>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-64 bg-primary-800 shadow-xl z-30">
                <div className="relative h-full p-4">
                    <SidebarContent />
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <aside className="absolute left-0 top-0 bottom-0 w-64 bg-primary-800 shadow-xl">
                        <div className="relative h-full p-4">
                            <SidebarContent />
                        </div>
                    </aside>
                </div>
            )}
        </>
    );
}