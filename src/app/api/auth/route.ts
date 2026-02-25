import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { username, password } = await request.json();

    // Placeholder auth logic
    if (username === 'admin' && password === 'admin') {
        return NextResponse.json({
            success: true,
            user: { username: 'admin', role: 'admin' }
        });
    }

    return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
    }, { status: 401 });
}
