import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import { dark } from '@clerk/themes';

import '../globals.css';

export const metadata = {
  title: 'ne13x',
  description: 'A Next.js 13 ne13x Application',
};
const inter = Inter({ subsets: ['latin'] });
export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang='en'>
        <body className={`${inter.className} bg-dark-1`}>
          <div className='w-full flex justify-center items-center min-h-screen'>
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
