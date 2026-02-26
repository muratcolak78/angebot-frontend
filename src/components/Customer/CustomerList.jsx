// components/Customer/CustomerList.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, User, Mail, Phone, MapPin } from 'lucide-react';
import Button from '../Common/Button';
import LoadingSpinner from '../Common/LoadingSpinner';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function CustomerList() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await api.get('/customers/me');
            setCustomers(response.data);
        } catch (error) {
            console.error('Customers fetch error:', error);
            toast.error('Fehler beim Laden von Kunden!');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Sind Sie sicher, dass Sie diesen Kunden löschen möchten??')) {
            return;
        }

        try {
            await api.delete(`/customers/${id}`);
            toast.success('Kunde gelöscht!');
            fetchCustomers(); // Listeyi yenile
        } catch (error) {
            console.error('Customer delete error:', error);
            toast.error('Fehler beim Löschen eines Kunden!');
        }
    };

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Kunden</h2>
                    <Button onClick={() => navigate('/customers/new')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Neuer Kunde
                    </Button>
                </div>

                {customers.length === 0 ? (
                    <div className="text-center py-12">
                        <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Noch keine Kunden</h3>
                        <p className="text-gray-500 mb-4">Beginnen Sie mit dem Hinzufügen Ihres ersten Kunden.</p>
                        <Button onClick={() => navigate('/customers/new')}>
                            <Plus className="h-4 w-4 mr-2" />
                            Kunde hinzufügen
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {customers.map((customer) => (
                            <div key={customer.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center">
                                        <div className="bg-primary-100 rounded-full p-2">
                                            <User className="h-5 w-5 text-primary-600" />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="font-medium text-gray-900">
                                                {customer.firstName} {customer.lastName}
                                            </h3>
                                            <p className="text-sm text-gray-500">{customer.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => navigate(`/customers/edit/${customer.id}`)}
                                            className="text-gray-400 hover:text-primary-600"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(customer.id)}
                                            className="text-gray-400 hover:text-red-600"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                        {customer.phone || 'Kein Telefon'}
                                    </div>
                                    <div className="flex items-start">
                                        <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-1" />
                                        <div>
                                            {customer.homeStreet && (
                                                <div>
                                                    {customer.homeStreet} {customer.homeHouseNr}
                                                    <br />
                                                    {customer.homePlz} {customer.homeOrt}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 pt-3 border-t border-gray-100">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                        onClick={() => navigate(`/offers/new?customerId=${customer.id}`)}
                                    >
                                        Angebot Erstellen
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}