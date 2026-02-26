import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Save, Euro, Calculator } from 'lucide-react';
import Button from '../Common/Button';
import Input from '../Common/Input';
import LoadingSpinner from '../Common/LoadingSpinner';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function RateCardForm() {
    const { updateSetupStatus } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        wallM2Price: 15.0,
        wallpaperM2Price: 25.0,
        ceilingM2Price: 20.0,
        windowDeductionM2: 5.0,
        doorDeductionM2: 8.0
    });

    useEffect(() => {
        fetchRateCard();
    }, []);

    const fetchRateCard = async () => {
        try {
            const response = await api.get('/ratecard/me');
            setFormData(response.data);
        } catch (error) {
            console.error('RateCard fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Önce var mı kontrol et
            try {
                await api.get('/ratecard/me');
                // Var => UPDATE
                await api.put('/ratecard/me', formData);
            } catch (error) {
                if (error.response?.status === 404) {
                    // Yok => CREATE
                    await api.post('/ratecard/me', formData);
                } else {
                    throw error;
                }
            }

            updateSetupStatus('ratecard', true);
            toast.success('Die Preiskarte wurde erfolgreich registriert!');
            navigate('/');
        } catch (error) {
            toast.error('Fehler beim Speichern der Preiskarte!');
            console.error('RateCard save error:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Preiskarte</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* KOsten*/}
                    <div className="border-b border-gray-200 pb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                            <Euro className="h-5 w-5 mr-2 text-primary-600" />
                            m² Preise
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Wandmalerei (€/m²)"
                                type="number"
                                step="0.01"
                                min="0"
                                name="wallM2Price"
                                value={formData.wallM2Price}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                label="Tapete (€/m²)"
                                type="number"
                                step="0.01"
                                min="0"
                                name="wallpaperM2Price"
                                value={formData.wallpaperM2Price}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                label="Arbeiten an der Decke (€/m²)"
                                type="number"
                                step="0.01"
                                min="0"
                                name="ceilingM2Price"
                                value={formData.ceilingM2Price}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Kesintiler */}
                    <div className="border-b border-gray-200 pb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                            <Calculator className="h-5 w-5 mr-2 text-primary-600" />
                            Abzugswerte
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Fenster (€/m²)"
                                type="number"
                                step="0.01"
                                min="0"
                                name="windowDeductionM2"
                                value={formData.windowDeductionM2}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                label="Tür (€/stück)"
                                type="number"
                                step="0.01"
                                min="0"
                                name="doorDeductionM2"
                                value={formData.doorDeductionM2}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Örnek Hesaplama */}
                    <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-blue-800 mb-2">Berechnungsbeispiel</h4>
                        <p className="text-sm text-blue-600">
                            100m² Wandmalerei: €{(100 * formData.wallM2Price).toFixed(2)}<br />
                            2 Tür: €{(2 * formData.doorDeductionM2).toFixed(2)}
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/')}
                        >
                            Abbrechen
                        </Button>
                        <Button
                            type="submit"
                            loading={saving}
                        >
                            <Save className="h-4 w-4 mr-2" />
                            Speichern
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}