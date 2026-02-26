"use client";

import { useState, useEffect } from "react";
import { BenzeneRecord, BenzeneRecordType } from "../types/benzene.types";

export function useBenzene(type: BenzeneRecordType) {
    const [records, setRecords] = useState<BenzeneRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Mock API call
        const timer = setTimeout(() => {
            setRecords([
                {
                    id: "1",
                    type: "Benzene 95",
                    startBalance: 1000,
                    endBalance: 800,
                    incoming: 0,
                    sold: 200,
                    price: 25.5,
                    total: 5100,
                    date: new Date().toISOString()
                }
            ]);
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [type]);

    const addRecord = async (data: any) => {
        const newRecord = {
            ...data,
            id: Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString()
        };
        setRecords([newRecord, ...records]);
    };

    const updateRecord = async (id: string, data: any) => {
        setRecords(records.map(r => r.id === id ? { ...r, ...data } : r));
    };

    const removeRecord = async (id: string) => {
        setRecords(records.filter(r => r.id !== id));
    };

    return {
        records,
        isLoading,
        addRecord,
        updateRecord,
        removeRecord
    };
}
