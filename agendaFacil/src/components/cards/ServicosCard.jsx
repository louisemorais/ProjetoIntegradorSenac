import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Card,
  CardContent,
  Box
} from '@mui/material';
import Botao from '../button/Botao';

export default function ServicosCard({nome, descricao, duracao, preco, funcao}){
return(
    <>
        <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)', width:'600px'}}>
            <CardContent sx={{display:'flex', justifyContent:'space-between'}} >
                
                    <Box>
                        <Typography variant='h6' sx={{ color: '#213448', fontWeight: 600, marginBottom: '8px' }}>
                        {nome}
                        </Typography>
                        
                        <Typography variant='h6' sx={{ color: '#045F40', fontWeight: 600,}}>
                        R$ {parseFloat(preco).toFixed(2)}
                        </Typography>
                    </Box>

                    <Box sx={{display: 'flex', flexDirection:'column',justifyContent:'center'}}>
                        <Botao nome={'Agendar'} onclick={funcao} />
                    </Box>
            </CardContent>
        </Card>
    </>
)
}