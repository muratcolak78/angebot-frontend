// components/Offer/OfferPreview.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Download, ArrowLeft, FileText } from "lucide-react";
import Button from "../Common/Button";
import LoadingSpinner from "../Common/LoadingSpinner";
import api from "../../services/api";
import toast from "react-hot-toast";

import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

export default function OfferPreview() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [error, setError] = useState(null);

    const [numPages, setNumPages] = useState(null);
    const [pageWidth, setPageWidth] = useState(0);

    useEffect(() => {
        const calc = () => {
            const w = Math.min(window.innerWidth, 1200) - 32;
            setPageWidth(Math.max(320, w));
        };
        calc();
        window.addEventListener("resize", calc);
        return () => window.removeEventListener("resize", calc);
    }, []);

    useEffect(() => {
        loadPDF();

        return () => {
            if (pdfUrl) window.URL.revokeObjectURL(pdfUrl);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const loadPDF = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("token");
            if (!token) {
                setError("Keine gültige Sitzung gefunden. Bitte melden Sie sich erneut an.");
                return;
            }

            const response = await api.get(`/pdf/${id}`, {
                responseType: "blob",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.data || response.data.size === 0) {
                throw new Error("Leeres PDF");
            }

            if (pdfUrl) window.URL.revokeObjectURL(pdfUrl);

            const url = window.URL.createObjectURL(
                new Blob([response.data], { type: "application/pdf" })
            );
            setPdfUrl(url);
        } catch (err) {
            console.error("Fehler beim Laden des PDFs:", err);

            if (err?.response?.status === 403) {
                setError("Sie haben keine Berechtigung, dieses PDF anzuzeigen.");
            } else if (err?.response?.status === 404) {
                setError("Das PDF wurde nicht gefunden.");
            } else {
                setError("Beim Laden des PDFs ist ein Fehler aufgetreten.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Keine gültige Sitzung gefunden. Bitte melden Sie sich erneut an.");
                return;
            }

            const response = await api.get(`/pdf/${id}`, {
                responseType: "blob",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `angebot-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast.success("Download gestartet…");
            setTimeout(() => window.URL.revokeObjectURL(url), 2000);
        } catch (e) {
            toast.error("Download fehlgeschlagen.");
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
                <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Fehler</h2>
                <p className="text-gray-600 mb-4 text-center">{error}</p>

                <Button onClick={() => navigate("/")}>
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
                    <Button variant="outline" size="sm" onClick={() => navigate("/")}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Zurück
                    </Button>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleDownload}
                            className="p-2 text-gray-500 hover:text-primary-600 rounded-lg hover:bg-gray-100"
                            title="PDF herunterladen"
                            aria-label="PDF herunterladen"
                        >
                            <Download className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 p-4 overflow-auto">
                {pdfUrl && (
                    <div className="max-w-5xl mx-auto">
                        <div className="bg-white rounded-lg shadow-lg p-2">
                            <Document
                                file={pdfUrl}
                                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                                onLoadError={(e) => {
                                    console.error("PDF-Render-Fehler:", e);
                                    setError("Das PDF konnte nicht dargestellt werden.");
                                }}
                                loading={
                                    <div className="p-6 text-center text-gray-600">
                                        PDF wird geladen…
                                    </div>
                                }
                            >
                                {Array.from(new Array(numPages || 0), (_, index) => (
                                    <div key={`p_${index + 1}`} className="my-3 flex justify-center">
                                        <Page
                                            pageNumber={index + 1}
                                            width={pageWidth || 360}
                                            renderAnnotationLayer={false}
                                            renderTextLayer={false}
                                        />
                                    </div>
                                ))}
                            </Document>

                            <div className="p-3 flex justify-center">
                                <Button onClick={handleDownload}>
                                    <Download className="h-4 w-4 mr-2" />
                                    PDF herunterladen
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}