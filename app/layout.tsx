import type { Metadata } from "next";
import "./globals.css";
import LanguageNav from "../components/LanguageNav";
import { AuthProvider } from "../lib/auth-context";
import ProtectedRoute, { AppGuard } from "../components/protected-route";

export const metadata: Metadata = {
  title: "PLAN A - Discover Bariloche",
  description: "Discover unique experiences in Bariloche with certified local guides",
  generator: "v0.dev",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <AppGuard>
            {children}
          </AppGuard>
        </AuthProvider>
      </body>
    </html>
  );
}