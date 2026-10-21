import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const promptFont = Prompt({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-prompt",
  display: "swap",
});

export const metadata: Metadata = {
  title: "aifullfill.com - แพลตฟอร์มบุฟเฟต์การเรียนรู้ AI, คลังโค้ด และเครื่องมือสำเร็จรูป",
  description: "เรียนใช้ AI สร้างงานได้จริง ระบบสมาชิกบุฟเฟต์ Standard vs Premium เข้าถึงคอร์ส AI, ซอร์สโค้ดโปรเจกต์ และเครื่องมือพร้อมใช้ไม่จำกัด",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={promptFont.variable}>
      <body className="min-h-screen flex flex-col font-sans bg-brand-off-white text-brand-slate antialiased">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
