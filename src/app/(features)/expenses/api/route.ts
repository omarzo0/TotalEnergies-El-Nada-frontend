import { NextResponse } from 'next/server';
import { Expense } from '@/types';

export async function GET() {
    const expenses: Expense[] = [
        { amount: "500", receipt: "سند #001" },
        { amount: "1200", receipt: "سند #002" },
    ];
    return NextResponse.json(expenses);
}

export async function POST(request: Request) {
    const data = await request.json();
    return NextResponse.json({ success: true, data });
}
