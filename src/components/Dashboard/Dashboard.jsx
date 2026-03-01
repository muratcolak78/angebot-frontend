// components/Dashboard/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Settings, CreditCard, FileText, CheckCircle, AlertCircle,
    Eye, Download, Mail, Calendar, User, Euro, Trash2,
    Building2, Phone, MapPin, Clock, Users, PlusCircle
} from 'lucide-react';
import Button from '../Common/Button';
import LoadingSpinner from '../Common/LoadingSpinner';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Dashboard() {
    //const { hasSettings, hasRateCard, user } = useAuth();
    const { user } = useAuth();
    const [hasSettings, setHasSettings] = useState(false);
    const [hasRateCard, setHasRateCard] = useState(false);
    const navigate = useNavigate();
    const [offers, setOffers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Tüm verileri paralel olarak al
            const [offersRes, customersRes, settingsRes, rateCardRes] = await Promise.allSettled([
                api.get('/offers/me'),
                api.get('/customers/me'),
                api.get('/settings/me'),
                api.get('/ratecard/me')
            ]);

            // Offers - başarılıysa set et
            if (offersRes.status === 'fulfilled') {
                setOffers(offersRes.value.data);
            } else {
                console.error('Offers yüklenemedi:', offersRes.reason);
            }

            // Customers - başarılıysa set et
            if (customersRes.status === 'fulfilled') {
                setCustomers(customersRes.value.data);
            } else {
                console.error('Customers yüklenemedi:', customersRes.reason);
            }

            // Settings - 404 değilse ve data varsa true yap
            if (settingsRes.status === 'fulfilled' && settingsRes.value.data) {
                // Settings'in boş olup olmadığını kontrol et
                const settingsData = settingsRes.value.data;
                const hasSettingsData = settingsData.companyName ||
                    settingsData.firstName ||
                    settingsData.street;
                setHasSettings(hasSettingsData);
            } else {
                setHasSettings(false);
            }

            // RateCard - 404 değilse ve data varsa true yap
            if (rateCardRes.status === 'fulfilled' && rateCardRes.value.data) {
                setHasRateCard(true);
            } else {
                setHasRateCard(false);
            }

        } catch (error) {
            console.error('Fehler beim Abrufen von Dashboard-Daten:', error);
            toast.error('Fehler beim Laden von Daten!');
        } finally {
            setLoading(false);
        }
    };

    // Dashboard.jsx - handleDownloadPDF fonksiyonu
    const handleDownloadPDF = async (offerId) => {
        try {
            console.log('PDF indirme başladı, Offer ID:', offerId);

            // Token'ı kontrol et
            const token = localStorage.getItem('token');
            console.log('Token mevcut mu?', token ? 'Evet' : 'Hayır');

            if (!token) {
                toast.error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.');
                navigate('/login');
                return;
            }

            const response = await api.get(`/pdf/${offerId}`, {
                responseType: 'blob',
                headers: {
                    'Authorization': `Bearer ${token}` // Explicit token gönder
                }
            });

            console.log('PDF response:', response);

            // Response'u kontrol et
            if (!response.data || response.data.size === 0) {
                throw new Error('PDF boş');
            }

            // PDF'i indir
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `angebot-${offerId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            // URL'i temizle
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 100);

            toast.success('Herunterladen von PDF...');
        } catch (error) {
            console.error('PDF-Download-Fehler:', error);

            if (error.response?.status === 403) {
                toast.error('Sie sind nicht berechtigt, dieses PDF herunterzuladen!');
            } else if (error.response?.status === 401) {
                toast.error('Die Sitzung ist beendet. Bitte melden Sie sich erneut an.');
                navigate('/login');
            } else {
                toast.error('PDF-Erstellung fehlgeschlagen!');
            }
        }
    };

    // Preview fonksiyonu
    const handlePreview = (offerId) => {
        navigate(`/offers/${offerId}/preview`);
    };

    const handleDeleteOffer = async (offerId) => {
        if (!window.confirm('Sind Sie sicher, dass Sie dieses Angebot löschen möchten?')) {
            return;
        }

        try {
            await api.delete(`/offers/${offerId}`);
            toast.success('Angebot gelöscht!');
            setOffers(prev => prev.filter(o => o.id !== offerId));
        } catch (error) {
            console.error('Offer delete error:', error);
            toast.error('Fehler beim Löschen des Angebots!');
        }
    };

    const handleSendOfferMail = async (offerId) => {
        //const to = window.prompt("An wen soll ich sie schicken? (E-Mail)");
        //if (!to) return;

        try {
            await api.post("/mail/offer", {
                offerId
            });
            toast.success("E-Mail gesendet!");
        } catch (err) {
            console.error(err);
            toast.error("E-Mail kann nicht gesendet werden!");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatEuro = (amount) => {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    // Kullanıcının durumunu kontrol et
    const hasCustomers = customers.length > 0;
    const hasOffers = offers.length > 0;
    const allSetupCompleted = hasSettings && hasRateCard && hasCustomers;

    // Adım listesi
    const setupSteps = [
        {
            id: 'settings',
            title: '1. Unternehmenseinstellungen',
            description: 'Firmeninformationen, Logo und Unterschrift hinzufügen',
            completed: hasSettings,
            icon: Settings,
            path: '/settings',
            actionText: 'Jetzt einrichten'
        },
        {
            id: 'ratecard',
            title: '2. Preiskarte',
            description: 'm²-Preise und Abzüge für Berechnungen festlegen',
            completed: hasRateCard,
            icon: CreditCard,
            path: '/ratecard',
            actionText: 'Jetzt einrichten'
        },
        {
            id: 'customers',
            title: '3. Kunden anlegen',
            description: 'Mindestens einen Kunden hinzufügen, um Angebote zu erstellen',
            completed: hasCustomers,
            icon: Users,
            path: '/customers/new',
            actionText: 'Kunde anlegen'
        }
    ];

    // İlerleme durumu
    const completedCount = setupSteps.filter(step => step.completed).length;
    const totalSteps = setupSteps.length;
    const progressPercentage = (completedCount / totalSteps) * 100;

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <div className="space-y-8">
            {/* Hoş Geldin Mesajı - Her zaman göster */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Herzlich willkommen{user?.email ? `, ${user.email}` : ''}!
                </h1>
                <p className="text-gray-600">
                    {!allSetupCompleted
                        ? 'Führen Sie die folgenden Schritte aus, um ein Angebot zu erstellen.'
                        : 'Alle Einstellungen sind abgeschlossen. Sie können jetzt Angebote erstellen!'}
                </p>

                {/* İlerleme Çubuğu - Sadece tamamlanmamışsa göster */}
                {!allSetupCompleted && (
                    <div className="mt-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Fortschritt</span>
                            <span>{completedCount}/{totalSteps} Schritte abgeschlossen</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Adım Adım Kurulum Kartları - Sadece tamamlanmamış adımlar gösterilir */}
            {!allSetupCompleted && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        📋 Erforderliche Schritte für Angebotserstellung
                    </h2>

                    <div className="grid gap-4">
                        {setupSteps.map((step, index) => (
                            <div
                                key={step.id}
                                className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${step.completed
                                    ? 'border-green-500 bg-green-50/50'
                                    : 'border-yellow-500'
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center mb-2">
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium mr-3 ${step.completed
                                                ? 'bg-green-500 text-white'
                                                : 'bg-yellow-500 text-white'
                                                }`}>
                                                {step.completed ? '✓' : index + 1}
                                            </span>
                                            <h3 className="text-lg font-medium text-gray-900">
                                                {step.title}
                                            </h3>
                                            {step.completed && (
                                                <span className="ml-3 text-sm text-green-600 font-medium">
                                                    Abgeschlossen
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-gray-600 ml-9">
                                            {step.description}
                                        </p>

                                        {!step.completed && (
                                            <div className="mt-4 ml-9">
                                                <Button
                                                    onClick={() => navigate(step.path)}
                                                    size="sm"
                                                    className="!bg-primary-600 !text-white hover:!bg-primary-700"
                                                >
                                                    {step.actionText}
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    {step.completed && (
                                        <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                                    )}
                                </div>

                                {/* Bağlantı çizgisi - son adım değilse ve tamamlanmamışsa */}
                                {index < setupSteps.length - 1 && !step.completed && (
                                    <div className="ml-6 mt-2 mb-2">
                                        <div className="border-l-2 border-dashed border-gray-300 h-8 ml-3"></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Özet Bilgi */}
                    <div className="bg-blue-50 rounded-lg p-6 mt-4">
                        <h4 className="font-medium text-blue-800 mb-2">
                            ℹ️ Warum diese Schritte?
                        </h4>
                        <ul className="text-sm text-blue-700 space-y-2">
                            <li>• <strong>Unternehmenseinstellungen:</strong> Ihre Firma erscheint auf dem Angebot</li>
                            <li>• <strong>Preiskarte:</strong> Preise werden automatisch berechnet</li>
                            <li>• <strong>Kunden:</strong> Angebote werden für Kunden erstellt</li>
                        </ul>
                    </div>
                </div>
            )}

            {/* Angebot erstellen Butonu - Sadece tüm adımlar tamamlandıysa */}
            {allSetupCompleted && (
                <Button
                    onClick={() => navigate('/offers/new')}
                    className="mt-4 md:mt-0 !bg-white !text-primary-600 hover:!bg-gray-100 shadow-lg"
                    size="lg"
                >
                    <FileText className="h-5 w-5 mr-2" />
                    Angebot erstellen
                </Button>
            )}



            {/* Letzte Angebote - Sadece varsa göster */}
            {hasOffers && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">
                        Letzte Angebote
                    </h3>

                    <div className="space-y-3">
                        {offers.slice(0, 5).map((offer) => (
                            <div
                                key={offer.id}
                                className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                            >
                                {/* Masaüstü Görünüm */}
                                <div className="hidden md:flex items-center p-4">
                                    {/* AD SOYAD */}
                                    <div className="w-1/4">
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {offer.customerFirstName} {offer.customerLastName}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                #{offer.id}
                                            </p>
                                        </div>
                                    </div>

                                    {/* TARİH */}
                                    <div className="w-1/4 text-sm text-gray-600">
                                        {formatDate(offer.createdAt)}
                                    </div>

                                    {/* FİYAT */}
                                    <div className="w-1/6 font-semibold text-primary-600">
                                        {formatEuro(offer.grandTotal)}
                                    </div>

                                    {/* İKONLAR */}
                                    <div className="w-1/3 flex items-center justify-end space-x-1">
                                        <button
                                            onClick={() => handlePreview(offer.id)}
                                            className="p-2 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-gray-100"
                                            title="Vorschau"
                                        >
                                            <Eye className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDownloadPDF(offer.id)}
                                            className="p-2 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-gray-100"
                                            title="PDF herunterladen"
                                        >
                                            <Download className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleSendOfferMail(offer.id)}
                                            className="p-2 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-gray-100"
                                            title="Per E-Mail senden"
                                        >
                                            <Mail className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteOffer(offer.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                                            title="Löschen"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Mobil Görünüm */}
                                <div className="md:hidden p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {offer.customerFirstName} {offer.customerLastName}
                                            </p>
                                            <p className="text-xs text-gray-500">#{offer.id}</p>
                                        </div>
                                        <span className="font-semibold text-primary-600">
                                            {formatEuro(offer.grandTotal)}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600 mb-3">
                                        {formatDate(offer.createdAt)}
                                    </div>
                                    <div className="flex items-center justify-end space-x-2 border-t border-gray-100 pt-3">
                                        <button
                                            onClick={() => handlePreview(offer.id)}
                                            className="p-2 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-gray-100"
                                        >
                                            <Eye className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDownloadPDF(offer.id)}
                                            className="p-2 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-gray-100"
                                        >
                                            <Download className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleSendOfferMail(offer.id)}
                                            className="p-2 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-gray-100"
                                        >
                                            <Mail className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteOffer(offer.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tüm teklifleri göster linki - 5'ten fazla varsa */}
                    {offers.length > 5 && (
                        <div className="mt-4 text-center">
                            <Button
                                variant="outline"
                                onClick={() => navigate('/offers')}
                            >
                                Alle {offers.length} Angebote anzeigen
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* HİÇBİR ŞEY YOKSA - İlk adım için yönlendirme */}
            {!hasSettings && !hasRateCard && !hasCustomers && !hasOffers && (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <Building2 className="h-16 w-16 mx-auto text-primary-600 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Willkommen bei Angebot!
                    </h2>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Beginnen Sie mit der Einrichtung Ihres Unternehmens, um Angebote zu erstellen.
                    </p>
                    <Button
                        onClick={() => navigate('/settings')}
                        size="lg"
                    >
                        Jetzt starten
                    </Button>
                </div>
            )}



        </div>
    );
}