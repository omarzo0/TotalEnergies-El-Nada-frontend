import React, { useState } from 'react';

interface Na2lFr2EditorProps {
    initialNa2l: number;
    initialFr2s3r: number;
    onSave: (na2l: number, fr2s3r: number) => Promise<void>;
}

export default function Na2lFr2Editor({ initialNa2l, initialFr2s3r, onSave }: Na2lFr2EditorProps) {
    const [na2l, setNa2l] = useState(initialNa2l.toString());
    const [fr2s3r, setFr2s3r] = useState(initialFr2s3r.toString());
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(parseFloat(na2l), parseFloat(fr2s3r));
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
                    value={na2l}
                    onChange={(e) => setNa2l(e.target.value)}
                    className="w-20 px-2 py-1 rounded bg-slate-50 border border-slate-200 text-xs focus:ring-1 focus:ring-primary outline-none"
                    placeholder="نقل"
                />
            </div>
            <div className="flex flex-col">
                <input
                    type="number"
                    value={fr2s3r}
                    onChange={(e) => setFr2s3r(e.target.value)}
                    className="w-20 px-2 py-1 rounded bg-slate-50 border border-slate-200 text-xs focus:ring-1 focus:ring-primary outline-none"
                    placeholder="فرق"
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
