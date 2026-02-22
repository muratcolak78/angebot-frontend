import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, FileText, Download, X, Mail } from 'lucide-react';
import Button from '../Common/Button';
import Input from '../Common/Input';
import LoadingSpinner from '../Common/LoadingSpinner';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function OfferForm() {
    const { id } = useParams();
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
        if (id) {
            fetchOffer();
        }
    }, [id]);

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
            toast.error('Teklif yüklenirken hata oluştu!');
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
                toast.success('Teklif güncellendi!');
            } else {
                await api.post('/offers', formData);
                toast.success('Teklif oluşturuldu!');
            }
            navigate('/');
        } catch (error) {
            toast.error('Teklif kaydedilirken hata oluştu!');
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

            toast.success('PDF indiriliyor...');
        } catch (error) {
            toast.error('PDF oluşturulamadı!');
        }
    };

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {id ? 'Teklif Düzenle' : 'Yeni Teklif Oluştur'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Müşteri Seçimi */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Müşteri Seçin
                        </label>
                        <select
                            value={formData.customerId}
                            onChange={handleCustomerChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            required
                        >
                            <option value="">Müşteri seçin...</option>
                            {customers.map(customer => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.firstName} {customer.lastName} - {customer.email}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Ölçüler */}
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Ölçüler</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Duvar (m²)"
                                type="number"
                                step="0.01"
                                min="0"
                                name="wallM2"
                                value={formData.wallM2}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                label="Duvar Kağıdı (m²)"
                                type="number"
                                step="0.01"
                                min="0"
                                name="wallpaperM2"
                                value={formData.wallpaperM2}
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Tavan (m²)"
                                type="number"
                                step="0.01"
                                min="0"
                                name="ceilingM2"
                                value={formData.ceilingM2}
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Pencere (m²)"
                                type="number"
                                step="0.01"
                                min="0"
                                name="windowsM2"
                                value={formData.windowsM2}
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Kapı (adet)"
                                type="number"
                                min="0"
                                name="doors"
                                value={formData.doors}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Hesaplanan Tutarlar */}
                    {rateCard && (
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Hesaplanan Tutarlar</h3>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Duvar Boyama:</span>
                                    <span className="font-medium">€ {calculated.wallTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Duvar Kağıdı:</span>
                                    <span className="font-medium">€ {calculated.wallpaperTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Tavan:</span>
                                    <span className="font-medium">€ {calculated.ceilingTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-red-600">
                                    <span>Pencere Kesintisi:</span>
                                    <span>-€ {calculated.windowDeduction.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-red-600">
                                    <span>Kapı Kesintisi:</span>
                                    <span>-€ {calculated.doorDeduction.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-2 mt-2">
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Toplam:</span>
                                        <span className="text-primary-600">€ {calculated.grandTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                                        <span>+19% USt.:</span>
                                        <span>€ {(calculated.grandTotal * 0.19).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-primary-700">
                                        <span>Brüt Toplam:</span>
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
                                    PDF İndir
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                >
                                    <Mail className="h-4 w-4 mr-2" />
                                    E-Posta Gönder
                                </Button>
                            </>
                        )}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/')}
                        >
                            <X className="h-4 w-4 mr-2" />
                            İptal
                        </Button>
                        <Button
                            type="submit"
                            loading={saving}
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {id ? 'Güncelle' : 'Teklif Oluştur'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}