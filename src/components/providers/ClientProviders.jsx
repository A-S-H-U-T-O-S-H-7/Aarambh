// components/providers/ClientProviders.jsx
'use client';

import { Toaster } from 'react-hot-toast';
import ThemeProvider from './ThemeProvider';

export default function ClientProviders({ children }) {
  return (
    <ThemeProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#FFF8E7',
            color: '#2C1810',
            border: '1px solid #F4B400',
            borderRadius: '12px',
            padding: '16px',
            fontFamily: 'inherit',
          },
          success: {
            iconTheme: {
              primary: '#FF7A00',
              secondary: '#FFF8E7',
            },
          },
          error: {
            iconTheme: {
              primary: '#D32F2F',
              secondary: '#FFF8E7',
            },
          },
        }}
      />
    </ThemeProvider>
  );
}