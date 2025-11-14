import './Home.css';
import { Typography, Grid, Box } from '@mui/material';
import CategoriaCard from '../components/cards/CategoriaCard'
import Saude from '../imgs/category/saude.png'
import Arte from '../imgs/category/arte.jpg'
import Beleza from '../imgs/category/beleza.jpg'
import SocialMedia from '../imgs/category/socialMedia.jpg'

export default function Home() {

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
      
    </div>
  );
}