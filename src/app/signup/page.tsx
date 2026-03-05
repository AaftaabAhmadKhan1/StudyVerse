'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#030014] flex items-center justify-center">
      <p className="text-white/40 text-sm">Redirecting to sign in...</p>
    </div>
  );
}
