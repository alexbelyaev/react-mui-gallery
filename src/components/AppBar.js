import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { Typography, Container } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { LocaleContext } from '../contexts/LocaleContext'
import useWidth from '../hooks/useWidth';
import PhoneIcon from '@mui/icons-material/PhoneRounded';
import ModalInfo from './ModalInfo'

export default function MenuAppBar({onIconButtonClick=()=>{}, cat='', catNames=[] }) {
const [isInfoOpen, setIsInfoOpen] = React.useState(false)
const labels = React.useContext(LocaleContext)
const mediaQueryWidth = useWidth()
const sideWidth = mediaQueryWidth === 'xs' ? '50px' : '110px'

const handleInfoOpen = () => {
  setIsInfoOpen(!isInfoOpen);
};

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'black',
          opacity: 0.8, 
          //display: {xs:"block", lg:"none"},
      }}>
        <Container maxWidth="lg" sx={{minWidth: '350px'}} disableGutters={true}>
          <Toolbar variant="dense">
            <ModalInfo open={isInfoOpen} handleClose={handleInfoOpen}/>
            <Box width="100% "display="flex" flexDirection="row">
              <Box width={sideWidth} display="flex" alignItems="center">
                <IconButton
                    color="inherit"
                    aria-label="Open menu"
                    onClick={onIconButtonClick}
                >
                  <MenuIcon />
                </IconButton>
                <Typography sx={{display: {xs:"none", sm:"block"}}} variant="h6" component="div" >
                  { labels.appBar.title }
                </Typography>
              </Box>
              <Box flexGrow={1} display="flex" alignItems="center" justifyContent="center">
                <Typography>
                  {cat && cat!=='0' && catNames && catNames.find(el=>el[0]===Number(cat))?.[1]}
                  {mediaQueryWidth === 'xs' && (!cat || cat==='0') && 'ArtBox'}
                </Typography>
              </Box>
              <Box width={sideWidth} sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end',
                alignItems: 'center'
              }}>
                <IconButton color="inherit" aria-label="contacts" onClick={handleInfoOpen}>
                  <PhoneIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}
