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

            {/* ================= LEFT SIDE LOGIN ================= */}
            <div className="flex-1 flex items-center justify-center px-6 lg:px-12 bg-white">

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


            {/* ================= RIGHT SIDE VIDEO ================= */}
            <div >

                {/* Video background */}
                <video
                    autoPlay
                    loop
                    playsInline
                    preload="auto"
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src="/videos/angebot.mp4" type="video/mp4" />
                </video>

            </div>

        </div>
    );
}