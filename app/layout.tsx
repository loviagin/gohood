import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Header from "./components/header/Header";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GoHood – Умный поиск жилья с подбором районов",
  description:
    "Отели, квартиры, дома, коттеджи, хостелы, апартаменты и другие варианты жилья в России и за рубежом с ИИ подбором районов",
  keywords: ["GoHood", "Умный поиск жилья", "Подбор районов", "Отели", "Квартиры", "Котеджи", "Хостелы", "Апартаменты"],
    icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "GoHood – Умный поиск жилья с подбором районов",
    description:
      "Отели, квартиры, дома, коттеджи, хостелы, апартаменты и другие варианты жилья в России и за рубежом с подбором районов",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <Header />
          {children}
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
