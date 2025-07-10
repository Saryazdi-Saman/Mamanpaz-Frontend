'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ReferralTracker() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const refParam = searchParams.get('ref');
    
    if (refParam) {
      // Set cookie with 7-day expiration using document.cookie
      const maxAge = 60 * 60 * 24 * 7; // 7 days in seconds
      const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
      
      document.cookie = `ref=${refParam}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;

      // Clean up URL by removing the ref parameter
      const currentParams = new URLSearchParams(window.location.search);
      currentParams.delete('ref');
      
      const newUrl = window.location.pathname + 
        (currentParams.toString() ? `?${currentParams.toString()}` : '');
      
      // Replace current URL without adding to history
      router.replace(newUrl);
    }
  }, [searchParams, router]);

  return null; // This component doesn't render anything
}