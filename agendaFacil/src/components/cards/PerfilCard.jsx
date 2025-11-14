import {Card, CardContent, CardMedia, Typography, CardActionArea, Rating, Box} from '@mui/material';

export default function PerfilCard({nome, descricao, profissao, categoria, imagem, avaliacao, avaliacaoCount}) {

  const descricaoFormatada = descricao && descricao.length > 100 ? `${descricao.substring(0, 100)}...` : descricao;

  const avaliacaoValue = parseFloat(avaliacao) || 0;

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

          {descricao && (
            <Typography variant="body2" sx={{ color: 'text.primary', fontSize:16}}>
              {descricaoFormatada}
            </Typography>
          )}

          {avaliacaoValue > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Rating name="read-only" value={avaliacao} readOnly size="small" precision={0.1}/>
              <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                {avaliacaoValue.toFixed(1)} ({avaliacaoCount || 0 } avaliações)
              </Typography>

            </Box>
          )}

          <Typography gutterBottom variant="body2" sx={{ color: 'text.secondary'}}>
            {categoria.toUpperCase()}
          </Typography>

        </CardContent>
      </CardActionArea>
    </Card>
  );
}
