import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Container,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material';
import { api } from '../services/api';

export default function MeusAgendamentos() {
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [agendamentoParaCancelar, setAgendamentoParaCancelar] = useState(null);
  const [motivoCancelamento, setMotivoCancelamento] = useState('');

  useEffect(() => {
    const carregarAgendamentos = async () => {
      const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
      if (!usuario) {
        setError('Por favor, faça login para ver seus agendamentos.');
        return;
      }

      try {
        setLoading(true);
        const response = await api.agendamentos.listar({ cliente_id: usuario.id });
        if (response.success) {
          setAgendamentos(response.data);
        }
      } catch (err) {
        setError(err.message || 'Erro ao carregar agendamentos');
        console.error('Erro ao carregar agendamentos:', err);
      } finally {
        setLoading(false);
      }
    };

    carregarAgendamentos();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pendente: 'warning',
      confirmado: 'info',
      em_andamento: 'primary',
      concluido: 'success',
      cancelado: 'error',
      nao_compareceu: 'error'
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pendente: 'Pendente',
      confirmado: 'Confirmado',
      em_andamento: 'Em Andamento',
      concluido: 'Concluído',
      cancelado: 'Cancelado',
      nao_compareceu: 'Não Compareceu'
    };
    return labels[status] || status;
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const formatarHora = (hora) => {
    return hora.substring(0, 5);
  };

  const handleCancelarClick = (agendamento) => {
    setAgendamentoParaCancelar(agendamento);
    setCancelDialogOpen(true);
  };

  const handleCancelarConfirmar = async () => {
    if (!agendamentoParaCancelar || !motivoCancelamento) return;

    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    try {
      await api.agendamentos.atualizarStatus(
        agendamentoParaCancelar.agendamento_id,
        'cancelado',
        motivoCancelamento,
        usuario.id
      );
      
      // Atualizar lista
      const response = await api.agendamentos.listar({ cliente_id: usuario.id });
      if (response.success) {
        setAgendamentos(response.data);
      }
      
      setCancelDialogOpen(false);
      setAgendamentoParaCancelar(null);
      setMotivoCancelamento('');
    } catch (err) {
      alert('Erro ao cancelar agendamento: ' + err.message);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ padding: '40px', minHeight: '80vh' }}>
      <Typography variant='h4' sx={{ textAlign: 'center', color: '#213448', fontWeight: 600, marginBottom: '40px' }}>
        Meus Agendamentos
      </Typography>

      {error && (
        <Alert severity="error" sx={{ marginBottom: '20px' }}>
          {error}
        </Alert>
      )}

      {agendamentos.length === 0 ? (
        <Box sx={{ textAlign: 'center', padding: '40px' }}>
          <Alert severity="info">Você não possui agendamentos.</Alert>
          <Button
            variant="contained"
            sx={{ marginTop: '20px', backgroundColor: '#213448', '&:hover': { backgroundColor: '#3b5876' } }}
            onClick={() => navigate('/')}
          >
            Buscar Serviços
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {agendamentos.map((agendamento) => (
            <Grid item xs={12} key={agendamento.agendamento_id}>
              <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <Box>
                      <Typography variant='h6' sx={{ color: '#213448', fontWeight: 600, marginBottom: '8px' }}>
                        {agendamento.servico_nome}
                      </Typography>
                      <Typography variant='body1' sx={{ color: '#666', marginBottom: '4px' }}>
                        {agendamento.prestador_nome}
                      </Typography>
                      <Typography variant='body2' sx={{ color: '#666', marginBottom: '4px' }}>
                        📅 {formatarData(agendamento.data_agendamento)} às {formatarHora(agendamento.hora_inicio)}
                      </Typography>
                      <Typography variant='body2' sx={{ color: '#666', marginBottom: '4px' }}>
                        💵 R$ {parseFloat(agendamento.valor_total).toFixed(2)}
                      </Typography>
                      {agendamento.observacoes && (
                        <Typography variant='body2' sx={{ color: '#666', marginTop: '8px' }}>
                          Observações: {agendamento.observacoes}
                        </Typography>
                      )}
                    </Box>
                    <Chip
                      label={getStatusLabel(agendamento.status)}
                      color={getStatusColor(agendamento.status)}
                      sx={{ marginLeft: '16px' }}
                    />
                  </Box>
                  
                  {['pendente', 'confirmado'].includes(agendamento.status) && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleCancelarClick(agendamento)}
                      sx={{ marginTop: '16px' }}
                    >
                      Cancelar Agendamento
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* dialogo de #cancelado */}
      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>Cancelar Agendamento</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Motivo do Cancelamento"
            value={motivoCancelamento}
            onChange={(e) => setMotivoCancelamento(e.target.value)}
            required
            sx={{ marginTop: '16px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleCancelarConfirmar}
            variant="contained"
            color="error"
            disabled={!motivoCancelamento}
          >
            Confirmar Cancelamento
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

