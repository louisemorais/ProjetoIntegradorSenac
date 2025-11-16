import { Typography, Avatar,Box } from "@mui/material";
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import AlarmOnOutlinedIcon from '@mui/icons-material/AlarmOnOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';

export default function AgendamentoResumido({imagem, nome,profissao,data, horario, local, celular}){

    function formatarData(data) {
        const textoData = new Date(data).toLocaleDateString('pt-BR', {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });

        return textoData.charAt(0).toUpperCase() + textoData.slice(1);
    }

    return(
        <>
            <Box sx={{display:'flex', gap:2}}>
                <Box>
                    <Avatar src={imagem} sx={{ width:'8rem', height:'10rem',objectFit: 'cover' }} variant="square"/>
                </Box>

                <Box sx={{display:'flex', flexDirection:'column', gap:3}}>
                    <Box>
                        <Typography variant="h5">
                            {nome}
                        </Typography>

                        <Typography variant="body1">
                            {profissao}
                        </Typography>
                    </Box>

                    <Box sx={{display:'flex', gap:1}}>
                        <CalendarMonthOutlinedIcon/> 
                            {data >0 ||data > null?(
                                <Typography >
                                    {formatarData(data)}
                                </Typography>
                            ):
                                <Typography >
                                    sem data
                                </Typography>
                            }
                    </Box>

                    <Box sx={{display:'flex', gap:1}}>
                        <AlarmOnOutlinedIcon/>
                        <Typography >
                            Horário: {horario}
                        </Typography>
                    </Box>

                    <Box sx={{display:'flex', gap:1}}>
                        <PlaceOutlinedIcon/> 
                       <Typography >
                            Local: {local}
                        </Typography>
                    </Box>

                    <Box sx={{display:'flex', gap:1}}>
                        <LocalPhoneOutlinedIcon/>
                        <Typography >
                            Contato: {celular}
                        </Typography>
                    </Box>

                </Box>
            </Box>
        </>
    )
}