import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Rating,
  Chip,
  Divider,
  Container
} from '@mui/material';
import { api } from '../services/api';

export default function DetalhesPrestador() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prestador, setPrestador] = useState(null);
  const [servicos, setServicos] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        
        // Buscar prestador
        const prestadorResponse = await api.prestadores.buscarPorId(id);
        if (prestadorResponse.success) {
          setPrestador(prestadorResponse.data);
        }

        // Buscar serviços
        const servicosResponse = await api.prestadores.servicos(id);
        if (servicosResponse.success) {
          setServicos(servicosResponse.data);
        }

        // Buscar avaliações
        const avaliacoesResponse = await api.prestadores.avaliacoes(id);
        if (avaliacoesResponse.success) {
          setAvaliacoes(avaliacoesResponse.data);
        }
      } catch (err) {
        setError(err.message || 'Erro ao carregar dados do prestador');
        console.error('Erro ao carregar dados:', err);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [id]);

  const handleAgendar = (servicoId) => {
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    if (!usuario) {
      alert('Por favor, faça login para agendar um serviço.');
      navigate('/login');
      return;
    }
    navigate(`/agendamento/${id}/${servicoId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !prestador) {
    return (
      <Container sx={{ padding: '40px' }}>
        <Alert severity="error">{error || 'Prestador não encontrado'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ padding: '40px' }}>
      {}
      <Card sx={{ marginBottom: '40px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ padding: '40px' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant='h4' sx={{ color: '#213448', fontWeight: 600, marginBottom: '16px' }}>
                {prestador.nome_estabelecimento}
              </Typography>
              
              <Chip 
                label={prestador.categoria} 
                sx={{ marginBottom: '16px', backgroundColor: '#213448', color: 'white' }}
              />
              
              {prestador.avaliacao_media > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: '16px' }}>
                  <Rating value={prestador.avaliacao_media} precision={0.1} readOnly />
                  <Typography variant='body1' sx={{ color: '#666' }}>
                    {(parseFloat(prestador.avaliacao_media) || 0).toFixed(1)} ({prestador.total_avaliacoes} avaliações)
                  </Typography>
                </Box>
              )}
              
              {prestador.descricao && (
                <Typography variant='body1' sx={{ color: '#666', marginBottom: '16px' }}>
                  {prestador.descricao}
                </Typography>
              )}
              
              <Divider sx={{ marginY: '16px' }} />
              
              <Typography variant='body2' sx={{ color: '#666', marginBottom: '8px' }}>
                📍 {prestador.endereco}, {prestador.cidade} - {prestador.estado}
              </Typography>
              
              <Typography variant='body2' sx={{ color: '#666', marginBottom: '8px' }}>
                🕐 {prestador.horario_abertura} - {prestador.horario_fechamento}
              </Typography>
              
              {prestador.aceita_pagamento_online && (
                <Typography variant='body2' sx={{ color: '#4caf50', marginTop: '8px' }}>
                  ✓ Aceita pagamento online via PIX e Cartão
                </Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Serviços */}
      <Box sx={{ marginBottom: '40px' }}>
        <Typography variant='h5' sx={{ color: '#213448', fontWeight: 600, marginBottom: '24px' }}>
          Serviços Disponíveis
        </Typography>
        
        {servicos.length === 0 ? (
          <Alert severity="info">Nenhum serviço disponível no momento.</Alert>
        ) : (
          <Grid container spacing={3}>
            {servicos.map((servico) => (
              <Grid item xs={12} sm={6} md={4} key={servico.id}>
                <Card sx={{ height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <CardContent>
                    <Typography variant='h6' sx={{ color: '#213448', fontWeight: 600, marginBottom: '8px' }}>
                      {servico.nome}
                    </Typography>
                    
                    {servico.descricao && (
                      <Typography variant='body2' sx={{ color: '#666', marginBottom: '12px' }}>
                        {servico.descricao}
                      </Typography>
                    )}
                    
                    <Typography variant='body2' sx={{ color: '#666', marginBottom: '8px' }}>
                      ⏱️ Duração: {servico.duracao} minutos
                    </Typography>
                    
                    <Typography variant='h6' sx={{ color: '#213448', fontWeight: 600, marginBottom: '16px' }}>
                      R$ {parseFloat(servico.preco).toFixed(2)}
                    </Typography>
                    
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleAgendar(servico.id)}
                      sx={{
                        backgroundColor: '#213448',
                        '&:hover': { backgroundColor: '#3b5876' }
                      }}
                    >
                      Agendar
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Avaliações */}
      {avaliacoes.length > 0 && (
        <Box>
          <Typography variant='h5' sx={{ color: '#213448', fontWeight: 600, marginBottom: '24px' }}>
            Avaliações
          </Typography>
          
          <Grid container spacing={2}>
            {avaliacoes.map((avaliacao) => (
              <Grid item xs={12} key={avaliacao.id}>
                <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: '8px' }}>
                      <Rating value={avaliacao.nota} readOnly size="small" />
                      <Typography variant='body2' sx={{ color: '#666' }}>
                        {avaliacao.cliente_nome}
                      </Typography>
                    </Box>
                    
                    {avaliacao.comentario && (
                      <Typography variant='body2' sx={{ color: '#666' }}>
                        {avaliacao.comentario}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
}