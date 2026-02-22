import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasSettings, setHasSettings] = useState(false);
    const [hasRateCard, setHasRateCard] = useState(false);

    useEffect(() => {
        // Token kontrolü
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
            setUser(JSON.parse(userData));
            checkUserSetup();
        }
        setLoading(false);
    }, []);

    const checkUserSetup = async () => {
        try {
            // Settings ve RateCard kontrolü yapılacak
            // Burada API çağrıları ile kontrol edilebilir
            const settingsCheck = localStorage.getItem('hasSettings') === 'true';
            const rateCardCheck = localStorage.getItem('hasRateCard') === 'true';

            setHasSettings(settingsCheck);
            setHasRateCard(rateCardCheck);
        } catch (error) {
            console.error('Setup check failed:', error);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await apiLogin(email, password);
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify({ email }));
            setUser({ email });
            await checkUserSetup();
            toast.success('Başarıyla giriş yapıldı!');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Giriş başarısız!');
            return false;
        }
    };

    const register = async (email, password) => {
        try {
            await apiRegister(email, password);
            toast.success('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Kayıt başarısız!');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setHasSettings(false);
        setHasRateCard(false);
        toast.success('Çıkış yapıldı!');
    };

    const updateSetupStatus = (type, value) => {
        if (type === 'settings') {
            setHasSettings(value);
            localStorage.setItem('hasSettings', value);
        } else if (type === 'ratecard') {
            setHasRateCard(value);
            localStorage.setItem('hasRateCard', value);
        }
    };

    const value = {
        user,
        loading,
        hasSettings,
        hasRateCard,
        login,
        register,
        logout,
        updateSetupStatus
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}