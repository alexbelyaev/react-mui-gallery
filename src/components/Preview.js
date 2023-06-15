import * as React from 'react';
import { Box, Typography } from '@mui/material';
import { MediaQueryContext } from '../contexts/MediaQueryContext';

export default function Preview({ item = {} }){
  const mediaQuery = React.useContext(MediaQueryContext)
  const isSmall = ['xs', 'sm'].includes(mediaQuery)

  let divW, divH = "auto"
  let imgW, imgH = "auto"
  if (item.size_w > item.size_h) {
    divW = '100%'
    imgW = '100%'
  } else {
    divH = isSmall ? '100%' : '65%'
    imgH = '90%'
  }


  return (
    <Box sx={{p:2, width: '100%', height: '100%', overflow: 'hidden',
      display: 'flex', justifyContent: 'center', flexDirection: 'column'
    }}>

        <Box sx={{display: 'flex', justifyContent: 'center', width: divW, height: divH }}>
          <Box p={1} sx={{display: 'flex', flexDirection: 'column', width: divW, boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'}}>
              <Typography variant='caption' display="block">{ item?.photo_num && item.photo_num }</Typography>
              <img src={`/pic/${item.photo_num}s.jpg`} width={imgW} height={imgH} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='caption' display="block">{ item?.size_w && item?.size_h && `${item.size_w} x ${item.size_h}` }</Typography>
                <Typography variant='caption' display="block">{ item?.price && ` ${item.price} ₴` }</Typography>
              </Box>
          </Box>
        </Box>
        { isSmall &&
        <Box sx={{textAlign: 'center'}}>
          <Typography variant='caption'>{ item?.name && `"${item.name}" ` }</Typography>
          <Typography variant='caption'>{ item?.aughtor && item.aughtor }</Typography>
        </Box> }
        { !isSmall &&
        <Box p={2}>
          <Typography variant='h4'>{ item?.name && item.name }</Typography>
          <Typography variant='h6'>{ item?.aughtor && item.aughtor }</Typography>
          <Typography variant='boody'>{ item?.description && item.description }</Typography> 
        </Box>
        }

    </Box>
  )
}