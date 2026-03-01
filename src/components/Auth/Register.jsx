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
        <div className="min-h-screen flex flex-col lg:flex-row">

            {/* ================= LEFT SIDE REGISTER ================= */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 py-8 lg:px-12 bg-white order-2 lg:order-1">
                <div className="max-w-md w-full space-y-6 sm:space-y-8">
                    <div>
                        <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
                            Neues Konto erstellen
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Erstellen Sie ein kostenloses Konto und starten Sie jetzt
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
                                placeholder="Ihr Passwort (mind. 6 Zeichen)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                icon={<Lock className="h-5 w-5 text-gray-400" />}
                                required
                            />

                            <Input
                                type="password"
                                placeholder="Passwort wiederholen"
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

                        <Button
                            type="submit"
                            loading={loading}
                            className="w-full flex justify-center items-center"
                        >
                            Registrieren
                            <UserPlus className="ml-2 h-5 w-5" />
                        </Button>

                        <div className="text-center">
                            <Link
                                to="/login"
                                className="text-sm text-primary-600 hover:text-primary-500"
                            >
                                Haben Sie bereits ein Konto? Anmelden
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            {/* ================= RIGHT SIDE PROMO ================= */}
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