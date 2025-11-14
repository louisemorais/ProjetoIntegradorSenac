import { useState, useEffect } from 'react';
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
  CircularProgress,
  Avatar,
  Grid
} from '@mui/material';
import { api } from '../services/api';

export default function Perfil() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    foto_perfil: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const carregarPerfil = async () => {
      const usuarioStorage = JSON.parse(localStorage.getItem('usuario') || 'null');
      if (!usuarioStorage) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const response = await api.usuarios.buscarPorId(usuarioStorage.id);
        if (response.success) {
          setUsuario(response.data);
          setFormData({
            nome: response.data.nome || '',
            email: response.data.email || '',
            telefone: response.data.telefone || '',
            foto_perfil: response.data.foto_perfil || ''
          });
        }
      } catch (err) {
        setError(err.message || 'Erro ao carregar perfil');
        console.error('Erro ao carregar perfil:', err);
      } finally {
        setLoading(false);
      }
    };

    carregarPerfil();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const usuarioStorage = JSON.parse(localStorage.getItem('usuario') || 'null');
      const response = await api.usuarios.atualizar(usuarioStorage.id, formData);
      if (response.success) {
        setSuccess(true);
        // Atualiza dados no localStorage
        const updatedUsuario = { ...usuarioStorage, ...formData };
        localStorage.setItem('usuario', JSON.stringify(updatedUsuario));
        setUsuario(updatedUsuario);
      }
    } catch (err) {
      setError(err.message || 'Erro ao atualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    navigate('/');
    window.location.reload();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <Card sx={{ boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ padding: '40px' }}>
          <Typography variant='h4' sx={{ textAlign: 'center', color: '#213448', fontWeight: 600, marginBottom: '30px' }}>
            Meu Perfil
          </Typography>

          {usuario && (
            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
              <Avatar
                src={formData.foto_perfil}
                sx={{ width: 120, height: 120, backgroundColor: '#213448' }}
              >
                {formData.nome.charAt(0).toUpperCase()}
              </Avatar>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ marginBottom: '20px' }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ marginBottom: '20px' }}>
              Perfil atualizado com sucesso!
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome Completo"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="URL da Foto de Perfil"
                  name="foto_perfil"
                  value={formData.foto_perfil}
                  onChange={handleChange}
                  placeholder="https://sobranadaprobetinha.com/foto.jpg"
                />
              </Grid>

              {usuario && (
                <Grid item xs={12}>
                  <Typography variant='body2' sx={{ color: '#666' }}>
                    Tipo de Usuário: {usuario.tipo_usuario}
                  </Typography>
                </Grid>
              )}

              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={saving}
                  sx={{
                    backgroundColor: '#213448',
                    padding: '12px',
                    marginBottom: '16px',
                    '&:hover': { backgroundColor: '#3b5876' }
                  }}
                >
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  onClick={handleLogout}
                  sx={{ padding: '12px' }}
                >
                  Sair
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}