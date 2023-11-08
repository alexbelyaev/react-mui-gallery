import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import { MenuList, Typography, Select, FormControl, InputLabel } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { LocaleContext } from '../contexts/LocaleContext'
import { Link } from "react-router-dom";

export default function DrawerMenu({
  categories=[], 
  sortOrder='date',
  handleCategoryClick=()=>{},
  handleSearchClick=()=>{},
  handleAughtorsClick=()=>{},
  handleSort=()=>{}
}) {
const labels = React.useContext(LocaleContext)
const filteredCategories = categories.filter(item => ![100,200].includes(item[0]));


  return (
    <Box
      sx={{ width: {xs: 250, lg: 200} }}
      role="presentation"
    >
      <Typography marginTop={'50px'} variant="h6" padding="0 4px">{labels.menu.catHeader}</Typography>
      <MenuList dense>
        {filteredCategories.map((el, index) => (
            <Link to={el[0] === 0 ? '/' : `/${el[0]}`} key={index}>
              <MenuItem key={index}  onClick={()=>handleCategoryClick(el[0].toString())}>
                <ListItemText>{el[1]}</ListItemText>
              </MenuItem>
            </Link>
          ))}
        <Divider />
        <Link to = '/favorites'>
          <MenuItem>
              <ListItemText primaryTypographyProps={{ fontWeight: 'bold' }}>{labels.menu.favorites}</ListItemText>
          </MenuItem>
        </Link>
        <MenuItem onClick={handleSearchClick}>
          <ListItemText primaryTypographyProps={{ fontWeight: 'bold' }}>{labels.menu.search}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleAughtorsClick}>
          <ListItemText primaryTypographyProps={{ fontWeight: 'bold' }}>{labels.menu.aughtors}</ListItemText>
        </MenuItem>
      </MenuList>
      <Box sx={{ p: 1, minWidth: 120 }} onClick={(e)=>{e.stopPropagation()}}>
        <FormControl fullWidth size="small">
          <InputLabel>{labels.menu.sort.sort}</InputLabel>
          <Select
            value={sortOrder}
            label={labels.menu.aughtors}
            onChange={handleSort}
            variant='outlined'
          >
            <MenuItem value={'date'}>{labels.menu.sort.date}</MenuItem>
            <MenuItem value={'price'}>{labels.menu.sort.price}</MenuItem>
            <MenuItem value={'size'}>{labels.menu.sort.size}</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}