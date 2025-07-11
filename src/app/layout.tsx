import type { Metadata } from 'next';
import {ReactNode} from 'react';

export const metadat: Metadata = {
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