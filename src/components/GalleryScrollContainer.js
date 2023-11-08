import * as React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import { useSize, useScroller } from "mini-virtual-list";
import { useScrollToIndex, usePositioner, useResizeObserver, useMasonry } from "masonic";
import Box from '@mui/material/Box';
import { CardActionArea, IconButton } from '@mui/material';
import { MediaQueryContext } from '../contexts/MediaQueryContext';
import { Link, useLocation } from "react-router-dom";
import { CurrentItemDispatchContext} from '../contexts/CurrentItemContext'
import { IsPreviewOpenDispatchContext } from '../contexts/IsPreviewOpenContext'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { FavoritesContext } from '../contexts/FavoritesContext';


const MansoryCardContent = ({data, width}) => {
  const [ mountImg, setMountImg] = React.useState(false)
  const [ imgLoaded, setImgLoaded] = React.useState(false)
  const { photo_num, name, size_w, size_h, aughtor, price, description, sm_img_w, sm_img_h } = data
  const mqWidth = React.useContext(MediaQueryContext)
  const { favoritesList, handleFavorite } = React.useContext(FavoritesContext)
  const isFavorite = favoritesList && favoritesList.includes(photo_num)
  const imgWidth = width < 350 ? width - 4 : 350
  const imgHeight = sm_img_h && sm_img_w &&
    width < 350 
      ? (width - 4) * sm_img_h / sm_img_w 
      : 350 * sm_img_h / sm_img_w

  React.useEffect(()=>{
    const timeout = setTimeout(()=>{
      setMountImg(true)
    }, 300)

    return ()=>{
      clearTimeout(timeout)
    }
  },[])

  return (
    <Box sx={{color: 'grey', textAlign: 'end'}}>
      {mqWidth==='xs' && photo_num &&
      <Box sx={{padding: '2px', width:'100%', maxWidth: '350px', textAlign: 'start'}}>
        <IconButton className={isFavorite?'btn-fav-activ':'btn-fav'} onClick={() => handleFavorite(photo_num)} data-item-id={photo_num} aria-label="add to favorites">
        {
          isFavorite
          ? <FavoriteIcon />
          : <FavoriteBorderIcon />
          }
        </IconButton>
        <Typography variant='caption' sx={{color: 'grey'}}>{photo_num}</Typography>
      </Box>}
        <Box className={`${(imgLoaded) ? 'preview-container' : 'fade-out'}`} 
          sx={{ 
            width: imgWidth ? imgWidth : 'auto', 
            height: imgHeight ? imgHeight : 'auto'
          }} >
        {mountImg &&
          <img alt={name} src={mqWidth === 'xs' ? `/pic/${photo_num}.jpg` : `/pic/${photo_num}s.jpg`} width={"100%"} onLoad={()=>setImgLoaded(true) } />
        }
        </Box>
        <Box p={1}>
          { mqWidth==='xs' 
          ? <Box>
              <Box>
                {name && <Typography variant='caption'>{`«${name}»`}</Typography>}
                {aughtor && <Typography variant='caption' sx={{ fontStyle: 'italic' }}>{`, ${aughtor}`}</Typography>}
                {size_w && size_h && <Typography variant='caption'>{`, ${size_w}✕${size_h}`}</Typography>}
                {price && <Typography variant='caption'>{`, ${price}₴`}</Typography>}
              </Box>
              {description && <Typography variant='caption' display='block'>{description}</Typography>}
            </Box>
          : <Box>
              <Typography variant="caption" display='block'>
                {`${name&&name}`}
              </Typography> 
              <Typography variant="caption" >
                {size_w&&size_h&&`${size_w}✕${size_h}`}
              </Typography>
                {price && price!=='0' && 
              <Typography variant="caption" >{` ${price}₴`}</Typography>} 
            </Box>
            }
        </Box>
    </Box>
  )
}


const MasonryCard = ({ index, data, width }) => {
  const dispatchCurrentItem = React.useContext(CurrentItemDispatchContext)
  const dispatchIsPreviewOpen = React.useContext(IsPreviewOpenDispatchContext)
  const { photo_num } = data
  const mqWidth = React.useContext(MediaQueryContext)
  const location = useLocation();
  const currentPathname = location.pathname;

  const handleClick = () => {
    dispatchCurrentItem({ type: 'selected', item: data })
    if (mqWidth==='sm') 
      dispatchIsPreviewOpen({ type: 'open' });
  }

  function buildNewURL(currentPathname, newID) {
    const regex = /\d{6}$/;
    const hasID = regex.test(currentPathname);

    if (hasID) {
      return currentPathname.replace(regex, newID);
    } else {
      return currentPathname.endsWith('/')
        ? `${currentPathname}${newID}`
        : `${currentPathname}/${newID}`;
    }
  }
  
  const changeCurrentItem = buildNewURL(currentPathname, photo_num);

  return (
    <Stack p={'2px'} direction="column" alignItems="center">
      <Card sx={{width:'100%', maxWidth: '350px' }} >
      { mqWidth === 'xs'
        ? <MansoryCardContent data={data} width={width} />
        : (
          <Link to={changeCurrentItem}>
            <CardActionArea onClick={ handleClick }>
              <MansoryCardContent data={data} width={width} />
            </CardActionArea>
          </Link>)}
      </Card>
    </Stack>
)};


export default function GalleryScrollContainer({ items=[], index=false}) {
  const mqWidth = React.useContext(MediaQueryContext)
  const containerRef = React.useRef(null);
  const { width, height } = useSize(containerRef);
  const { scrollTop, isScrolling } = useScroller(containerRef);
  let columnCount = 4
  if (mqWidth === "xs") columnCount = 1
  // if (mqWidth === "sm") columnCount = 3
  const positioner = usePositioner({
    width,
    columnWidth: 150,
    columnGutter: 8,
    columnCount,
  }, [items]);
  const resizeObserver = useResizeObserver(positioner);
  const scrollToIndex = useScrollToIndex(positioner, {element: containerRef, align: 'top'});

  React.useEffect(()=>{
    if (items[index]) {
      scrollToIndex(index)
      // console.log(`ScrollToIndex: ${index}`)
    }
  }, [index, scrollToIndex, items])

  return (
    <Box
      sx={{ 
        height: '100%', 
        overflow: 'auto',
        padding: '8px',
        width: '100%',
        maxWidth: '960px',
        margin: '0 auto',
        boxSizing: 'border-box',
      }} 
      ref={containerRef}
    >
        {useMasonry({
          positioner,
          resizeObserver,
          items,
          height,
          scrollTop,
          isScrolling,
          overscanBy: mqWidth==='xs' ? 3 : 2,
          render: MasonryCard
        })}
      </Box>
  );
}
