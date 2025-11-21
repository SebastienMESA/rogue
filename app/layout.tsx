import "./globals.css";
import type { PropsWithChildren } from "react";

export const metadata = {
  title: "Rogue",
  description: "My Next.js app",
  icons: {
    icon: "/images/thief.svg",
    apple: "/images/thief.svg",
  },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="fr">
      <head />
      <body>{children}</body>
    </html>
  );
}
