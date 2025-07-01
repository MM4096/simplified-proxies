import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {ReactNode} from "react";
import Script from "next/script";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Simplified Proxies",
	description: "Simplified Black and White Proxies for Magic the Gathering and Pokemon Trading Card Game",
	keywords: "magic the gathering, mtg, proxies, proxy, simplified, black and white, black white",
};

export default function RootLayout({children,}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<html lang="en" data-theme="light">
		<body className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen flex items-center justify-center overflow-y-none`}>
		{children}

		{
			process.env.NODE_ENV === "production" && (<Script src="https://cloud.umami.is/script.js" data-website-id="9aa6f2e5-7a33-4efc-be6f-d12d9733e183"/>)
		}

		</body>
		</html>
	);
}
