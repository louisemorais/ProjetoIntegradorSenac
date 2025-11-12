import styled from '@emotion/styled';
import Button from '@mui/material/Button';

export default function Botao({nome}) {
    const Botao = styled(Button)({
        backgroundColor: '#213448',
        color: '#FFFFFF',
        fontSize: '1rem',
        width: '150px',
        padding: '8px',
        borderRadius: '8px',
        '&:hover': {
            backgroundColor: '#3b5876ff',
        },
    });
  return (
    <>
        <Botao>{nome}</Botao>
    </>
  )
}