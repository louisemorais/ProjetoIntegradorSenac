import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Grid, 
  Box, 
  Card, 
  CardContent, 
  CircularProgress, 
  Alert,
  Button,
  Chip,
  Rating
} from '@mui/material';
import { api } from '../services/api';

export default function Servicos() {
  const { categoria } = useParams();
  const navigate = useNavigate();
  const [prestadores, setPrestadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const buscarPrestadores = async () => {
      try {
        setLoading(true);
        // mapeia as categorias do frontend para categorias do back
        const categoriaMap = {
          'beleza': 'beleza',
          'saude': 'saude',
          'arte': 'arte',
          'socialmedia': 'social_media',
          'servicostecnicos': 'servicos_tecnicos'
        };
        
        const categoriaFormatada = categoria ? categoriaMap[categoria.toLowerCase()] || categoria.toLowerCase() : '';
        const response = await api.prestadores.listar(categoriaFormatada ? { categoria: categoriaFormatada } : {});
        if (response.success) {
          setPrestadores(response.data);
        }
      } catch (err) {
        setError(err.message || 'Erro ao carregar prestadores');
        console.error('Erro ao buscar prestadores:', err);
      } finally {
        setLoading(false);
      }
    };

    buscarPrestadores();
  }, [categoria]);

  const handleVerDetalhes = (prestadorId) => {
    navigate(`/prestador/${prestadorId}`);
  };

  const categoriaNome = categoria ? categoria.charAt(0).toUpperCase() + categoria.slice(1) : 'Todos os Serviços';

  return (
    <Box sx={{ padding: '40px', minHeight: '100vh' }}>
      <Typography variant='h4' sx={{ textAlign: 'center', color: '#213448', fontWeight: 600, marginBottom: '40px' }}>
        {categoriaNome}
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ padding: '40px' }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      ) : prestadores.length === 0 ? (
        <Box sx={{ padding: '40px', textAlign: 'center' }}>
          <Alert severity="info">Nenhum prestador encontrado para esta categoria.</Alert>
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
          {prestadores.map((prestador) => (
            <Grid item key={prestador.id} xs={12} sm={6} md={4}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
                }
              }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant='h5' sx={{ color: '#213448', fontWeight: 600, marginBottom: '8px' }}>
                    {prestador.nome_estabelecimento}
                  </Typography>
                  
                  <Chip 
                    label={prestador.categoria} 
                    size="small" 
                    sx={{ marginBottom: '12px', backgroundColor: '#213448', color: 'white' }}
                  />
                  
                  {prestador.descricao && (
                    <Typography variant='body2' sx={{ color: '#666', marginBottom: '12px' }}>
                      {prestador.descricao.length > 100 
                        ? `${prestador.descricao.substring(0, 100)}...` 
                        : prestador.descricao}
                    </Typography>
                  )}
                  
                  <Typography variant='body2' sx={{ color: '#666', marginBottom: '8px' }}>
                    📍 {prestador.endereco}, {prestador.cidade} - {prestador.estado}
                  </Typography>
                  
                  <Typography variant='body2' sx={{ color: '#666', marginBottom: '8px' }}>
                    🕐 {prestador.horario_abertura} - {prestador.horario_fechamento}
                  </Typography>
                  
                  {prestador.avaliacao_media > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: '12px' }}>
                      <Rating value={prestador.avaliacao_media} precision={0.1} readOnly size="small" />
                      <Typography variant='body2' sx={{ color: '#666' }}>
                        {(parseFloat(prestador.avaliacao_media) || 0).toFixed(1)} ({prestador.total_avaliacoes} avaliações)
                      </Typography>
                    </Box>
                  )}
                  
                  <Typography variant='body2' sx={{ color: '#666', marginBottom: '16px' }}>
                    {prestador.total_servicos} serviço(s) disponível(is)
                  </Typography>
                  
                  <Button 
                    variant="contained" 
                    fullWidth
                    onClick={() => handleVerDetalhes(prestador.id)}
                    sx={{ 
                      backgroundColor: '#213448',
                      '&:hover': { backgroundColor: '#3b5876' }
                    }}
                  >
                    Ver Detalhes
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}