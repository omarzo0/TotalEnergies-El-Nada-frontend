"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { BenzeneRecord, BenzeneRecordType } from "../types/benzene.types";
import { benzeneApi } from "../api/benzene.api";
import { useTranslations } from "next-intl";

export function useBenzene(type: BenzeneRecordType, selectedDate: string) {
    const [records, setRecords] = useState<BenzeneRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const tPrices = useTranslations("benzene.pricesTab");

    const typeToPriceKey: Record<string, string> = useMemo(() => {
        const mapping = {
            [(tPrices("solar") || "Solar").trim()]: "solarPrice",
            [(tPrices("ben80") || "Benzene 80").trim()]: "ben80Price",
            [(tPrices("ben92") || "Benzene 92").trim()]: "ben92Price",
            [(tPrices("ben95") || "Benzene 95").trim()]: "ben95Price"
        };
        return mapping;
    }, [tPrices]);

    const fetchData = useCallback(async () => {
        // Ensure date is YYYY-MM-DD
        const formattedDate = selectedDate.includes('T') ? selectedDate.split('T')[0] : selectedDate;

        setIsLoading(true);
        setError(null);

        const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
        if (!token || token === "undefined") {
            setError("Authentication Error: Please log in again.");
            setIsLoading(false);
            return;
        }

        try {
            const [readingsData, pricesData] = await Promise.all([
                benzeneApi.getPumpReadings(formattedDate),
                benzeneApi.getPrices(formattedDate).catch(() => null)
            ]);

            const mapped: BenzeneRecord[] = readingsData.map((r, index) => {
                const trumbaType = r.pumpType || r.trumbaType || (r as any).benzType || "";
                const trumbaNumber = r.pumpNumber || r.trumbaNumber || 0;
                const trimmedType = trumbaType.trim();
                const priceKey = typeToPriceKey[trimmedType];
                const apiPrice = priceKey && pricesData ? (pricesData as any)[priceKey] : 0;
                const finalPrice = apiPrice > 0 ? apiPrice : (r.price || 0);

                return {
                    id: r._id || `record-${index}`,
                    type: trumbaType,
                    trumbaNumber: trumbaNumber,
                    startBalance: r.start,
                    endBalance: r.end,
                    incoming: r.incoming,
                    sold: r.total,
                    price: finalPrice,
                    total: r.sold || (r.total * finalPrice),
                    date: r.date.split('T')[0] // Ensure record date is also YYYY-MM-DD
                };
            });
            setRecords(mapped);
        } catch (err: any) {
            console.error("Failed to fetch pump readings:", err);
            if (err.message.includes("Unauthorized") || err.message.includes("token")) {
                setError("Unauthorized: Your session may have expired. Please log out and back in.");
            } else {
                setError(err.message || "Failed to fetch data");
            }
            setRecords([]);
        } finally {
            setIsLoading(false);
        }
    }, [selectedDate, typeToPriceKey]);

    useEffect(() => {
        fetchData();
    }, [fetchData, type]);

    const addRecord = async (data: any) => {
        try {
            await benzeneApi.createPumpReading(data);
            await fetchData();
        } catch (err: any) {
            console.error("Failed to add record:", err);
            throw err;
        }
    };

    const updateRecord = async (id: string, data: any) => {
        try {
            await benzeneApi.updatePumpReading(id, {
                start: data.start,
                end: data.end,
                incoming: data.incoming
            });
            await fetchData();
        } catch (err: any) {
            console.error("Update failed:", err);
            throw err;
        }
    };

    const removeRecord = async (id: string) => {
        try {
            await benzeneApi.deletePumpReading(id);
            await fetchData();
        } catch (err: any) {
            console.error("Delete failed:", err);
            throw err;
        }
    };

    return {
        records,
        isLoading,
        error,
        addRecord,
        updateRecord,
        removeRecord,
        refresh: fetchData
    };
}
