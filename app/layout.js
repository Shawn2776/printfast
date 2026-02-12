import "./globals.css";

export const metadata = {
  title: "PrintStarter | AI Product Ideation for Makers",
  description:
    "Generate practical 3D-print product ideas with feasibility and demand signals, then move directly into production.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#07070A] text-neutral-100 antialiased">
        {children}
      </body>
    </html>
  );
}
