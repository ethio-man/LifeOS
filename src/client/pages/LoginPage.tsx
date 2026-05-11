import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { authApi } from '../api';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setToken = useStore((s) => s.setToken);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await authApi.login(password);
      setToken(data.token);
      navigate('/');
    } catch {
      setError('Invalid password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Life<span className="text-accent-2">OS</span>
          </h1>
          <p className="text-text-3 text-sm">Personal Command Center</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-bg-2 border border-white/5 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-2 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-bg-3 border border-white/10 rounded-r px-3 py-2.5 text-text text-sm focus:outline-none focus:border-accent transition-colors"
              autoFocus
            />
          </div>

          {error && (
            <div className="text-rose text-xs bg-rose/10 px-3 py-2 rounded-lg">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-accent hover:bg-accent-2 disabled:opacity-50 text-white font-medium py-2.5 rounded-r transition-colors text-sm"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-text-3 text-[11px] mt-6">
          Set your password in the .env file
        </p>
      </div>
    </div>
  );
}
