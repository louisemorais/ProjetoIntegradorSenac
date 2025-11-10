import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function NavBar() {

  const backgroundNavbar={
    backgroundColor: '#213448',
    boxShadow: 'none',
    paddingLeft: 10,
    paddingRight: 5
  }

  const navLink={
    fontSize: '0.8rem',
    '&:hover': { 
                backgroundColor: '#3b5876ff'}
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={backgroundNavbar}>
        <Toolbar sx={{justifyContent: 'space-between', gap:5}}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontSize: '1.5rem',fontWeight: 500}}>
            AgendaFácil
          </Typography>
          <Button color="inherit" sx={navLink}>Início</Button>
          <Button color="inherit" sx={navLink}>Serviços</Button>
          <Button color="inherit" sx={navLink}>Agendamentos</Button>
          <Button color="inherit" sx={navLink}>Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
