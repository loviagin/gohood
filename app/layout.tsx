import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
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
        <Script
          id="emrld-script"
          data-noptimize="1"
          data-cfasync="false"
          data-wpfc-render="false"
          strategy="afterInteractive"
        >
          {`
            (function() {
              var script = document.createElement("script");
              script.async = 1;
              script.src = 'https://emrld.cc/NDIxMjAw.js?t=421200';
              document.head.appendChild(script);
            })();
          `}
        </Script>
        <Script
          id="yandex-metrika"
          strategy="afterInteractive"
        >
          {`
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(102298581, "init", {
              clickmap:true,
              trackLinks:true,
              accurateTrackBounce:true,
              webvisor:true
            });
          `}
        </Script>
        <noscript>
          <div>
            <img 
              src="https://mc.yandex.ru/watch/102298581" 
              style={{ position: 'absolute', left: '-9999px' }} 
              alt="" 
            />
          </div>
        </noscript>
        <Providers>
          <Header />
          {children}
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
