import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

export default function CategoriaCard({ title, image}) {
  const baseCard = {
    width: 270,
    height: 400,
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
  };

  return (
    
    <Card sx={baseCard}>
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
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