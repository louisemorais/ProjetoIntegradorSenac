import { Box,Typography, Card} from '@mui/material';
import { Link } from 'react-router-dom';


export default function CategoriaCard({ title, image, color, rota}) {
  const rotaCard = '/servicos/' + title.replace(/\s+/g, '').toLowerCase();
  const rotaFinal = rota || rotaCard;

  const baseCard = {
    width: 350,
    height: 320,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
    },
    backgroundImage: `url(${image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    textDecoration: 'none',
  };

  return (
    
    <Card sx={baseCard} component={Link} to={rotaFinal}>
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: `${color}`,
            opacity: 0.3,
            pointerEvents: 'none',
          }}
        />
          <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
          }}>
              <Typography variant="h4"
              sx={{
                  color: '#fff',
                  fontWeight: 'bold',
                  textAlign: 'center'
              }}
              >
              {title}
              </Typography>
          </Box>
    </Card>
  );
}