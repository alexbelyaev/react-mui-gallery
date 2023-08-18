import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '1px solid black',
  boxShadow: 24,
  p: 4,
};

export default function ModalCenter({
    children, 
    open = false, 
    handleClose = () => {}, 
    disableRestoreFocus = true }) {

  return (
    <div>
      <Modal
        open = {open}
        onClose = {handleClose}
        disableRestoreFocus = {disableRestoreFocus}
      >
        <Box sx={style}>
          {children}
        </Box>
      </Modal>
    </div>
  )
}