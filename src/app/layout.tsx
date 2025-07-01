import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {ReactNode} from "react";
import {Analytics} from "@/app/components/analytics";

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
		<body
			className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen flex items-center justify-center overflow-y-none`}>
		{children}

		<Analytics/>

		</body>
		</html>
	);
}
