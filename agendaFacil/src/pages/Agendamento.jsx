import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { api } from '../services/api';

export default function Agendamento() {
  const { prestadorId, servicoId } = useParams();
  const navigate = useNavigate();
  const [prestador, setPrestador] = useState(null);
  const [servico, setServico] = useState(null);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [formData, setFormData] = useState({
    data_agendamento: null,
    hora_inicio: null,
    observacoes: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        
        // Buscar prestador
        const prestadorResponse = await api.prestadores.buscarPorId(prestadorId);
        if (prestadorResponse.success) {
          setPrestador(prestadorResponse.data);
        }

        // Buscar serviço
        const servicoResponse = await api.servicos.buscarPorId(servicoId);
        if (servicoResponse.success) {
          setServico(servicoResponse.data);
        }
      } catch (err) {
        setError(err.message || 'Erro ao carregar dados');
        console.error('Erro ao carregar dados:', err);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [prestadorId, servicoId]);

  useEffect(() => {
    const buscarHorarios = async () => {
      if (formData.data_agendamento && servico) {
        try {
          const dataFormatada = dayjs(formData.data_agendamento).format('YYYY-MM-DD');
          const response = await api.prestadores.horariosDisponiveis(
            prestadorId,
            dataFormatada,
            servico.duracao
          );
          if (response.success) {
            setHorariosDisponiveis(response.data || []);
          }
        } catch (err) {
          console.error('Erro ao buscar horários:', err);
          setHorariosDisponiveis([]);
        }
      }
    };

    buscarHorarios();
  }, [formData.data_agendamento, servico, prestadorId]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setError(null);
  };

  const calcularHoraFim = (horaInicio, duracao) => {
    if (!horaInicio || !duracao) return null;
    return dayjs(horaInicio).add(duracao, 'minute');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    if (!usuario) {
      setError('Por favor, faça login para agendar.');
      navigate('/login');
      return;
    }

    try {
      const dataFormatada = dayjs(formData.data_agendamento).format('YYYY-MM-DD');
      const horaInicioFormatada = dayjs(formData.hora_inicio).format('HH:mm:ss');
      const horaFimFormatada = calcularHoraFim(formData.hora_inicio, servico.duracao).format('HH:mm:ss');

      const dadosAgendamento = {
        cliente_id: usuario.id,
        prestador_id: parseInt(prestadorId),
        servico_id: parseInt(servicoId),
        data_agendamento: dataFormatada,
        hora_inicio: horaInicioFormatada,
        hora_fim: horaFimFormatada,
        observacoes: formData.observacoes,
        valor_total: parseFloat(servico.preco)
      };

      const response = await api.agendamentos.criar(dadosAgendamento);
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/meus-agendamentos');
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Erro ao criar agendamento. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !prestador && !servico) {
    return (
      <Container sx={{ padding: '40px' }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <Card sx={{ boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ padding: '40px' }}>
          <Typography variant='h4' sx={{ textAlign: 'center', color: '#213448', fontWeight: 600, marginBottom: '30px' }}>
            Novo Agendamento
          </Typography>

          {prestador && servico && (
            <Box sx={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
              <Typography variant='h6' sx={{ color: '#213448', marginBottom: '8px' }}>
                {prestador.nome_estabelecimento}
              </Typography>
              <Typography variant='body1' sx={{ color: '#666', marginBottom: '4px' }}>
                Serviço: {servico.nome}
              </Typography>
              <Typography variant='body1' sx={{ color: '#666', marginBottom: '4px' }}>
                Duração: {servico.duracao} minutos
              </Typography>
              <Typography variant='h6' sx={{ color: '#213448', marginTop: '8px' }}>
                Valor: R$ {parseFloat(servico.preco).toFixed(2)}
              </Typography>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ marginBottom: '20px' }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ marginBottom: '20px' }}>
              Agendamento criado com sucesso! Redirecionando...
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Data do Agendamento"
                    value={formData.data_agendamento}
                    onChange={(value) => handleChange('data_agendamento', value)}
                    minDate={dayjs()}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  {formData.data_agendamento && horariosDisponiveis.length > 0 ? (
                    <FormControl fullWidth required>
                      <InputLabel>Horário Disponível</InputLabel>
                      <Select
                        value={formData.hora_inicio ? dayjs(formData.hora_inicio).format('HH:mm') : ''}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(':');
                          const selectedDate = dayjs(formData.data_agendamento)
                            .hour(parseInt(hours))
                            .minute(parseInt(minutes));
                          handleChange('hora_inicio', selectedDate);
                        }}
                        label="Horário Disponível"
                      >
                        {horariosDisponiveis.map((horario) => (
                          <MenuItem key={horario.horario_disponivel} value={horario.horario_disponivel}>
                            {horario.horario_disponivel}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : formData.data_agendamento ? (
                    <Alert severity="info">
                      Nenhum horário disponível para esta data. Selecione outra data.
                    </Alert>
                  ) : (
                    <TextField
                      fullWidth
                      label="Horário"
                      value=""
                      disabled
                      helperText="Selecione uma data primeiro"
                    />
                  )}
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Observações (opcional)"
                    name="observacoes"
                    multiline
                    rows={4}
                    value={formData.observacoes}
                    onChange={(e) => handleChange('observacoes', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={submitting || success || !formData.data_agendamento || !formData.hora_inicio}
                    sx={{
                      backgroundColor: '#213448',
                      padding: '12px',
                      '&:hover': { backgroundColor: '#3b5876' }
                    }}
                  >
                    {submitting ? 'Agendando...' : 'Confirmar Agendamento'}
                  </Button>
                </Grid>
              </Grid>
            </LocalizationProvider>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

