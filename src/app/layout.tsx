import type { Metadata, Viewport } from 'next';
import {ReactNode} from 'react';

export const viewport: Viewport = {
  themeColor: "#1D214E"
}

export const metadata: Metadata = {
    metadataBase: new URL('https://www.mamanpazmeals.com'),
}

type Props = {
  children: ReactNode;
};

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default function RootLayout({children}: Props) {
  return children;
}