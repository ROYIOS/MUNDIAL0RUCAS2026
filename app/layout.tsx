
import "./globals.css";

export const metadata = {
  title: "Mundial Rucas 2026",
  description: "Planner de viaje para el Mundial 2026",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

