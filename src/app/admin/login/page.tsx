'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { PrimaryButton } from '@/components/CustomButtons';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Invalid password');
        return;
      }

      toast.success('Logged in successfully!');
      router.push('/admin');
    } catch {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-full max-w-md p-10 rounded-2xl border bg-primary-light dark:bg-primary-dark border-gray-300 dark:border-[rgba(255,255,255,0.06)] shadow-lg">
        <h1 className="mb-2 text-3xl font-extrabold text-center text-black dark:text-white">
          Admin
        </h1>

        <p className="mb-6 text-center text-gray-500 dark:text-gray-400">
          Enter your admin password to access
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-md border-2 border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-[#7E7D7E]
        focus:outline-none focus:border-gray-600
        dark:border-[rgba(255,255,255,0.06)] dark:focus:border-gray-400"
          />

          <PrimaryButton
            type="submit"
            disabled={loading}
            className="w-full py-3 text-lg font-medium"
          >
            {loading ? 'Logging in...' : 'Login'}
          </PrimaryButton>
        </form>
      </div>
    </div>
  );
}
