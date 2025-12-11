'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import toast from 'react-hot-toast';

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
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // <-- REQUIRED!
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Invalid password');
        return;
      }

      toast.success('Logged in successfully!');
      router.push('/admin/projects'); // redirect after login
    } catch (err) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box className="flex items-center justify-center h-screen p-4">
      <Paper className="w-full max-w-sm p-8" elevation={6}>
        <Typography variant="h5" className="mb-4 font-bold text-center">
          Admin Login
        </Typography>

        <form onSubmit={handleLogin}>
          <TextField
            type="password"
            label="Admin Password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
