import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import '@rainbow-me/rainbowkit/styles.css';
import { WalletProvider } from "./_context/wallet";
import { DataContextProvider } from "./_context/data";

const poppins = Poppins({weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], subsets: ['latin']});

export const metadata: Metadata = {
  title: "StoryPod",
  description: "A Podcast Creation platform based on Story Protocol",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <WalletProvider>
            <DataContextProvider>
              {children}
          </DataContextProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
