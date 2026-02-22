import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, UserPlus, ArrowRight } from 'lucide-react';
import Button from '../Common/Button';
import Input from '../Common/Input';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Die Passwörter stimmen nicht überein!');
            return;
        }

        if (password.length < 6) {
            setError('Das Passwort muss mindestens 6 Zeichen lang sein!');
            return;
        }

        setLoading(true);
        const success = await register(email, password);
        if (success) {
            navigate('/login');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex">
            {/* Sol Taraf - Register Form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Neues Konto erstellen
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Erstellen Sie ein kostenloses Konto und starten Sie jetzt
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <Input
                                type="email"
                                placeholder="Ihre E-Mail Adresse"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                icon={<Mail className="h-5 w-5 text-gray-400" />}
                                required
                            />

                            <Input
                                type="password"
                                placeholder="Ihr Passwort (mind. 6 Zeichen)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                icon={<Lock className="h-5 w-5 text-gray-400" />}
                                required
                            />

                            <Input
                                type="password"
                                placeholder="Geben Sie Ihr Passwort erneut ein"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                icon={<Lock className="h-5 w-5 text-gray-400" />}
                                required
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <Button
                                type="submit"
                                loading={loading}
                                className="w-full flex justify-center items-center"
                            >
                                Registrieren <UserPlus className="ml-2 h-5 w-5" />
                            </Button>
                        </div>

                        <div className="text-center">
                            <Link to="/login" className="text-sm text-primary-600 hover:text-primary-500">
                                Haben Sie bereits ein Konto? Anmelden
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            {/* Sağ Taraf - Reklam/Video Alanı */}
            <div className="hidden lg:block relative w-0 flex-1 bg-gradient-to-br from-primary-500 to-primary-700">
                <div className="absolute inset-0 flex items-center justify-center text-white p-12">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold mb-4">Professionelles Angebotsmanagement</h3>
                        <p className="text-lg opacity-90 mb-8">
                            Erstellen Sie schnell und professionell Angebote für Ihre Kunden
                        </p>
                        <div className="bg-white/10 rounded-lg p-8 backdrop-blur-lg">
                            <div className="aspect-video bg-white/20 rounded flex items-center justify-center">
                                <span className="text-white/60">Video Reklam Alanı</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}