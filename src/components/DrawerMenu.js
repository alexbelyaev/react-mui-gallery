import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import { MenuList, Typography } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { LocaleContext } from '../contexts/LocaleContext'
import { Link } from "react-router-dom";

export default function DrawerMenu({categories=[], handleCategoryClick=()=>{}}) {
const labels = React.useContext(LocaleContext)

  return (
    <Box
      sx={{ width: {xs: 250, lg: 200} }}
      role="presentation"
    >
      <Typography marginTop={'50px'} variant="h6" padding="0 4px">{labels.menu.catHeader}</Typography>
      <MenuList dense>
      {categories.map((el, index) => (
          <Link to={index === 0 ? '/' : `/${index}`} key={index}>
            <MenuItem key={index}  onClick={()=>handleCategoryClick(el[0].toString())}>
              <ListItemText>{el[1]}</ListItemText>
            </MenuItem>
          </Link>

        ))}
      </MenuList>
      <Divider />
    </Box>
  );
}