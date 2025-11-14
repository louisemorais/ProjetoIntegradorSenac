import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [usuario, setUsuario] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const usuarioStorage = JSON.parse(localStorage.getItem('usuario') || 'null');
    setUsuario(usuarioStorage);
  }, [location]);

  const backgroundNavbar = {
    backgroundColor: '#213448',
    boxShadow: 'none',
    paddingLeft: 10,
    paddingRight: 5
  };

  const navLink = {
    fontSize: '0.8rem',
    '&:hover': { 
      backgroundColor: '#3b5876ff'
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handlePerfil = () => {
    handleMenuClose();
    navigate('/perfil');
  };

  const handleAgendamentos = () => {
    handleMenuClose();
    navigate('/meus-agendamentos');
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    setUsuario(null);
    handleMenuClose();
    navigate('/');
    window.location.reload();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={backgroundNavbar}>
        <Toolbar sx={{justifyContent: 'space-between', gap:5}}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ flexGrow: 1, fontSize: '1.5rem', fontWeight: 500, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            AgendaFácil
          </Typography>
          <Button color="inherit" sx={navLink} onClick={() => navigate('/')}>
            Início
          </Button>
          {usuario ? (
            <><Button color="inherit" sx={navLink} onClick={() => navigate('/servicos')}>
                Serviços
              </Button>
              <Button color="inherit" sx={navLink} onClick={() => navigate('/meus-agendamentos')}>
                Agendamentos
              </Button>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar
                  src={usuario.foto_perfil}
                  sx={{ width: 32, height: 32, backgroundColor: '#3b5876', cursor: 'pointer' }}
                  onClick={handleMenuClick}
                >
                  {usuario.nome?.charAt(0).toUpperCase()}
                </Avatar>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handlePerfil}>Perfil</MenuItem>
                  <MenuItem onClick={handleAgendamentos}>Meus Agendamentos</MenuItem>
                  <MenuItem onClick={handleLogout}>Sair</MenuItem>
                </Menu>
              </Box>
            </>
          ) : (
            <Button color="inherit" sx={navLink} onClick={() => navigate('/login')}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
