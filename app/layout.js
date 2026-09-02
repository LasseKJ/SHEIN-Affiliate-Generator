import "./globals.css";

export const metadata = {
  title: "SHEIN Affiliate Generator",
  description: "Automated SHEIN affiliate content generator"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
