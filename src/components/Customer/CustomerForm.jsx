// components/Customer/CustomerForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, User, Mail, Phone, MapPin, Building2 } from 'lucide-react';
import Button from '../Common/Button';
import Input from '../Common/Input';
import LoadingSpinner from '../Common/LoadingSpinner';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function CustomerForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        homeStreet: '',
        homeHouseNr: '',
        homePlz: '',
        homeOrt: '',
        workStreet: '',
        workHouseNr: '',
        workPlz: '',
        workOrt: ''
    });

    useEffect(() => {
        if (id) {
            fetchCustomer();
        }
    }, [id]);

    const fetchCustomer = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/customers/${id}`);
            setFormData(response.data);
        } catch (error) {
            console.error('Customer fetch error:', error);
            toast.error('Fehler beim Laden von Kundendaten!');
            navigate('/customers');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (id) {
                await api.put(`/customers/${id}`, formData);
                toast.success('Kunde aktualisiert!');
            } else {
                await api.post('/customers', formData);
                toast.success('Kunde hinzugefügt!');
            }
            navigate('/customers');
        } catch (error) {
            console.error('Customer save error:', error);
            toast.error('Fehler bei der Registrierung eines Kunden!');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {id ? 'Kunde bearbeiten' : 'Neuer Kunde'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Temel Bilgiler */}
                    <div className="border-b border-gray-200 pb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                            <User className="h-5 w-5 mr-2 text-primary-600" />
                            Grundlegende Informationen
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Vorname"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                label="Nachname"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                label="E-posta"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                icon={<Mail className="h-5 w-5 text-gray-400" />}
                                required
                            />
                            <Input
                                label="Telefon"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                icon={<Phone className="h-5 w-5 text-gray-400" />}
                            />
                        </div>
                    </div>

                    {/* Ev Adresi */}
                    <div className="border-b border-gray-200 pb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                            <MapPin className="h-5 w-5 mr-2 text-primary-600" />
                            Adresse
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Straße"
                                name="homeStreet"
                                value={formData.homeStreet}
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Hause Nr"
                                name="homeHouseNr"
                                value={formData.homeHouseNr}
                                onChange={handleInputChange}
                            />
                            <Input
                                label="PLZ"
                                name="homePlz"
                                value={formData.homePlz}
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Ort"
                                name="homeOrt"
                                value={formData.homeOrt}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* İş Adresi (Opsiyonel) */}
                    <div className="border-b border-gray-200 pb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                            <Building2 className="h-5 w-5 mr-2 text-primary-600" />
                            Arbeitsadresse (Ops)
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Straße"
                                name="workStreet"
                                value={formData.workStreet}
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Hause Nr"
                                name="workHouseNr"
                                value={formData.workHouseNr}
                                onChange={handleInputChange}
                            />
                            <Input
                                label="PLZ"
                                name="workPlz"
                                value={formData.workPlz}
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Ort"
                                name="workOrt"
                                value={formData.workOrt}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/customers')}
                        >
                            <X className="h-4 w-4 mr-2" />
                            Abbrechen
                        </Button>
                        <Button
                            type="submit"
                            loading={saving}
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {id ? 'Aktualisieren' : 'Speichern'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}