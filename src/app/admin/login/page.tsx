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
      router.push('/admin/projects');
    } catch {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="w-full max-w-md p-10 bg-white border border-gray-200 shadow-lg rounded-2xl">
        <h1 className="mb-2 text-3xl font-extrabold text-center text-gray-900">
          Admin
        </h1>
        <p className="mb-8 text-center text-gray-500">
          Enter your admin password to access
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
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
