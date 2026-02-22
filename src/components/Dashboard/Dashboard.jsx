import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Settings, CreditCard, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../Common/Button';

export default function Dashboard() {
    const { hasSettings, hasRateCard } = useAuth();
    const navigate = useNavigate();

    const setupSteps = [
        {
            id: 'settings',
            title: 'Şirket Ayarları',
            description: 'Firma bilgilerinizi, logonuzu ve imzanızı ekleyin',
            completed: hasSettings,
            icon: Settings,
            path: '/settings'
        },
        {
            id: 'ratecard',
            title: 'Fiyat Kartı',
            description: 'm² fiyatlarını ve kesintileri belirleyin',
            completed: hasRateCard,
            icon: CreditCard,
            path: '/ratecard'
        }
    ];

    const allCompleted = hasSettings && hasRateCard;

    return (
        <div className="space-y-8">
            {/* Hoş Geldin Mesajı */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Hoş Geldiniz! 👋
                </h1>
                <p className="text-gray-600">
                    Teklif oluşturmaya başlamak için aşağıdaki adımları tamamlayın.
                </p>
            </div>

            {/* Setup Steps */}
            <div className="grid gap-6 md:grid-cols-2">
                {setupSteps.map((step) => {
                    const Icon = step.icon;
                    return (
                        <div
                            key={step.id}
                            className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${step.completed ? 'border-green-500' : 'border-yellow-500'
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center">
                                    <Icon className={`h-6 w-6 ${step.completed ? 'text-green-500' : 'text-yellow-500'
                                        }`} />
                                    <h3 className="ml-3 text-lg font-medium text-gray-900">
                                        {step.title}
                                    </h3>
                                </div>
                                {step.completed ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : (
                                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                                )}
                            </div>

                            <p className="mt-2 text-gray-600">{step.description}</p>

                            {!step.completed && (
                                <Button
                                    onClick={() => navigate(step.path)}
                                    className="mt-4"
                                    size="sm"
                                >
                                    Tamamla
                                </Button>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Teklif Oluştur Butonu */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-lg p-8 text-white">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Hazır mısınız?</h2>
                        <p className="text-primary-100">
                            {allCompleted
                                ? 'Artık teklif oluşturmaya başlayabilirsiniz!'
                                : 'Lütfen önce tüm adımları tamamlayın.'}
                        </p>
                    </div>

                    <Button
                        onClick={() => navigate('/offers/new')}
                        disabled={!allCompleted}
                        className="mt-4 md:mt-0 bg-white text-primary-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        size="lg"
                    >
                        <FileText className="h-5 w-5 mr-2" />
                        Teklif Oluştur
                    </Button>
                </div>
            </div>

            {/* Son Teklifler (Örnek) */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Son Teklifleriniz
                </h3>
                <div className="text-center py-8 text-gray-500">
                    Henüz teklif oluşturmadınız. Yukarıdaki butonu kullanarak ilk teklifinizi oluşturun.
                </div>
            </div>
        </div>
    );
}