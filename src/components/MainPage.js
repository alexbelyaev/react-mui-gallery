import { useState, useEffect, useReducer } from 'react';
import { Container } from "@mui/material";
import DrawerMenu from './DrawerMenu';
import { LocaleContext } from '../contexts/LocaleContext'
import { MediaQueryContext } from '../contexts/MediaQueryContext';
import GalleryScrollContainer from './GalleryScrollContainer'
import Box from '@mui/material/Box';
import AppBar from './AppBar.js'
import Drawer from '@mui/material/Drawer';
import PreviewSection from './PreviewSection';
import ModalPreview from './ModalPreview';
import useWidth from '../hooks/useWidth';
import useUrlParams from '../hooks/useUrlParams';
import ErrorPage from './ErrorPage';
import { CurrentItemContext, CurrentItemDispatchContext} from '../contexts/CurrentItemContext'
import { IsPreviewOpenDispatchContext } from '../contexts/IsPreviewOpenContext'


function MainPage({ config }) {
  const {categories, initProductsList, labels} = config
  const [productsList, setProductsList] = useState([...initProductsList])
  const [currentItem, dispatchCurrentItem] = useReducer(itemReducer, 
    productsList[[Math.floor(Math.random()*productsList.length)]]);
  const [currentCategory, setCurrentCategoty] = useState('0')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [scrollToIndex, setScrollToIndex] = useState(false)
  const [isPreviewOpen, dispatchIsPreviewOpen] = useReducer(isPreviewOpenReducer, false)
  // const isLarge =  useMediaQuery(theme.breakpoints.up("lg"))
  const handleCloseModal = () => dispatchIsPreviewOpen({type: 'close'})
  const mediaQueryWidth = useWidth()
  const [category, id] = useUrlParams();



  function itemReducer( state, action) {
    switch (action.type) {
      case 'selected': {
        return {...action.item};
      }
      default: {
        throw Error('Unknown action: ' + action.type);
      }
    }
  }

  function isPreviewOpenReducer( state, action) {
    switch (action.type) {
      case 'open': {
        return true;
      }
      case 'close': {
        return false;
      }
      default: {
        throw Error('Unknown action: ' + action.type);
      }
    }
  }

  function changeCategory(category){
    if(category==='0'){
      setProductsList([...initProductsList])
    } else {
      setProductsList(initProductsList.filter(el=>el.category===category))
    }
    setCurrentCategoty(category)
    setScrollToIndex(0)
  }

  // closing preview on large screen
  useEffect(()=>{
    if(isPreviewOpen && !['xs', 'sm'].includes(mediaQueryWidth)) 
      dispatchIsPreviewOpen({ type: 'close' });
  }, [mediaQueryWidth, isPreviewOpen])
  
  const handleDrawerOpen = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleCategoryClick = (category) => {
    changeCategory(category)
  }

  // Processing url route
  let updatedCategory
  // if we have url category and it is not equal to the state
  // lets validate it and replase state
  if(category && category !== currentCategory) {
    if ( !/^[0-9]{1,2}$/i.test(category) ) {
      return <ErrorPage error={labels.errors.categoryNotFound} />
    } else {
      if (!categories[category])
        return <ErrorPage error={labels.errors.categoryNotFound} />;
      updatedCategory = category;
      changeCategory(category);
    }
  }

  if(!category && currentCategory!=='0')
    changeCategory('0');

  // if we have url id and it is not equal to the state
  // lets validate it and replase state
  if(id && id !== currentItem.photo_num) {
    if ( !/^[0-9]{6}$/i.test(id) ) {
      return <ErrorPage error={labels.errors.paintingNotFound} />
    } else {
      const index = updatedCategory
        ? productsList.filter(el=>el.category===updatedCategory).findIndex(el=>el.photo_num===id)
        : productsList.findIndex(el=>el.photo_num===id)
      if (!index || index===-1)
        return <ErrorPage error={labels.errors.paintingNotFound} />;
      //console.log(`\tindex: ${index} \n\tlen: ${productsList.length} \n\t${updatedCategory}`)
      dispatchCurrentItem({ type: 'selected', item: productsList[index] })
      setScrollToIndex(index)
      if (mediaQueryWidth==='sm') 
        dispatchIsPreviewOpen({type: 'open'});
    }
  }
  // END OF Processing url route


  return (
    <LocaleContext.Provider value={labels}>
      <MediaQueryContext.Provider value={mediaQueryWidth}>
        <Container sx={{minWidth: '350px', maxWidth: '1200px'}} disableGutters={true}>
          <AppBar onIconButtonClick={handleDrawerOpen} cat={currentCategory} catNames={categories}/>
            <Drawer open={drawerOpen} 
                    onClick={handleDrawerOpen}
                    onClose={(_, reason) => reason === 'backdropClick' && setDrawerOpen(false)}>
              <DrawerMenu categories={categories} handleCategoryClick={handleCategoryClick} />
            </Drawer>
          <Box style={{ width: '100%', height: '100vh' }}>
            <ModalPreview open={isPreviewOpen} handleClose={handleCloseModal}>
              <PreviewSection item={ currentItem } />
            </ModalPreview>
            <Box sx={{ height: '48px' }} />
            <Box
              sx={{ display: 'flex', height: 'calc(100% - 50px)' }}
            >
              <Box sx={{ flexGrow: 1, display: 'flex' }}>
                <Box p={1} sx={{width: "45%", display: {xs:"none", md:"block"} }}>
                  <PreviewSection item={ currentItem } />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <IsPreviewOpenDispatchContext.Provider value={dispatchIsPreviewOpen}>
                    <CurrentItemDispatchContext.Provider value={dispatchCurrentItem}>
                      <GalleryScrollContainer items={productsList} index={scrollToIndex} />
                    </CurrentItemDispatchContext.Provider>
                  </IsPreviewOpenDispatchContext.Provider>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
    </MediaQueryContext.Provider>
  </LocaleContext.Provider>
  );
}

export default MainPage;
