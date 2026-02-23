import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, Mail, ArrowLeft, Printer } from 'lucide-react';
import Button from '../Common/Button';
import LoadingSpinner from '../Common/LoadingSpinner';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function OfferPDF() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [pdfUrl, setPdfUrl] = useState(null);

    useEffect(() => {
        loadPDF();
    }, [id]);

    const loadPDF = async () => {
        try {
            const response = await api.get(`/pdf/${id}`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            setPdfUrl(url);
        } catch (error) {
            toast.error('Fehler beim Laden von PDF!');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.setAttribute('download', `angebot-${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    const handlePrint = () => {
        const printWindow = window.open(pdfUrl);
        printWindow.print();
    };

    const handleEmail = () => {
        // Mail gönderme işlemi
        toast.success('Die Funktion zum Versenden von E-Mails wird bald hinzugefügt!');
    };

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* Toolbar */}
            <div className="bg-white border-b border-gray-200 px-4 py-3">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/')}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Züruck
                        </Button>
                        <h1 className="text-lg font-medium text-gray-900">
                            Angebot #{id}
                        </h1>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePrint}
                        >
                            <Printer className="h-4 w-4 mr-2" />
                            Drucken
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDownload}
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleEmail}
                        >
                            <Mail className="h-4 w-4 mr-2" />
                            Send per E-mail
                        </Button>
                    </div>
                </div>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 p-4">
                <iframe
                    src={pdfUrl}
                    className="w-full h-full rounded-lg shadow-lg bg-white"
                    title="PDF Viewer"
                />
            </div>
        </div>
    );
}