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
import ModalCenter from './ModalCenter';
import useWidth from '../hooks/useWidth';
import useUrlParams from '../hooks/useUrlParams';
import ErrorPage from './ErrorPage';
import { CurrentItemDispatchContext } from '../contexts/CurrentItemContext'
import { IsPreviewOpenDispatchContext } from '../contexts/IsPreviewOpenContext'
import SearchTextField from './SearchTextField';
import ArtistsList from './ArtistsList';
import { useNavigate, useLocation } from 'react-router-dom';
import { FavoritesContext } from '../contexts/FavoritesContext';


function MainPage({ config, favorites = false }) {
  const {categories, labels, initProductsList} = config
  const initProductsListFiltered = initProductsList.filter(el=>el.category!=='94')
  const [productsList, setProductsList] = useState(initProductsListFiltered)
  const [currentItem, dispatchCurrentItem] = useReducer(itemReducer, {})
  const [currentCategory, setCurrentCategory] = useState('0')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [aughtorsOpen, setAughtorsOpen] = useState(false)
  const [scrollToIndex, setScrollToIndex] = useState(false)
  const [sortOrder, setSortOrder] = useState('')
  const [isPreviewOpen, dispatchIsPreviewOpen] = useReducer(isPreviewOpenReducer, false)
  // const isLarge =  useMediaQuery(theme.breakpoints.up("lg"))
  const handleCloseModal = () => dispatchIsPreviewOpen({type: 'close'})
  const mediaQueryWidth = useWidth()
  const [category, id, searchQuery] = useUrlParams();
  const [favoritesList, setFavoritesList] = useState()
  const location = useLocation();
  const currentPathname = location.pathname;
  const navigate = useNavigate();

  // console.log(`cat: ${category}\n id: ${id}\n query: ${searchQuery}\n currItem: ${currentItem.photo_num}\n cerrcat: ${currentCategory}`)

  // initializing current item on first load (main page)
  if( !currentItem.photo_num && !category && !searchQuery && !favorites ){
    dispatchCurrentItem({ 
      type: 'selected', 
      item: initProductsListFiltered[[Math.floor(Math.random()*initProductsListFiltered.length)]]
    })
  }

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
      const sortedProducts = sortProductsList(sortOrder, initProductsListFiltered)
      setProductsList(sortedProducts)
      dispatchCurrentItem({ 
        type: 'selected', 
        item: initProductsListFiltered[[Math.floor(Math.random()*initProductsListFiltered.length)]]
      })
    } else {
      const filteredProducts = initProductsList.filter(el=>el.category===category)
      const sortedProducts = sortProductsList(sortOrder, filteredProducts)
      setProductsList(sortedProducts)
      sortedProducts[0] && dispatchCurrentItem({ type: 'selected', item: sortedProducts[0] })
    }
    setCurrentCategory(category)
  }

  function sortProductsList(sortOrder = false, products = []){
    if (sortOrder) {
      switch (sortOrder) {
        case "date":
          return  products.slice().sort((a,b)=>{ return b.photo_num - a.photo_num })
        case "price":
          return  products.slice().sort((a,b)=>{ return a.price - b.price })
        case "size":
          return  products.slice().sort((a,b)=>{ return a.size_w * a.size_h - b.size_w * b.size_h })
        default:
          return products
      } 
    } else {
      return products
    }
  }

  // closing preview on large screen
  useEffect(()=>{
    if(isPreviewOpen && !['xs', 'sm'].includes(mediaQueryWidth)) 
      dispatchIsPreviewOpen({ type: 'close' });
  }, [mediaQueryWidth, isPreviewOpen])

  // sorting products
  useEffect(()=>{
    if(sortOrder){
      const sortedProducts = sortProductsList(sortOrder, productsList)
      setProductsList(sortedProducts)
      sortedProducts[0] && dispatchCurrentItem({ type: 'selected', item: sortedProducts[0] })
    }
    // eslint: adding productsList lead to loop
  }, [sortOrder])

  // if we switch url like /9/10001 -> /9 we need scroll to 0
  useEffect(()=>{
    if(!id) {
      if(currentCategory !== '0'){
        dispatchCurrentItem({ type: 'selected', item: productsList[0] })
      }
      // fix: it doesnt update if it is already 0
      if(scrollToIndex === 0){
        setScrollToIndex(false)
        setTimeout(() => { setScrollToIndex(0) }, 0);
      } else {
        setScrollToIndex(0) 
      }
      // close preview on md 
      if(isPreviewOpen) dispatchIsPreviewOpen({ type: 'close' });
    } else {
      if (!isPreviewOpen && mediaQueryWidth==='sm') 
        dispatchIsPreviewOpen({type: 'open'});
    }
  }, [id])


  // search
  useEffect(()=>{
    if(searchQuery){
      const searchStr = decodeURI(searchQuery).toLowerCase()
      const searchArr = searchStr.split(";").map(el=>el.trim())
      
      const result = 
        initProductsList.filter(el=>{
          const searchIn = 
            `${el.photo_num} ${el.aughtor} ${el.name} ${el.description}`.toLowerCase()
            for (let i = 0; i < searchArr.length; i++) {
              if (i >= 20) break;
              if (searchIn.includes(searchArr[i])) {
                return true;
              }
            }
          return false;
        });
      
      const sortedProducts = sortProductsList(sortOrder, result)
      setProductsList(sortedProducts)
      sortedProducts[0] && dispatchCurrentItem({ type: 'selected', item: sortedProducts[0] })
      setCurrentCategory('200')
    }
  }, [searchQuery, initProductsList, sortOrder])

  // Favorites.
  // On favorites page filtering out productList
  // Determaning this page by param favorites = true from routing
  useEffect(()=>{
    if(favorites){
      const favorites = favoritesList || []
      const result = initProductsList.filter(el=>favorites.includes(el.photo_num))
      // Sorting if needed
      const sortedProducts = sortProductsList(sortOrder, result)
      setProductsList(sortedProducts)
      // Setting current item to the first filtered list item
      sortedProducts[0] && dispatchCurrentItem({ type: 'selected', item: sortedProducts[0] })
      // When we remove from favorited we should also remove it from url
      if(id && !favorites.includes(id)){
        navigate(currentPathname.replace(/\d{6}$/, ''))
      }
      setCurrentCategory('100')
    }
  }, [favorites, favoritesList, initProductsList, sortOrder])

  // Saving favorites to the localstorage on change
  useEffect(()=>{
    if(favoritesList){
      localStorage.setItem("favorites", JSON.stringify(favoritesList));
    }
  }, [favoritesList])

  // Restoring favorites from localstorage.
  useEffect(()=>{
    const storageItem = localStorage.getItem("favorites") || '[]'
    const favorites = JSON.parse(storageItem)
    favorites.length && setFavoritesList([ ...favorites])
  }, [])

  const handleSortOrder = (event)=>{
    setSortOrder(event.target.value)
  }
  
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
  // console.log(`cat:${category} currCat:${currentCategory} fav:${favorites} srch:${searchQuery}`)
  if(category && category !== currentCategory) {
    if ( !/^[0-9]{1,2}$/i.test(category) ) {
      return <ErrorPage error={labels.errors.categoryNotFound} />
    } else {
      if (!categories.find(el => el[0].toString() === category))
        return <ErrorPage error={labels.errors.categoryNotFound} />;
      updatedCategory = category;
      changeCategory(category);
    }
  }

  if(!category && currentCategory!=='0' && !favorites && !searchQuery)
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
      if (index===undefined || index===-1)
        return <ErrorPage error={labels.errors.paintingNotFound} />;
      //console.log(`\tindex: ${index} \n\tlen: ${productsList.length} \n\t${updatedCategory}`)
      dispatchCurrentItem({ type: 'selected', item: productsList[index] })
      setScrollToIndex(index)
      if (mediaQueryWidth==='sm') 
        dispatchIsPreviewOpen({type: 'open'});
    }
  }
  // END OF Processing url route 

  const handleFavorite = (id) => {
    const fav = favoritesList || [] 
    fav.includes(id)
      ? setFavoritesList([ ...fav.filter((el) => el !== id) ])
      : setFavoritesList([ ...fav, id ])
    if(isPreviewOpen && favorites) 
      dispatchIsPreviewOpen({ type: 'close' });
  }


  return (
    <LocaleContext.Provider value={labels}>
      <MediaQueryContext.Provider value={mediaQueryWidth}>
        <Container sx={{minWidth: '350px', maxWidth: '1300px'}} maxWidth={false} disableGutters={true}>
          <AppBar onIconButtonClick={handleDrawerOpen} cat={currentCategory} catNames={categories}/>
            <Drawer open={drawerOpen} 
                    onClick={handleDrawerOpen}
                    onClose={(_, reason) => reason === 'backdropClick' && setDrawerOpen(false)}>
              <DrawerMenu 
                categories={categories} 
                sortOrder={sortOrder}
                handleCategoryClick={handleCategoryClick} 
                handleSearchClick={()=>{setSearchOpen(true)}} 
                handleAughtorsClick={()=>{setAughtorsOpen(true)}} 
                handleSort={handleSortOrder} />
            </Drawer>
          <Box style={{ width: '100%', height: '100vh' }}>
            <ModalPreview open={isPreviewOpen} handleClose={handleCloseModal}>
              <PreviewSection 
                item={ currentItem }
                isFavorite = { favoritesList && favoritesList.includes(currentItem.photo_num)} 
                onFavoriteClick = {handleFavorite}  />
            </ModalPreview>
            <ModalCenter open={searchOpen} handleClose={()=>setSearchOpen(false)} >
              <SearchTextField handleClose={()=>setSearchOpen(false)}/>
            </ModalCenter>
            <ModalCenter open={aughtorsOpen} handleClose={()=>setAughtorsOpen(false)} >
              <ArtistsList priceList={initProductsList} handleClose={()=>setAughtorsOpen(false)} />
            </ModalCenter>
            <Box sx={{ height: '48px' }} />
            <Box
              sx={{ display: 'flex', height: 'calc(100% - 50px)' }}
            >
              <Box sx={{ flexGrow: 1, display: 'flex' }}>
                <Box p={1} sx={{width: "50%", display: {xs:"none", md:"block"} }}>
                  <PreviewSection 
                    item={{...currentItem}} 
                    isFavorite = { favoritesList && favoritesList.includes(currentItem.photo_num)} 
                    onFavoriteClick = {handleFavorite} 
                  />
                </Box>
                <Box sx={{ flexGrow: 1, position: 'relative' }}>
                  <IsPreviewOpenDispatchContext.Provider value={dispatchIsPreviewOpen}>
                    <CurrentItemDispatchContext.Provider value={dispatchCurrentItem}>
                      <FavoritesContext.Provider value={{favoritesList, handleFavorite}}>
                      {!productsList.length && 
                          <Box sx={{ width: '100%',height: '100%', position: 'absolute',
                            display: "flex", justifyContent: "center", alignItems: "center"
                          }}>
                            {labels.errors.paintingsNotFound}
                          </Box>}
                        <GalleryScrollContainer items={productsList} index={scrollToIndex} />
                      </FavoritesContext.Provider>
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
