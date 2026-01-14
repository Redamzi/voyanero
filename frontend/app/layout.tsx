import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: '--font-jakarta',
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VOYANERO - Premium Travel Marketplace",
  description: "Find your next adventure",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body className={`${jakarta.variable} ${inter.className} font-sans`}>
        {children}
      </body>
    </html>
  );
}
