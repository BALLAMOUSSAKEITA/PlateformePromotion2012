import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#0f5132",
};

export const metadata: Metadata = {
  title: "AAES – Promotion 2012 | Anciens Élèves de Siguiri",
  description: "Plateforme officielle de l'Association des Anciens Élèves de Siguiri, Promotion 2012. Rejoignez votre communauté et obtenez votre carte de membre.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AAES 2012",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
