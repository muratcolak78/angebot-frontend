import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, ArrowRight, Clock, FileCheck, Rocket } from 'lucide-react';
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

            {/* ================= LEFT SIDE LOGIN ================= */}
            <div className="w-1/2 flex items-center justify-center px-6 lg:px-12 bg-white">

                <div className="max-w-md w-full space-y-8">

                    <div>
                        <h2 className="text-center text-3xl font-extrabold text-gray-900">
                            Willkommen bei Angebot
                        </h2>

                        <p className="mt-2 text-center text-sm text-gray-600">
                            Melden Sie sich in Ihr Konto an
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


            {/* ================= RIGHT SIDE PROMO ================= */}
            <div className="w-1/2 relative bg-gradient-to-br from-primary-900 to-primary-700 flex items-center justify-center p-8">

                {/* Video Container - Klein und zentriert */}
                <div className="absolute inset-0 opacity-20">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        className="w-full h-full object-cover"
                    >
                        <source src="/videos/angebot.mp4" type="video/mp4" />
                    </video>
                </div>

                {/* Content Container */}
                <div className="relative z-10 max-w-lg text-white">

                    {/* Kleinere Video Box */}
                    <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                            className="w-full h-48 object-cover"
                        >
                            <source src="/videos/angebot.mp4" type="video/mp4" />
                        </video>
                    </div>

                    {/* Promo Text */}
                    <h2 className="text-4xl font-bold mb-4">
                        In 2 Minuten zum<br />professionellen Angebot
                    </h2>

                    <p className="text-xl text-primary-100 mb-8">
                        Erstellen Sie im Handumdrehen maßgeschneiderte Angebote und gewinnen Sie mehr Kunden
                    </p>


                </div>
            </div>

        </div>
    );
}