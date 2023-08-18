import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { TextField, IconButton, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LocaleContext } from '../contexts/LocaleContext'

export default function SearchTextFiels({ handleClose=()=>{}}){
  const [searchText, setSearchText] = React.useState("")
  const navigate = useNavigate();
  const labels = React.useContext(LocaleContext)

  const handleSearch = (e) => {
    e.preventDefault()
    handleClose()
    searchText.trim() !== "" && navigate("/search/"+encodeURI(searchText.trim()))
  }

  return (
    <Box sx={{'& .MuiTextField-root': { m: 1, width: '30ch' },}} >
      <TextField 
        id="outlined-search" 
        label={labels.menu.search} 
        onChange={(event)=>{setSearchText(event.target.value)}}
        onKeyDown={(e) => (
          e.keyCode === 13 ? handleSearch(e) : null
        )}
        InputProps={{
          endAdornment: (
            <Box sx={{p:1}}>
              <IconButton edge="end" onClick={handleSearch}>
                <SearchIcon />
              </IconButton>
            </Box>
          ),
        }}
      /> 
    </Box>
  )
}