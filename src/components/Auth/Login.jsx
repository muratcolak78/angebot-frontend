import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import Button from '../Common/Button';
import Input from '../Common/Input';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await login(email, password);
        if (success) {
            navigate('/');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex">
            {/* Sol Taraf - Login Form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Willkommen bei Angebot
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Anmelden
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
                                placeholder="Ihr Passwort"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                icon={<Lock className="h-5 w-5 text-gray-400" />}
                                required
                            />
                        </div>

                        <div>
                            <Button
                                type="submit"
                                loading={loading}
                                className="w-full flex justify-center items-center"
                            >
                                Einloggen<ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>

                        <div className="text-center">
                            <Link to="/register" className="text-sm text-primary-600 hover:text-primary-500">
                                Haben Sie noch kein Konto? Registieren
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
                        {/* Video veya Reklam İçeriği */}
                        <div className="bg-white/10 rounded-lg p-8 backdrop-blur-lg">
                            <div className="hidden lg:block relative w-0 flex-1 overflow-hidden">
                                <video
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="absolute inset-0 w-full h-full object-cover"
                                >
                                    <source src="/videos/angebot.mp4" type="video/mp4" />
                                </video>

                                <div className="absolute inset-0 bg-gradient-to-br from-primary-600/70 to-primary-900/70"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}