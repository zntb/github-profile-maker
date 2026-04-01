'use client';

import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';

import { Builder } from '@/components/builder';
import { Footer } from '@/components/footer';

import Loading from './loading';

export function HomeContent() {
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoad) {
    return <Loading />;
  }

  return (
    <>
      <Builder />
      <Footer />
      <Toaster position="bottom-right" theme="dark" />
    </>
  );
}
