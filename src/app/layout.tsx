
import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Instituciones Conectadas | Red de Transformación Social',
  description: 'Conectamos polideportivos, iglesias y organizaciones sociales para el desarrollo de las infancias.',
  icons: {
    icon: '/img/icoIC.png',
    shortcut: '/img/icoIC.png',
    apple: '/img/icoIC.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
        {children}
      </body>
    </html>
  );
}
