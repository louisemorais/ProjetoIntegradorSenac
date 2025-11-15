import { Box, Container, Typography, IconButton } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import './Footer.css';

export default function Footer() {
  return (
    <Box component="footer" className="footer">
      <Container maxWidth="lg">
        {}
        <Box className="footer-main">
          {}
          <Box className="footer-brand">
            <Typography variant="h6" className="footer-title">
              Agenda Fácil
            </Typography>
            <Typography variant="body2" className="footer-tagline">
              Conectando serviços e clientes de forma simples.
            </Typography>
          </Box>

          {/* Contato e Redes Sociais */}
          <Box className="footer-right">
            {/* Ctt */}
            <Box className="footer-contact">
              <Box className="contact-item">
                <EmailIcon fontSize="small" />
                <Typography variant="body2">contato@agendafacil.com.br</Typography>
              </Box>
              <Box className="contact-item">
                <PhoneIcon fontSize="small" />
                <Typography variant="body2">(11) 98765-4321</Typography>
              </Box>
            </Box>

            {/* Redes */}
            <Box className="footer-social">
              <IconButton 
                aria-label="Facebook" 
                className="social-icon"
                href="https://facebook.com"
                target="_blank"
                size="small"
              >
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton 
                aria-label="Instagram" 
                className="social-icon"
                href="https://instagram.com"
                target="_blank"
                size="small"
              >
                <InstagramIcon fontSize="small" />
              </IconButton>
              <IconButton 
                aria-label="LinkedIn" 
                className="social-icon"
                href="https://linkedin.com"
                target="_blank"
                size="small"
              >
                <LinkedInIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Bottom */}
        <Box className="footer-bottom">
          <Typography variant="body2" className="footer-copyright">
            © {new Date().getFullYear()} Agenda Fácil. Todos os direitos reservados.
          </Typography>
          <Typography variant="body2" className="footer-developed">
            Desenvolvido por <strong>Grupo 2 - SENAC</strong>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}