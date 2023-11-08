import {useContext, useEffect, Fragment, useState} from 'react';
import { Box, Typography, CircularProgress, IconButton } from '@mui/material';
import useImageLoader from '../hooks/useImageLoader';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

function LoaderIcon(){
  const [timeToShowLoader, setTimeToShowLoader] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(
      () => {
      setTimeToShowLoader(true);
    }, 1600);

    return () => {
      // Clear the timeout if the component unmounts before it triggers
      clearTimeout(timeoutId);
    };
  }, []);

  if(timeToShowLoader){
    return (
      <Box className={`preview-container fade-in`} position='absolute' sx={{top: '47%', left: '47%' }}>
        <CircularProgress />
      </Box>
    )
  }

  return null
}

export default function PreviewSection({ item = {}, isFavorite = false, onFavoriteClick = () => {} }){
  const { imageLoaded, image, fetchImage } = useImageLoader(500);
  
  // lag used when card faded out slowly but state already changed
  // we dont want to upate card data too fast
  const [itemLag, setItemLag] = useState({ ...item})
  const [isFavoriteLag, setIsFavoriteLag] = useState(isFavorite)

  useEffect(() => {
    fetchImage(`/pic/${item.photo_num}.jpg`);
  }, [item.photo_num]);

  useEffect(() => {
    if(imageLoaded){
      setItemLag({ ...item})
    }
  }, [imageLoaded])

  // switching 'heart' on click, but when changing (lag)
  useEffect(() => {
      if(itemLag.photo_num === item.photo_num){
        setIsFavoriteLag(isFavorite)
      }
  }, [isFavorite])

  // switching 'heart' after lag
  useEffect(() => {
    imageLoaded && setIsFavoriteLag(isFavorite)
  }, [imageLoaded]);


  return (
  <Fragment>
    <Box position='relative' sx={{width: '100%', height: '100%' }}>
      <Box display='flex' className={`preview-container ${imageLoaded ? 'fade-in' : 'fade-out'}`}
        sx={{height: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly'}}>
        <Box width={'100%'} sx={{padding:'12px', borderLeft: '1px solid grey'}}>
          <Typography variant='caption' color='grey'>
            <IconButton className={isFavoriteLag?'btn-fav-activ':'btn-fav'} data-item-id={itemLag?.photo_num} onClick={() => onFavoriteClick(item.photo_num)} aria-label="add to favorites">
            {
              isFavoriteLag
              ? <FavoriteIcon />
              : <FavoriteBorderIcon />
             }
            </IconButton>
            {itemLag?.photo_num} 
          </Typography>
        </Box>
        <Box sx={{ overflov: 'hidden', height: '60%', width: '90%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <img src={image} alt={itemLag.name} style={{ 
              maxWidth: '100%', maxHeight: '100%', padding: '5px', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}}  
            />
        </Box>
        <Box width={'100%'} sx={{textAlign: 'end', padding: '12px', marginTop:'12px', borderRight: '1px solid grey'}}>
          <Box>
            {itemLag?.name && <Typography variant='caption'>{`«${itemLag.name}»`}</Typography>}
            {itemLag?.aughtor && <Typography variant='caption' sx={{ fontStyle: 'italic' }}>{`, ${itemLag?.aughtor}`}</Typography>}
            {itemLag?.size_w && item?.size_h && <Typography variant='caption'>{`, ${itemLag.size_w}✕${itemLag.size_h}`}</Typography>}
            {itemLag?.price && <Typography variant='caption'>{`, ${itemLag?.price}₴`}</Typography>}
          </Box>
          {itemLag?.description && <Typography variant='caption' display='block'>{itemLag.description}</Typography>}
        </Box>
      </Box>
      {
        !imageLoaded && 
          <LoaderIcon />
      }
    </Box>
    
  </Fragment>
    
)}