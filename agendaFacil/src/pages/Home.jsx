import './Home.css';
import { Typography, Grid, Box, CircularProgress, Alert } from '@mui/material';
import { useState, useEffect } from 'react';
import CategoriaCard from '../components/cards/CategoriaCard'
import Footer from '../components/footer/Footer'
import Saude from '../imgs/category/saude.png'
import Arte from '../imgs/category/arte.jpg'
import Beleza from '../imgs/category/beleza.jpg'
import SocialMedia from '../imgs/category/socialMedia.jpg'
import { api } from '../services/api';

export default function Home() {
  const [prestadoresDestaque, setPrestadoresDestaque] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categorias = [{
    id: 1, nome: 'Beleza', image: Beleza, cor:'#DAA0A0'
  }, 
  {
    id: 2, nome: 'Saude', image: Saude, cor:'#5F84FF'
  }, 
  {
    id: 3, nome: 'Arte', image: Arte, cor:'#DBD958'
  },
   {
    id: 4, nome: 'Social Media', image: SocialMedia, cor:'#895FDE'
  }]

  useEffect(() => {
    const buscarPrestadores = async () => {
      try {
        setLoading(true);
        const response = await api.prestadores.listar();
        if (response.success) {
          // Pegar os top 3 prestadores em destaque
          setPrestadoresDestaque(response.data.slice(0, 3));
        }
      } catch (err) {
        setError(err.message || 'Erro ao carregar prestadores');
        console.error('Erro ao buscar prestadores:', err);
      } finally {
        setLoading(false);
      }
    };

    buscarPrestadores();
  }, []);

  return (
    <div>
      <section className="home-section">
        <div className='overlay'>
           <Typography variant='h2' sx={{color:'#FFFFFF'}}>Agenda Fácil</Typography>
            <Typography variant='h5' sx={{color:'#FFFFFF'}}>Melhor plataforma de agendamento online e fácil.</Typography>
        </div>
      </section>

        <Box component={'section'} sx={{paddingTop:'50px', paddingBottom:'50px'}}>
          <Typography variant='h4' sx={{textAlign:'center', color:'#213448', fontWeight:600}}>Serviços</Typography>
          <Grid container spacing={5} sx={{padding:'40px', justifyContent:'center'}}>
            {categorias.map((card)=>(
              <CategoriaCard key={card.id} title={card.nome} image={card.image} color={card.cor}/>
            ))}
          </Grid>
        </Box>

        {prestadoresDestaque.length > 0 && (
          <Box component={'section'} sx={{paddingTop:'50px', paddingBottom:'50px', backgroundColor:'#f5f5f5'}}>
            <Typography variant='h4' sx={{textAlign:'center', color:'#213448', fontWeight:600, marginBottom:'40px'}}>
              Prestadores em Destaque
            </Typography>
            {loading ? (
              <Box sx={{display:'flex', justifyContent:'center', padding:'40px'}}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Box sx={{padding:'40px'}}>
                <Alert severity="warning">{error}</Alert>
              </Box>
            ) : (
              <Grid container spacing={3} sx={{padding:'40px', justifyContent:'center'}}>
                {prestadoresDestaque.map((prestador) => (
                  <Grid item key={prestador.id}>
                    <Box sx={{
                      backgroundColor:'white',
                      padding:'20px',
                      borderRadius:'8px',
                      boxShadow:'0 2px 8px rgba(0,0,0,0.1)',
                      maxWidth:'300px'
                    }}>
                      <Typography variant='h6' sx={{color:'#213448', fontWeight:600}}>
                        {prestador.nome_estabelecimento}
                      </Typography>
                      <Typography variant='body2' sx={{color:'#666', marginTop:'8px'}}>
                        {prestador.categoria}
                      </Typography>
                      <Typography variant='body2' sx={{color:'#666', marginTop:'4px'}}>
                        {prestador.cidade}, {prestador.estado}
                      </Typography>
                      {Number(prestador.avaliacao_media) > 0 ? (
                        <Typography variant='body2' sx={{color:'#ff9800', marginTop:'8px'}}>
                          ⭐ {Number(prestador.avaliacao_media).toFixed(1)} ({prestador.total_avaliacoes || 0} avaliações)
                        </Typography>
                      ) : (
                        <Typography variant='body2' sx={{color:'#888', marginTop:'8px'}}>
                          ⭐ Sem avaliações
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}

        <Footer />
      
    </div>
  );
}