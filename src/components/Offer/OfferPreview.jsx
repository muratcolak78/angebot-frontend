// components/Offer/OfferPreview.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Download, Mail, ArrowLeft, Printer, Edit,
    FileText, Eye, Trash2
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

    const handlePrint = () => {
        if (pdfUrl) {
            const printWindow = window.open(pdfUrl);
            printWindow.print();
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
                <p className="ml-4 text-gray-600">PDF yükleniyor...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen flex flex-col items-center justify-center">
                <FileText className="h-16 w-16 text-red-400 mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">Hata</h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={() => navigate('/')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Zurück zum Dashboard
                </Button>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* Toolbar */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/')}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Zurück
                        </Button>
                        <span className="text-sm text-gray-500">
                            Angebot #{id}
                        </span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handlePrint}
                            className="p-2 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-gray-100"
                            title="Drucken"
                        >
                            <Printer className="h-5 w-5" />
                        </button>
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

            {/* PDF Viewer */}
            <div className="flex-1 p-4">
                {pdfUrl && (
                    <iframe
                        src={pdfUrl}
                        className="w-full h-full rounded-lg shadow-lg bg-white"
                        title={`Angebot #${id}`}
                    />
                )}
            </div>
        </div>
    );
}