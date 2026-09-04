import type { Metadata } from 'next';
import './globals.css';
import { VehicleProvider } from '../context/VehicleContext';

export const metadata: Metadata = {
  title: 'AegisMine - Mining Vehicle Collision Avoidance System (CAS)',
  description: 'EMESRT Level 9 Compliant In-Cabin HMI, Engine Ignition Diagnostics, and 360° Interactive 3D Digital Twin Viewer for Mining Equipment.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#05050A] text-slate-100 antialiased selection:bg-cyan-500 selection:text-slate-950">
        <VehicleProvider>{children}</VehicleProvider>
      </body>
    </html>
  );
}
