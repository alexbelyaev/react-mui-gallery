import * as React from 'react';
import { Box, Typography } from '@mui/material';


export default function PreviewSection({ item = {} }){

  return (
    <Box sx={{height: '100%' , display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <Box width={'100%'} sx={{padding:'12px', borderLeft: '1px solid grey'}}>
        <Typography variant='caption' color='grey'>{item?.photo_num}</Typography>
      </Box>
      <Box sx={{ overflov: 'hidden', height: '60%', width: '90%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <img src={`/pic/${item.photo_num}.jpg`} alt={item.name} style={{ 
            maxWidth: '100%', maxHeight: '100%', padding: '5px', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}}  
          />
      </Box>
      <Box width={'100%'} sx={{textAlign: 'end', padding: '12px', marginTop:'12px', borderRight: '1px solid grey'}}>
        <Box>
          {item?.name && <Typography variant='caption'>{`«${item.name}»`}</Typography>}
          {item?.aughtor && <Typography variant='caption' sx={{ fontStyle: 'italic' }}>{`, ${item?.aughtor}`}</Typography>}
          {item?.size_w && item?.size_h && <Typography variant='caption'>{`, ${item.size_w}✕${item.size_h}`}</Typography>}
          {item?.price && <Typography variant='caption'>{`, ${item?.price}₴`}</Typography>}
        </Box>
        {item?.description && <Typography variant='caption' display='block'>{item.description}</Typography>}
      </Box>
 
    </Box>
  )
}