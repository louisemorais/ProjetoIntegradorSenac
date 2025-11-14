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
  Link,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { api } from '../services/api';

export default function Registro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    tipo_usuario: 'cliente'
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.usuarios.criar(formData);
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ paddingTop: '80px', paddingBottom: '40px' }}>
      <Card sx={{ boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ padding: '40px' }}>
          <Typography variant='h4' sx={{ textAlign: 'center', color: '#213448', fontWeight: 600, marginBottom: '30px' }}>
            Criar Conta
          </Typography>

          {error && (
            <Alert severity="error" sx={{ marginBottom: '20px' }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ marginBottom: '20px' }}>
              Conta criada com sucesso! Redirecionando para login...
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nome Completo"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              sx={{ marginBottom: '20px' }}
            />

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
              label="Telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
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

            <FormControl fullWidth sx={{ marginBottom: '20px' }}>
              <InputLabel>Tipo de Usuário</InputLabel>
              <Select
                name="tipo_usuario"
                value={formData.tipo_usuario}
                onChange={handleChange}
                label="Tipo de Usuário"
              >
                <MenuItem value="cliente">Cliente</MenuItem>
                <MenuItem value="prestador">Prestador</MenuItem>
              </Select>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || success}
              sx={{
                backgroundColor: '#213448',
                padding: '12px',
                marginBottom: '20px',
                '&:hover': { backgroundColor: '#3b5876' }
              }}
            >
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant='body2' sx={{ color: '#666' }}>
                Já tem uma conta?{' '}
                <Link 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/login');
                  }}
                  sx={{ color: '#213448', fontWeight: 600 }}
                >
                  Faça login
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

