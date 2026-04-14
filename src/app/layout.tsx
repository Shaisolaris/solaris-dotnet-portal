import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solaris Workplace — .NET Enterprise Portal",
  description:
    "Employee directory, org chart, and leave management for enterprise teams. Built with ASP.NET Core 8 + Blazor.",
  openGraph: {
    title: "Solaris Workplace — .NET Enterprise Portal",
    description: "ASP.NET Core + Blazor internal tool.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-100 font-sans text-slate-900 antialiased transition-colors dark:bg-slate-950 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
