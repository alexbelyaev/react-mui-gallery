import * as React from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export default function ArtistsList({ priceList = ()=>{}, handleClose=()=>{} }){
  const aughtors = priceList.map(el=>el.aughtor.trim())
              .filter((name, index, self) => self.indexOf(name) === index)
              .sort()

  return (
    <Box sx={{ height: '80Vh', overflow: 'auto'}}>
      <ul style={{padding: 0, width: '200px'}} onClick={handleClose}>
        {aughtors.map((el,i) => (
          <li key={i} className="artistsList" style={{ listStyleType: "none" }}>
            <Link to={`/search/${encodeURI(el)}`}>
              <Typography>{el}</Typography>
            </Link>
          </li>
        ))}
      </ul>
    </Box>
  )
}