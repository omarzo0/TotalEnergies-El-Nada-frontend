import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ReactNode } from "react";
import { Cairo, Inter } from "next/font/google";
import QueryProvider from "@/providers/QueryProvider";

const cairo = Cairo({
    subsets: ["arabic", "latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-cairo",
});

const inter = Inter({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-inter",
});

export const metadata = {
    title: "PetroDesk",
    description: "Gas Station Management System - Professional Admin Dashboard",
};

export default async function RootLayout({
    children
}: {
    children: ReactNode;
}) {
    let locale;
    try {
        locale = await getLocale();
    } catch {
        locale = "en";
    }

    const messages = await getMessages();
    const dir = locale === "ar" ? "rtl" : "ltr";

    return (
        <html lang={locale} dir={dir} className={`${cairo.variable} ${inter.variable}`}>
            <head>
                <link
                    href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
                    rel="stylesheet"
                />
            </head>
            <body className="font-cairo antialiased">
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <QueryProvider>
                        {children}
                    </QueryProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
