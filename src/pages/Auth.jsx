import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  InputAdornment,
  IconButton,
  Paper,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogin = () => {
    const master = import.meta.env.VITE_MASTER_PASSWORD;
    if (password === master) {
      setError('');
      onLogin(); // navigate or set login true
    } else {
      setError('Incorrect master password.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', backgroundColor:'black'  }}>
      <Paper elevation={6} sx={{ width: '100%', p: isMobile ? 3 : 5, borderRadius: 5 }}>
        <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" gutterBottom>
          Admin Login
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
          Enter the master password to proceed.
        </Typography>

        <TextField
          fullWidth
          type={show ? 'text' : 'password'}
          label="Master Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          sx={{ mb: 3 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShow((prev) => !prev)} edge="end">
                  {show ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          onClick={handleLogin}
          sx={{
            borderRadius: 30,
            // py: 1.4,
            fontWeight: 'bold',
            boxShadow: 3,
            textTransform: 'none',
          }}
        >
          Login
        </Button>
      </Paper>
    </Container>
  );
};

export default Login;
