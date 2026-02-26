import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Save, FileText, Download, X, Mail } from 'lucide-react';
import Button from '../Common/Button';
import Input from '../Common/Input';
import LoadingSpinner from '../Common/LoadingSpinner';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function OfferForm() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [rateCard, setRateCard] = useState(null);
    const [formData, setFormData] = useState({
        customerId: '',
        wallM2: 0,
        wallpaperM2: 0,
        ceilingM2: 0,
        windowsM2: 0,
        doors: 0
    });
    const [calculated, setCalculated] = useState({
        wallTotal: 0,
        wallpaperTotal: 0,
        ceilingTotal: 0,
        windowDeduction: 0,
        doorDeduction: 0,
        grandTotal: 0
    });

    useEffect(() => {
        fetchCustomers();
        fetchRateCard();
        const customerIdFromUrl = searchParams.get('customerId');
        if (customerIdFromUrl) {
            setFormData(prev => ({ ...prev, customerId: customerIdFromUrl }));
        }
        if (id) {
            fetchOffer();
        }
    }, [id], searchParams);

    useEffect(() => {
        calculateTotals();
    }, [formData, rateCard]);

    const fetchCustomers = async () => {
        try {
            const response = await api.get('/customers/me');
            setCustomers(response.data);
        } catch (error) {
            console.error('Customers fetch error:', error);
        }
    };

    const fetchRateCard = async () => {
        try {
            const response = await api.get('/ratecard/me');
            setRateCard(response.data);
        } catch (error) {
            console.error('RateCard fetch error:', error);
        }
    };

    const fetchOffer = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/offers/${id}`);
            setFormData(response.data);
        } catch (error) {
            toast.error('Fehler beim Laden des Angebots!');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const calculateTotals = () => {
        if (!rateCard) return;

        const wallTotal = formData.wallM2 * rateCard.wallM2Price;
        const wallpaperTotal = formData.wallpaperM2 * rateCard.wallpaperM2Price;
        const ceilingTotal = formData.ceilingM2 * rateCard.ceilingM2Price;
        const windowDeduction = formData.windowsM2 * rateCard.windowDeductionM2;
        const doorDeduction = formData.doors * rateCard.doorDeductionM2;

        const grandTotal = wallTotal + wallpaperTotal + ceilingTotal - windowDeduction - doorDeduction;

        setCalculated({
            wallTotal,
            wallpaperTotal,
            ceilingTotal,
            windowDeduction,
            doorDeduction,
            grandTotal
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    const handleCustomerChange = (e) => {
        setFormData(prev => ({ ...prev, customerId: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (id) {
                await api.put(`/offers/${id}`, formData);
                toast.success('Angebot aktualisiert!');
            } else {
                await api.post('/offers', formData);
                toast.success('Vorschlag erstellt!');
            }
            navigate('/');
        } catch (error) {
            toast.error('Fehler beim Speichern des Angebots!');
            console.error('Offer save error:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDownloadPDF = async () => {
        try {
            const response = await api.get(`/pdf/${id}`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `angebot-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast.success('Herunterladen von PDF...');
        } catch (error) {
            toast.error('PDF-Erstellung fehlgeschlagen!');
        }
    };

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {id ? 'Angebot bearbeiten' : 'Neues Angebot erstellen'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Customer Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Kunde auswählen
                        </label>
                        <select
                            value={formData.customerId}
                            onChange={handleCustomerChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            required
                        >
                            <option value="">Wählen Sie Kunde aus..</option>
                            {customers.map(customer => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.firstName} {customer.lastName} - {customer.email}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Dimensions*/}
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Ölçüler</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Wall (m²)"
                                type="number"
                                step="0.01"
                                min="0"
                                name="wallM2"
                                value={formData.wallM2}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                label="Tapete (m²)"
                                type="number"
                                step="0.01"
                                min="0"
                                name="wallpaperM2"
                                value={formData.wallpaperM2}
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Decke (m²)"
                                type="number"
                                step="0.01"
                                min="0"
                                name="ceilingM2"
                                value={formData.ceilingM2}
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Fenster (m²)"
                                type="number"
                                step="0.01"
                                min="0"
                                name="windowsM2"
                                value={formData.windowsM2}
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Tür (Stück)"
                                type="number"
                                min="0"
                                name="doors"
                                value={formData.doors}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Berechnete Beträge */}
                    {rateCard && (
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Berechnete Beträge</h3>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Wandmalerei:</span>
                                    <span className="font-medium">€ {calculated.wallTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Tapete:</span>
                                    <span className="font-medium">€ {calculated.wallpaperTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Decke:</span>
                                    <span className="font-medium">€ {calculated.ceilingTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-red-600">
                                    <span>Fenster :</span>
                                    <span>-€ {calculated.windowDeduction.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-red-600">
                                    <span>Tür :</span>
                                    <span>-€ {calculated.doorDeduction.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-2 mt-2">
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Insgesamt:</span>
                                        <span className="text-primary-600">€ {calculated.grandTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                                        <span>+19% USt.:</span>
                                        <span>€ {(calculated.grandTotal * 0.19).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-primary-700">
                                        <span>Brutto Gesamt:</span>
                                        <span>€ {(calculated.grandTotal * 1.19).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row justify-end gap-3">
                        {id && (
                            <>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleDownloadPDF}
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    PDF herunterladen
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                >
                                    <Mail className="h-4 w-4 mr-2" />
                                    Send per E-mail
                                </Button>
                            </>
                        )}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/')}
                        >
                            <X className="h-4 w-4 mr-2" />
                            Abbrechen
                        </Button>
                        <Button
                            type="submit"
                            loading={saving}
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {id ? 'Update' : 'Angebot erstellen'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}