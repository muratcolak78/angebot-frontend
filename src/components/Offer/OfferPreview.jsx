// components/Offer/OfferPreview.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Download, ArrowLeft, Printer, FileText
} from 'lucide-react';
import Button from '../Common/Button';
import LoadingSpinner from '../Common/LoadingSpinner';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function OfferPreview() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [error, setError] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    // Mobil kontrolü
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        loadPDF();
    }, [id]);

    const loadPDF = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            if (!token) {
                setError('Oturum bulunamadı');
                return;
            }

            const response = await api.get(`/pdf/${id}`, {
                responseType: 'blob',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.data || response.data.size === 0) {
                throw new Error('PDF boş');
            }

            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            setPdfUrl(url);

        } catch (err) {
            console.error('PDF yükleme hatası:', err);
            setError(err.response?.status === 403
                ? 'Bu PDF\'i görüntüleme yetkiniz yok'
                : 'PDF yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get(`/pdf/${id}`, {
                responseType: 'blob',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `angebot-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast.success('PDF indiriliyor...');
        } catch (error) {
            toast.error('PDF indirilemedi');
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen flex flex-col items-center justify-center px-4">
                <FileText className="h-16 w-16 text-red-400 mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Hata</h2>
                <p className="text-gray-600 mb-4 text-center">{error}</p>
                <Button onClick={() => navigate('/')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Zurück
                </Button>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* Toolbar */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/')}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Zurück
                    </Button>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleDownload}
                            className="p-2 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-gray-100"
                            title="PDF herunterladen"
                        >
                            <Download className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* PDF Viewer - Mobil için basit çözüm */}
            <div className="flex-1 p-4">
                {pdfUrl && (
                    <div className="w-full h-full">
                        {isMobile ? (
                            // Mobil için: Ya göster ya da indir
                            <div className="flex flex-col items-center justify-center h-full">
                                <object
                                    data={pdfUrl}
                                    type="application/pdf"
                                    className="w-full h-full min-h-[600px] rounded-lg shadow-lg bg-white"
                                >
                                    <div className="text-center p-8 bg-white rounded-lg shadow">
                                        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 mb-4">
                                            PDF kann nicht angezeigt werden
                                        </p>
                                        <Button onClick={handleDownload}>
                                            <Download className="h-4 w-4 mr-2" />
                                            PDF herunterladen
                                        </Button>
                                    </div>
                                </object>
                            </div>
                        ) : (
                            // Desktop için normal iframe
                            <iframe
                                src={pdfUrl}
                                className="w-full h-full rounded-lg shadow-lg bg-white"
                                title={`Angebot #${id}`}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}