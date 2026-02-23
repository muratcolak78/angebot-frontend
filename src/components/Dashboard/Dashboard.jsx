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
            title: 'Unternehmenseinstellungen',
            description: 'Fügen Sie Ihre Unternehmensinformationen, Ihr Logo und Ihre Unterschrift hinzu',
            completed: hasSettings,
            icon: Settings,
            path: '/settings'
        },
        {
            id: 'ratecard',
            title: 'Preiskarte',
            description: 'm²-Preise und Abzüge festlegen',
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
                    Herzlich willkommen!
                </h1>
                <p className="text-gray-600">
                    Führen Sie die folgenden Schritte aus, um ein Angebot zu erstellen.
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
                                    Vollständig
                                </Button>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Create Offer Button */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-lg p-8 text-white">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Sind Sie bereit?</h2>
                        <p className="text-primary-100">
                            {allCompleted
                                ? 'Jetzt können Sie mit der Erstellung von Angeboten beginnen!'
                                : 'Bitte führen Sie zunächst alle Schritte aus.'}
                        </p>
                    </div>

                    <Button
                        onClick={() => navigate('/offers/new')}
                        disabled={!allCompleted}
                        className="mt-4 md:mt-0 bg-white text-primary-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        size="lg"
                    >
                        <FileText className="h-5 w-5 mr-2" />
                        Angebot erstellen
                    </Button>
                </div>
            </div>

            {/* Final Offers (Sample)*/}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Letzte Angebote
                </h3>
                <div className="text-center py-8 text-gray-500">
                    Sie haben noch kein Angebot gemacht. Erstellen Sie Ihr erstes Angebot über die Schaltfläche oben.
                </div>
            </div>
        </div>
    );
}