import { Card, CardContent, CardMedia, Typography, CardActionArea, Rating, Box, Chip } from '@mui/material';

export default function PerfilCard({ nome, descricao, profissao, categoria, imagem, avaliacao, avaliacaoCount, rota }) {
  const descricaoFormatada = descricao && descricao.length > 100 
    ? `${descricao.substring(0, 100)}...` 
    : descricao;
  
  const avaliacaoValue = parseFloat(avaliacao) || 0;

  return (
    <Card 
      sx={{ 
        maxWidth: 345,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 25px rgba(0,0,0,0.15)',
        }
      }}
    >
      <CardActionArea 
        onClick={rota}
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      >
        {}
        <Box sx={{ position: 'relative', width: '100%' }}>
          <CardMedia
            component="img"
            height="200"
            image={imagem}
            alt={nome}
            sx={{
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              }
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'placeholder.com'; // tem que colocar link pro target mas da pra deixar assim msm pq nao vai dar erro n risos
            }}
          />
          
          {}
          {categoria && (
            <Chip
              label={categoria.toUpperCase()}
              size="small"
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                color: '#2563EB',
                fontWeight: 700,
                fontSize: '10px',
                letterSpacing: '0.5px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                border: 'none',
              }}
            />
          )}
        </Box>

        {}
        <CardContent 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 1.5,
            padding: '20px',
            flexGrow: 1,
          }}
        >
          {}
          <Typography 
            gutterBottom 
            variant="h6" 
            component="div"
            sx={{
              color: '#213448',
              fontWeight: 700,
              fontSize: '18px',
              lineHeight: 1.3,
              marginBottom: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {nome}
          </Typography>

          {}
          {profissao && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#64748B',
                fontWeight: 500,
                fontSize: '14px',
              }}
            >
              {profissao}
            </Typography>
          )}

          {}
          {descricao && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#475569', 
                fontSize: '14px',
                lineHeight: 1.6, 
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                minHeight: '63px',
              }}
            >
              {descricaoFormatada}
            </Typography>
          )}

          {}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              marginTop: 'auto', 
              paddingTop: '12px',
              borderTop: '1px solid #E5E7EB',
            }}
          >
            <Rating 
              name="read-only" 
              value={avaliacaoValue} 
              readOnly 
              size="small" 
              precision={0.1}
              sx={{
                '& .MuiRating-iconFilled': {
                  color: '#FFA500', //
                },
                '& .MuiRating-iconEmpty': {
                  color: '#E0E0E0',
                },
              }}
            />
            <Typography 
              variant="body2" 
              sx={{ 
                ml: 1.5, 
                color: '#64748B',
                fontWeight: 500,
                fontSize: '13px',
              }}
            >
              {avaliacaoValue > 0 
                ? `${avaliacaoValue.toFixed(1)} (${avaliacaoCount || 0} ${avaliacaoCount === 1 ? 'avaliação' : 'avaliações'})`
                : '0.0 (0 avaliações)'
              }
            </Typography>
          </Box>

          {}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              color: '#2563EB',
              fontWeight: 600,
              fontSize: '14px',
              paddingTop: '8px',
              transition: 'gap 0.2s ease',
              '&:hover': {
                gap: 1.5,
              },
            }}
          >
            <span>Ver detalhes</span>
            <span>→</span>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}