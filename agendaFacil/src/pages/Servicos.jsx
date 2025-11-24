import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import PerfilCard from '../components/cards/PerfilCard';
import BarraDePesquisa from '../components/search/BarraDePesquisa';
import { 
  Typography, 
  Grid, 
  Box, 
  CircularProgress, 
  Alert,
  Chip,
  Container,
  Paper
} from '@mui/material';
import { api } from '../services/api';

export default function Servicos() {
  const { categoria } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [prestadores, setPrestadores] = useState([]);
  const [prestadoresFiltrados, setPrestadoresFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoriaAtiva, setCategoriaAtiva] = useState('todas');

  // Lê query string do input do search
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search')?.toLowerCase() || '';

  // Categorias disponíveis
  const categorias = [
    { valor: 'todas', label: 'Todas as Categorias' },
    { valor: 'beleza', label: 'Beleza' },
    { valor: 'saude', label: 'Saúde' },
    { valor: 'arte', label: 'Arte' },
    { valor: 'socialmedia', label: 'Social Media' },
    { valor: 'servicostecnicos', label: 'Serviços Técnicos' }
  ];

  useEffect(() => {
    const buscarPrestadores = async () => {
      try {
        setLoading(true);
        setError(null);

        // Mapeia categorias do frontend para backend
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
          setPrestadores(response.data);
          setPrestadoresFiltrados(response.data);
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

  // Filtrar prestadores quando mudar a busca ou categoria, ficou redundante com a barra mas dalhe, deixa as duas formas, coloquei um clear caso n ache nada
  useEffect(() => {
    let resultado = [...prestadores];

    // Filtro por busca
    if (searchQuery) {
      resultado = resultado.filter(
        s =>
          s.nome_estabelecimento.toLowerCase().includes(searchQuery) ||
          s.categoria.toLowerCase().includes(searchQuery) ||
          s.descricao?.toLowerCase().includes(searchQuery)
      );
    }

    // Filtro por categoria
    if (categoriaAtiva !== 'todas') {
      const categoriaMap = {
        'beleza': 'Beleza',
        'saude': 'Saúde',
        'arte': 'Arte',
        'socialmedia': 'Social Media',
        'servicostecnicos': 'Serviços Técnicos'
      };
      
      const categoriaFiltro = categoriaMap[categoriaAtiva];
      resultado = resultado.filter(
        p => p.categoria.toLowerCase() === categoriaFiltro.toLowerCase()
      );
    }

    setPrestadoresFiltrados(resultado);
  }, [searchQuery, categoriaAtiva, prestadores]);

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
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #F9FAFB 0%, #F3F4F6 100%)',
    }}>
      {}
      <Paper
        elevation={0}
        sx={{
          backgroundColor: 'white',
          borderBottom: '1px solid #E5E7EB',
          marginBottom: '40px',
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ padding: '40px 0' }}>
            {}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    color: '#213448',
                    fontWeight: 700,
                    marginBottom: '8px',
                  }}
                >
                  {categoriaNome}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#64748B',
                  }}
                >
                  Encontre os melhores prestadores de serviço
                </Typography>
              </Box>

              <Box sx={{ minWidth: '300px' }}>
                <BarraDePesquisa />
              </Box>
            </Box>

            {}
            <Box
              sx={{
                display: 'flex',
                gap: 1.5,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {categorias.map((cat) => (
                <Chip
                  key={cat.valor}
                  label={cat.label}
                  onClick={() => setCategoriaAtiva(cat.valor)}
                  sx={{
                    fontWeight: 600,
                    fontSize: '14px',
                    padding: '8px 4px',
                    height: 'auto',
                    backgroundColor: categoriaAtiva === cat.valor ? '#2563EB' : 'white',
                    color: categoriaAtiva === cat.valor ? 'white' : '#64748B',
                    border: categoriaAtiva === cat.valor ? 'none' : '1px solid #E5E7EB',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: categoriaAtiva === cat.valor ? '#1D4ED8' : '#F3F4F6',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    },
                  }}
                />
              ))}
            </Box>

            {}
            {(searchQuery || categoriaAtiva !== 'todas') && (
              <Box sx={{ marginTop: '16px', textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  {prestadoresFiltrados.length} serviço(s) encontrado(s)
                </Typography>
              </Box>
            )}
          </Box>
        </Container>
      </Paper>

      {}
      <Container maxWidth="xl">
        <Box sx={{ paddingBottom: '60px' }}>
          {loading ? (
            
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '80px 0',
              }}
            >
              <CircularProgress size={60} sx={{ color: '#2563EB' }} />
              <Typography
                variant="body1"
                sx={{ marginTop: '16px', color: '#64748B' }}
              >
                Carregando serviços...
              </Typography>
            </Box>
          ) : error ? (
            
            <Box sx={{ padding: '40px' }}>
              <Alert severity="error" sx={{ maxWidth: '600px', margin: '0 auto' }}>
                {error}
              </Alert>
            </Box>
          ) : prestadoresFiltrados.length === 0 ? (
            
            <Box
              sx={{
                textAlign: 'center',
                padding: '80px 20px',
              }}
            >
              <Typography variant="h1" sx={{ fontSize: '72px', marginBottom: '16px' }}>
                🔍
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: '#213448',
                  fontWeight: 600,
                  marginBottom: '12px',
                }}
              >
                Nenhum serviço encontrado
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: '#64748B', marginBottom: '24px' }}
              >
                Tente buscar por outros termos ou alterar os filtros
              </Typography>
              <Chip
                label="Limpar filtros"
                onClick={() => {
                  setCategoriaAtiva('todas');
                  navigate('/servicos');
                }}
                sx={{
                  backgroundColor: '#2563EB',
                  color: 'white',
                  fontWeight: 600,
                  padding: '20px 12px',
                  '&:hover': {
                    backgroundColor: '#1D4ED8',
                  },
                }}
              />
            </Box>
          ) : (
            // Grid de Cards
            <Grid container spacing={3}>
              {prestadoresFiltrados.map((prestador) => (
                <Grid item key={prestador.id} xs={12} sm={6} md={4}>
                  <PerfilCard
                    nome={prestador.nome_estabelecimento}
                    descricao={prestador.descricao}
                    categoria={prestador.categoria}
                    imagem={prestador.imagem_url}
                    avaliacao={prestador.avaliacao_media || 0}
                    avaliacaoCount={prestador.total_avaliacoes || 0}
                    rota={() => handleVerDetalhes(prestador.id)}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>
    </Box>
  );
}