import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Save, Upload, Building2, Phone, Mail, MapPin, FileText } from 'lucide-react';
import Button from '../Common/Button';
import Input from '../Common/Input';
import LoadingSpinner from '../Common/LoadingSpinner';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function SettingsForm() {
    const { updateSetupStatus } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [logoFile, setLogoFile] = useState(null);
    const [signatureFile, setSignatureFile] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        companyName: '',
        phone: '',
        email: '',
        taxNumber: '',
        street: '',
        houseNr: '',
        plz: '',
        ort: ''
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await api.get('/settings/me');
            setFormData(response.data);
        } catch (error) {
            console.error('Settings fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB
                toast.error('Dosya boyutu 2MB\'dan küçük olmalıdır!');
                return;
            }
            if (type === 'logo') {
                setLogoFile(file);
            } else {
                setSignatureFile(file);
            }
        }
    };

    const uploadFile = async (file, endpoint) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post(`/settings/me/${endpoint}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Einstellungen zuerst aktualisieren
            await api.put('/settings/me', formData);

            // Logo hochladen
            if (logoFile) {
                await uploadFile(logoFile, 'logo');
            }

            // Unterschrift hochladen
            if (signatureFile) {
                await uploadFile(signatureFile, 'signature');
            }

            updateSetupStatus('settings', true);
            toast.success('Einstellungen erfolgreich gespeichert!');
            navigate('/');
        } catch (error) {
            toast.error('Fehler beim Speichern von Einstellungen!');
            console.error('Settings save error:', error);
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
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Şirket Ayarları</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Kişisel Bilgiler */}
                    <div className="border-b border-gray-200 pb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                            <Building2 className="h-5 w-5 mr-2 text-primary-600" />
                            Informationen zum Unternehmen
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
                                label="Lastname"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                label="Name des Unternehmens"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                label="Steuernummer"
                                name="taxNumber"
                                value={formData.taxNumber}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Kontakt Details */}
                    <div className="border-b border-gray-200 pb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                            <Phone className="h-5 w-5 mr-2 text-primary-600" />
                            Kontakt Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Telefon"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                                icon={<Phone className="h-5 w-5 text-gray-400" />}
                            />
                            <Input
                                label="E-mail"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                icon={<Mail className="h-5 w-5 text-gray-400" />}
                            />
                        </div>
                    </div>

                    {/* Adres Bilgileri */}
                    <div className="border-b border-gray-200 pb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                            <MapPin className="h-5 w-5 mr-2 text-primary-600" />
                            Adresse Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Straße"
                                name="street"
                                value={formData.street}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                label="HauseNr"
                                name="houseNr"
                                value={formData.houseNr}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                label="PLZ"
                                name="plz"
                                value={formData.plz}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                label="ORT"
                                name="ort"
                                value={formData.ort}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Datei Uploads */}
                    <div className="border-b border-gray-200 pb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-primary-600" />
                            Datei Uploads
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Logo (PNG/JPG, max 2MB)
                                </label>
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg"
                                        onChange={(e) => handleFileChange(e, 'logo')}
                                        className="hidden"
                                        id="logo-upload"
                                    />
                                    <label
                                        htmlFor="logo-upload"
                                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        <Upload className="h-4 w-4 mr-2" />
                                        Wählen Sie Logo aus
                                    </label>
                                    {logoFile && (
                                        <span className="text-sm text-gray-600">{logoFile.name}</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Unterschrift(PNG/JPG, max 512KB)
                                </label>
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg"
                                        onChange={(e) => handleFileChange(e, 'signature')}
                                        className="hidden"
                                        id="signature-upload"
                                    />
                                    <label
                                        htmlFor="signature-upload"
                                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        <Upload className="h-4 w-4 mr-2" />
                                        Wählen Sie Unterschrift aus
                                    </label>
                                    {signatureFile && (
                                        <span className="text-sm text-gray-600">{signatureFile.name}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/')}
                        >
                            Abbrechnen
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