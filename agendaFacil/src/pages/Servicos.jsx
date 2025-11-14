import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PerfilCard from '../components/cards/PerfilCard';
import BarraDePesquisa from '../components/search/BarraDePesquisa'
import { 
  Typography, 
  Grid, 
  Box,
  CircularProgress, 
  Alert
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
          console.log('Dados Recebidos:', response.data);
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
      <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', width: '90%', gap:'13rem', paddingBottom:'20px' }}>
        <Typography variant='h4' sx={{color: '#213448', fontWeight: 600}}>
        {categoriaNome}
        </Typography>
        <BarraDePesquisa />
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
          <Alert severity="info">Nenhum prestador encontrado para esta categoria.</Alert>
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
          {prestadores.map((prestador) => (
            <Grid item key={prestador.id} xs={12} sm={6} md={4}>
              

              <PerfilCard nome={prestador.nome_estabelecimento}
              // profissao={}
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