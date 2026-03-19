# Example: Updating Login.jsx to Use New API

## OLD VERSION (Firebase)
```jsx
import { loginUser } from '../firebase/authService';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await loginUser(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // JSX
  );
}
```

## NEW VERSION (MongoDB + Node.js)
```jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

export default function Login() {
  const navigate = useNavigate();
  const { login, authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError('');
    try {
      await login(email, password);
      // Token automatically saved
      navigate('/dashboard');
    } catch (err) {
      setLocalError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const errorMessage = localError || authError;

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

## KEY DIFFERENCES
1. Import `useAuth` instead of `loginUser`
2. Call `await login(email, password)` instead of `loginUser(email, password)`
3. Token automatically stored in localStorage
4. Error handling via `authError` state from context
5. No need to manually set user in state
6. Token automatically included in subsequent API calls

