import { SidebarInset, SidebarProvider } from "@repo/ui/sidebar";
import { Toaster } from "@repo/ui/sonner";
import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AppSidebar, AppSidebarTrigger } from "@/components/sidebar";
import "./globals.css";

const interSans = Inter({
  variable: "--font-inter",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});
const interMono = Geist_Mono({
  variable: "--font-inter-mono",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "yash-fynd",
  description: "yash-fynd hackathon project called Commerce console",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${interSans.variable} ${interMono.variable}`}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <header className="flex h-12 shrink-0 items-center border-b px-3">
                  <AppSidebarTrigger when="collapsed" />
                </header>
                <div className="flex-1 p-6">{children}</div>
              </SidebarInset>
            </SidebarProvider>
            <Toaster />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
