import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

const SearchContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#e5e5e5',
  borderRadius: '12px',
  padding: '8px 15px',
  width: '400px',
});

const Input = styled(InputBase)({
  flex: 1,
  fontSize: '16px',
  color: '#444',
  '& .MuiInputBase-input::placeholder': {
    textAlign: 'center',
  }
});

export default function BarraDePesquisa() {
  return (
    <SearchContainer>
      <SearchIcon style={{ color: '#444', fontSize:'30px' }} />
      <Input placeholder="Pesquise serviços ou prestadores" />
    </SearchContainer>
  );
}
