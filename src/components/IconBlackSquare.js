import * as React from 'react';
import { Box } from '@mui/material';


  export default function IconBlackSquare( {w=0, h=0} ) {
      
      const bigSide = w > h ? w : h
      
      let imSize
  
      switch (true) {
        case (bigSide > 99):
          imSize = "12px"
          break;
        case (bigSide > 59):
          imSize = "8px"
          break;
        case (bigSide > 39):
          imSize = "4px"
          break;
        default:
          imSize = "2px"
          break;
      }
      
    return (
      <Box 
        width="12px" 
        height="12px" 
        display="flex" 
        justifyContent="center"
        alignItems="center" 
        borderRadius="3px"
      >
        <Box width={imSize} height={imSize} bgcolor="lightGrey" />
      </Box>
    )
  }
  