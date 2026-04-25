import "../styles/globals.css";
import ClientLayout from "@/components/layout/ClientLayout";
import { Providers } from "@/context/Providers";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CaseMatrixDB",
  description: "Legal Case Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-zinc-50 text-zinc-900 selection:bg-blue-100 selection:text-blue-900">
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
