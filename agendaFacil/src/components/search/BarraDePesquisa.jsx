import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const SearchContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#e5e5e5',
  borderRadius: '12px',
  padding: '4px 8px',
  width: '320px',
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
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { categoria } = useParams();
  const location = useLocation();

  
  useState(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) setQuery(searchParam);
  }, [location.search]);

  const handleSearch = () => {
    if (!query.trim()) return;
    const basePath = categoria ? `/servicos/${categoria}` : '/servicos';
    navigate(`${basePath}?search=${encodeURIComponent(query)}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <SearchContainer>
      <Input
        placeholder="Pesquise serviços ou prestadores"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <IconButton onClick={handleSearch}>
        <SearchIcon style={{ color: '#444', fontSize:'25px' }} />
      </IconButton>
    </SearchContainer>
  );
}
