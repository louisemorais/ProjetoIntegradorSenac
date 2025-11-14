import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Link
} from '@mui/material';
import { api } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', senha: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.auth.login(formData.email, formData.senha);
      if (response.success) {
        // Salvar dados do usuário no localStorage
        localStorage.setItem('usuario', JSON.stringify(response.data));
        // Redirecionar para home ou perfil
        navigate('/');
        window.location.reload(); // Recarregar para atualizar navbar
      }
    } catch (err) {
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ paddingTop: '80px', paddingBottom: '40px' }}>
      <Card sx={{ boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ padding: '40px' }}>
          <Typography variant='h4' sx={{ textAlign: 'center', color: '#213448', fontWeight: 600, marginBottom: '30px' }}>
            Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ marginBottom: '20px' }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              sx={{ marginBottom: '20px' }}
            />

            <TextField
              fullWidth
              label="Senha"
              name="senha"
              type="password"
              value={formData.senha}
              onChange={handleChange}
              required
              sx={{ marginBottom: '20px' }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: '#213448',
                padding: '12px',
                marginBottom: '20px',
                '&:hover': { backgroundColor: '#3b5876' }
              }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant='body2' sx={{ color: '#666' }}>
                Não tem uma conta?{' '}
                <Link 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/registro');
                  }}
                  sx={{ color: '#213448', fontWeight: 600 }}
                >
                  Cadastre-se
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

