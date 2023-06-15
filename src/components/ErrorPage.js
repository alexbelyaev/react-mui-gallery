import * as React from 'react';
import { Box, Typography } from '@mui/material';

export default function ErrorPage({ error = ''}){

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Typography variant='body'>
        {error}
      </Typography>
    </Box>
  )
}