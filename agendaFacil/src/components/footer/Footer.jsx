import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import './Footer.css';

export default function Footer() {
  return (
    <Box component="footer" className="footer">
      <Container maxWidth="lg">
        <Grid container spacing={6} justifyContent="space-between">
          {/* Sobre */}
          <Grid item xs={12} sm={6} md={3.5}>
            <Typography variant="h6" className="footer-title">
              Agenda Fácil
            </Typography>
            <Typography variant="body2" className="footer-text">
              A melhor plataforma de agendamento online. Conectamos prestadores de serviços e clientes de forma simples e eficiente.
            </Typography>
          </Grid>

          {/* Links Rápidos */}
          <Grid item xs={12} sm={6} md={2.5}>
            <Typography variant="h6" className="footer-title">
              Links Rápidos
            </Typography>
            <Box className="footer-links">
              <Link href="/" underline="hover" className="footer-link">
                Início
              </Link>
              <Link href="/servicos" underline="hover" className="footer-link">
                Serviços
              </Link>
              <Link href="/login" underline="hover" className="footer-link">
                Login
              </Link>
              <Link href="/registro" underline="hover" className="footer-link">
                Cadastre-se
              </Link>
            </Box>
          </Grid>

          {/* Contato */}
          <Grid item xs={12} sm={6} md={3.5}>
            <Typography variant="h6" className="footer-title">
              Contato
            </Typography>
            <Box className="footer-contact">
              <Box className="contact-item">
                <EmailIcon fontSize="small" />
                <Typography variant="body2" className="footer-text">
                  contato@agendafacil.com.br
                </Typography>
              </Box>
              <Box className="contact-item">
                <PhoneIcon fontSize="small" />
                <Typography variant="body2" className="footer-text">
                  (11) 98765-4321
                </Typography>
              </Box>
              <Box className="contact-item">
                <LocationOnIcon fontSize="small" />
                <Typography variant="body2" className="footer-text">
                  São Paulo, SP
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Redes Sociais */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" className="footer-title">
              Redes Sociais
            </Typography>
            <Box className="footer-social">
              <IconButton 
                aria-label="Facebook" 
                className="social-icon"
                href="https://facebook.com"
                target="_blank"
              >
                <FacebookIcon />
              </IconButton>
              <IconButton 
                aria-label="Instagram" 
                className="social-icon"
                href="https://instagram.com"
                target="_blank"
              >
                <InstagramIcon />
              </IconButton>
              <IconButton 
                aria-label="LinkedIn" 
                className="social-icon"
                href="https://linkedin.com"
                target="_blank"
              >
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Linha divisória */}
        <Box className="footer-divider"></Box>

        {/* Desenvolvido por */}
        <Box className="footer-bottom">
          <Typography variant="body2" className="footer-text">
            © {new Date().getFullYear()} Agenda Fácil. Todos os direitos reservados.
          </Typography>
          <Typography variant="body2" className="footer-developed">
            Desenvolvido por: <strong>Grupo 2 - SENAC</strong>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
