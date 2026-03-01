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
        <div className="min-h-screen flex flex-col lg:flex-row">

            {/* ================= LEFT SIDE LOGIN ================= */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 py-8 lg:px-12 bg-white order-2 lg:order-1">
                <div className="max-w-md w-full space-y-6 sm:space-y-8">
                    <div>
                        <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
                            Willkommen bei Angebot
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Melden Sie sich in Ihr Konto an
                        </p>
                    </div>

                    <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-3 sm:space-y-4">
                            <Input
                                type="email"
                                placeholder="Ihre E-Mail"
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

                        <Button
                            type="submit"
                            loading={loading}
                            className="w-full flex justify-center items-center"
                        >
                            Einloggen
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>

                        <div className="text-center">
                            <Link
                                to="/register"
                                className="text-sm text-primary-600 hover:text-primary-500"
                            >
                                Haben Sie noch kein Konto? Registrieren
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            {/* ================= RIGHT SIDE ================= */}
            <div className="w-full lg:w-1/2 bg-gradient-to-br from-primary-50 to-gray-50 flex items-center justify-center p-6 lg:p-8 order-1 lg:order-2">
                <div className="max-w-md lg:max-w-2xl text-center">
                    {/* Text oben - mobil daha küçük */}
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 lg:mb-8 leading-tight">
                        10 Minuten registrieren,<br />2 Minuten Angebot erstellen
                    </h3>

                    {/* Video Container - mobil tam genişlik */}
                    <div className="rounded-lg lg:rounded-xl overflow-hidden shadow-lg lg:shadow-2xl">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                            className="w-full h-auto"
                        >
                            <source src="/videos/angebot.mp4" type="video/mp4" />
                        </video>
                    </div>
                </div>
            </div>

        </div>
    );
}