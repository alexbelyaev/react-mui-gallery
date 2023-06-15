import * as React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import { useSize, useScroller } from "mini-virtual-list";
import { useScrollToIndex, usePositioner, useResizeObserver, useMasonry } from "masonic";
import Box from '@mui/material/Box';
import { CardActionArea } from '@mui/material';
import { MediaQueryContext } from '../contexts/MediaQueryContext';
import { Link, useParams } from "react-router-dom";
import { CurrentItemContext, CurrentItemDispatchContext} from '../contexts/CurrentItemContext'
import { IsPreviewOpenDispatchContext } from '../contexts/IsPreviewOpenContext'


const MansoryCardContent = ({data}) => {
  const { photo_num, name, size_w, size_h, aughtor, price, description } = data
  const mqWidth = React.useContext(MediaQueryContext)

  //<IconBlackSquare w={ size_w } h={ size_h } />
  return (
    <Box sx={{color: 'grey', textAlign: 'end'}}>

      { photo_num && mqWidth==='xs'
        ? <img alt={name} src={`/pic/${photo_num}.jpg`} width={"100%"} />
        : <img alt={name} src={`/pic/${photo_num}s.jpg`} width={"100%"} />}
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
  const { category } = useParams();
  const mqWidth = React.useContext(MediaQueryContext)

  const handleClick = () => {
    dispatchCurrentItem({ type: 'selected', item: data })
    if (mqWidth==='sm') 
      dispatchIsPreviewOpen({ type: 'open' });
  }
  
  return (
    <Stack p={'2px'} direction="column" alignItems="center">
      
      {mqWidth==='xs' && photo_num &&
      <Box sx={{width:'100%', maxWidth: '350px', textAlign: 'start'}}>
        <Typography variant='caption' sx={{color: 'grey'}}>{photo_num}</Typography>
      </Box>}
      
      <Card sx={{width:'100%', maxWidth: '350px' }} >
      { mqWidth === 'xs'
        ? <MansoryCardContent data={data} />
        : (
          <Link to={/^.$/i.test(category) ? `/${category}/${photo_num}` : `/${photo_num}`}>
            <CardActionArea onClick={ handleClick }>
              <MansoryCardContent data={data} />
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
      console.log(`ScrollToIndex: ${index}`)
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
          overscanBy: 2,
          render: MasonryCard
        })}
      </Box>
  );
}
