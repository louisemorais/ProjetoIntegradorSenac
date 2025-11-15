import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ServicosCard from '../components/cards/ServicosCard';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Rating,
  Chip,
  Divider,
  Container,
  Tab,
  Tabs,
  Avatar,
  Stack
} from '@mui/material';
import { api } from '../services/api';
import { Height } from '@mui/icons-material';

export default function DetalhesPrestador() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prestador, setPrestador] = useState(null);
  const [servicos, setServicos] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [valueTab, setValueTab] = useState(0);

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

  const handleChangeTab = (event, newValue) => {
    setValueTab(newValue);
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

  function CustomTabPanel(props) {
      const { children, value, index, ...other } = props;

      return (
        <div
          role="tabpanel"
          hidden={value !== index}
          id={`simple-tabpanel-${index}`}
          aria-labelledby={`simple-tab-${index}`}
          {...other}
        >
          {value === index && <Box sx={{ paddingTop: 3 }}>{children}</Box>}
        </div>
      );
  }

  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
        width: '80px',
        height: '80px'
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  }

  return (
    <Container maxWidth="lg" sx={{ padding: '40px' }}>

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

        <Box sx={{ width: "100%" }}>
          <Tabs value={valueTab} onChange={handleChangeTab} >
            <Tab label="Serviços" sx={{color:'#000000'}}/>
            <Tab label="Feedbacks" sx={{color:'#000000'}}/>
          </Tabs>

         <Divider sx={{ width: "28%", borderBottomWidth: 3, borderColor: "#373535ff", paddingTop:'13px' }} />


          <CustomTabPanel value={valueTab} index={0}>  
              {servicos.length === 0 ? (
                  <Alert severity="info">Nenhum serviço disponível no momento.</Alert>
                  ) : (
                  <Grid container spacing={3}>
                    {servicos.map((servico) => (
                      <Grid item xs={12} sm={6} md={4} key={servico.id}>

                        <ServicosCard nome={servico.nome} descricao={servico.descricao} 
                                      duracao={servico.duracao} 
                                      preco={servico.preco}
                                      funcao={() => handleAgendar(servico.id)}
                                      />
                      </Grid>
                    ))}
                  </Grid>
                )}

          </CustomTabPanel>

          <CustomTabPanel value={valueTab} index={1}>
            
              {avaliacoes.length > 0 && (
                <Box>
                  <Typography variant='h6' sx={{ color: '#213448', fontWeight: 600, marginBottom: '24px' }}>
                    Todas as avaliações ({prestador.total_avaliacoes})
                  </Typography>
                  
                  <Grid container spacing={2}>
                    {avaliacoes.map((avaliacao) => (
                      <Grid item xs={12} key={avaliacao.id}>
                        <Card sx={{backgroundColor:'#D9D9D9' ,boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius:'13px' }}>
                          <CardContent sx={{display:'flex', gap:3}}>
                              <Box>
                                    <Avatar {...stringAvatar(avaliacao.cliente_nome)} />
                              </Box>

                             <Box sx={{display:'flex', flexDirection:'column', gap:'5px'}}>
                               <Box sx={{ display: 'flex', alignItems: 'center'}}>
                                <Typography variant='h6' sx={{ color: '#373535ff', fontWeight:600 }}>
                                  {avaliacao.cliente_nome}
                                </Typography>
                                </Box>
                                
                                  {avaliacao.comentario && (
                                    <Typography variant='body2' sx={{ color: '#666' }}>
                                      {avaliacao.comentario}
                                    </Typography>
                                  )}
                                <Box sx={{display:'flex', gap:1 }} >
                                  <Rating value={avaliacao.nota} readOnly size="small" />
                                    <Typography variant='body2' sx={{ color: '#666' }}>
                                      {(parseFloat(prestador.avaliacao_media) || 0).toFixed(1)}
                                  </Typography>
                              </Box>
                             </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

          </CustomTabPanel>
        </Box>
        
        
      </Box>

    </Container>
  );
}