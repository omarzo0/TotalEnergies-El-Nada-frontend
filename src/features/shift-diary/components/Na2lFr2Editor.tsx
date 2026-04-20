import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

interface Na2lFr2EditorProps {
    initialTransfer: number;
    initialPriceDiff: number;
    onSave: (transfer: number, priceDiff: number) => Promise<void>;
}

export default function Na2lFr2Editor({ initialTransfer, initialPriceDiff, onSave }: Na2lFr2EditorProps) {
    const t = useTranslations("table.shiftDiary");
    const [transfer, setTransfer] = useState(initialTransfer.toString());
    const [priceDiff, setPriceDiff] = useState(initialPriceDiff.toString());
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(parseFloat(transfer), parseFloat(priceDiff));
        } catch (err) {

            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex gap-2 items-center">
            <div className="flex flex-col">
                <input
                    type="number"
                    value={transfer}
                    onChange={(e) => setTransfer(e.target.value)}
                    className="w-20 px-2 py-1 rounded bg-slate-50 border border-slate-200 text-xs focus:ring-1 focus:ring-primary outline-none"
                    placeholder={t("transfer")}
                />
            </div>
            <div className="flex flex-col">
                <input
                    type="number"
                    value={priceDiff}
                    onChange={(e) => setPriceDiff(e.target.value)}
                    className="w-20 px-2 py-1 rounded bg-slate-50 border border-slate-200 text-xs focus:ring-1 focus:ring-primary outline-none"
                    placeholder={t("priceDiff")}
                />
            </div>

            <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-8 h-8 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center disabled:opacity-50"
            >
                {isSaving ? (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                ) : (
                    <i className="bx bx-check text-base"></i>
                )}
            </button>
        </div>
    );
}
