import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import PerfilCard from '../components/cards/PerfilCard';
import BarraDePesquisa from '../components/search/BarraDePesquisa';
import { Typography, Grid, Box, CircularProgress, Alert } from '@mui/material';
import { api } from '../services/api';

export default function Servicos() {
  const { categoria } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [prestadores, setPrestadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lê query string do input do search
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search')?.toLowerCase() || '';

  useEffect(() => {
    const buscarPrestadores = async () => {
      try {
        setLoading(true);

        // Mapeia categorias do frontend para backend de forma correta agora
        const categoriaMap = {
          'beleza': 'Beleza',
          'saude': 'Saúde',
          'arte': 'Arte',
          'socialmedia': 'Social Media',
          'servicostecnicos': 'Serviços Técnicos'
        };
        
        const categoriaFormatada = categoria ? categoriaMap[categoria.toLowerCase()] || categoria.toLowerCase() : '';
        const response = await api.prestadores.listar(categoriaFormatada ? { categoria: categoriaFormatada } : {});

        if (response.success) {
          let data = response.data;

          // Filtra pela query de busca se existir
          if (searchQuery) {
            data = data.filter(
              s =>
                s.nome_estabelecimento.toLowerCase().includes(searchQuery) ||
                s.categoria.toLowerCase().includes(searchQuery)
            );
          }

          setPrestadores(data);
        }
      } catch (err) {
        setError(err.message || 'Erro ao carregar prestadores');
        console.error('Erro ao buscar prestadores:', err);
      } finally {
        setLoading(false);
      }
    };

    buscarPrestadores();
  }, [categoria, searchQuery]);

  const handleVerDetalhes = (prestadorId) => {
    navigate(`/prestador/${prestadorId}`);
  };

  const formatarCategoriaNome = (texto) => {
    if (!texto) return '';
    return texto
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([a-z]{2,})(?=[A-Z])/g, '$1 ')
      .replace(/(servicos|tecnicos|todas|categorias|social|media)/gi, ' $1 ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase()
      .replace(/(?:^|\s)\S/g, (l) => l.toUpperCase());
  };

  const categoriaNome = categoria ? formatarCategoriaNome(categoria) : 'Todos os Serviços';

  return (
    <Box sx={{ padding: '40px', minHeight: '100vh' }}>
      
      <Box sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginBottom: '30px',
      }}>
        <Typography variant="h4" sx={{ color: '#213448', fontWeight: 600, textAlign: 'center' }}>
          {categoriaNome}
        </Typography>
        <Box sx={{ position: 'absolute', right: 40, top: '50%', transform: 'translateY(-50%)' }}>
          <BarraDePesquisa />
        </Box>
      </Box>

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
          <Alert severity="info">Nenhum prestador encontrado.</Alert>
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
          {prestadores.map((prestador) => (
            <Grid item key={prestador.id} xs={12} sm={6} md={4}>
              <PerfilCard
                nome={prestador.nome_estabelecimento}
                descricao={prestador.descricao}
                categoria={prestador.categoria}
                imagem={prestador.imagem_url}
                avaliacao={prestador.avaliacao_media}
                avaliacaoCount={prestador.total_avaliacoes}
                rota={() => handleVerDetalhes(prestador.id)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}