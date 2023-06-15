import * as React from 'react';
import Box from '@mui/material/Box';
import { Stack } from '@mui/material'
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import PhoneIcon from '@mui/icons-material/LocalPhoneRounded';
import EmailIcon from '@mui/icons-material/EmailRounded';
import HomeIcon from '@mui/icons-material/HomeRounded';
import FacebookIcon from '@mui/icons-material/FacebookRounded';
import { LocaleContext } from '../contexts/LocaleContext'


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',

  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

export default function ModalPreview({children, open=false, handleClose=()=>{} }) {
const labels = React.useContext(LocaleContext)

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
          <Box>
            <Stack direction={'row'} p={1}>
              <PhoneIcon/>
              <a href={"tel:"+labels.contacts.phone.replace(/[^\d+]/g,'')}>
                <Typography pl={1} >{labels.contacts.phone}</Typography>
              </a>
            </Stack>
            <Stack direction={'row'} p={1}>
              <EmailIcon />
              <a href={`mailto:${labels.contacts.email}`} target="_top">
                <Typography pl={1} >{labels.contacts.email}</Typography>
              </a>
            </Stack>
            <Stack direction={'row'} p={1}>
              <FacebookIcon />
              <a href={"https://"+labels.contacts.facebook} target="_blank" rel="noreferrer">
                <Typography pl={1} >{labels.contacts.facebook}</Typography>
              </a>
            </Stack>    
            <Stack direction={'row'} p={1}>
              <HomeIcon />
              <Typography pl={1} >{labels.contacts.address}</Typography>
            </Stack>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}