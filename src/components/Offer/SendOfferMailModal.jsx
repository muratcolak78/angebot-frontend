import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function SendOfferMailModal({
    open,
    onClose,
    offerId,
    registeredEmail,
}) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const sendRegistered = async () => {
        try {
            setLoading(true);

            await api.post("/mail/offer", {
                offerId
            });

            toast.success("E-Mail wurde gesendet!");
            onClose();
        } catch {
            toast.error("E-Mail konnte nicht gesendet werden!");
        } finally {
            setLoading(false);
        }
    };

    const sendOther = async () => {
        if (!email) {
            toast.error("Bitte E-Mail eingeben");
            return;
        }

        try {
            setLoading(true);

            await api.post("/mail/offer", {
                offerId,
                email
            });

            toast.success("E-Mail wurde gesendet!");
            onClose();
        } catch {
            toast.error("E-Mail konnte nicht gesendet werden!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-[92vw] max-w-md">
                <h3 className="text-lg font-semibold mb-4">
                    Angebot per E-Mail senden
                </h3>

                {/* kayıtlı mail */}
                <button
                    onClick={sendRegistered}
                    className="w-full bg-gray-900 text-white py-2 rounded-lg mb-4"
                    disabled={loading}
                >
                    An registrierte E-Mail senden
                </button>

                <div className="text-sm text-gray-500 mb-2">
                    oder andere Adresse:
                </div>

                <input
                    type="email"
                    placeholder="Andere E-Mail-Adresse eingeben"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 mb-3"
                />

                <button
                    onClick={sendOther}
                    className="w-full bg-primary-600 text-white py-2 rounded-lg"
                    disabled={loading}
                >
                    Senden
                </button>

                <button
                    onClick={onClose}
                    className="mt-4 text-sm text-gray-500 w-full"
                >
                    Abbrechen
                </button>
            </div>
        </div>
    );
}