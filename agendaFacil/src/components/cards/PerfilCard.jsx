import {Card, CardContent, CardMedia, Typography, CardActionArea, Rating, Box} from '@mui/material';

export default function PerfilCard({nome, descricao, profissao, categoria, imagem}) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={imagem}
          alt={nome}        />

        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography gutterBottom variant="h5" component="div">
           {nome}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
           {profissao}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.primary', fontSize:16}}>
              {descricao}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Rating name="read-only" value={5} readOnly size="small" />
            <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
              (64)
            </Typography>
          </Box>
          <Typography gutterBottom variant="body1" sx={{ color: 'text.secondary' }}>
            {categoria}
          </Typography>

        </CardContent>
      </CardActionArea>
    </Card>
  );
}
