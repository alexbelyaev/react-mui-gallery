import { useState, useEffect } from 'react';

function useImageLoader( delay = 0 ) {
  // Delay is uded for fade effect
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imagePreload, setImagePreload] = useState(null);
  const [image, setImage] = useState(null);
  const [urlState, setUrlState] = useState();
  const [isDelayed, setIsDelayed] = useState(false);

  const fetchImage = async (url) => {
    //setImage(null)
    setImageLoaded(false);
    setUrlState(url);
    try {
      const response = await fetch(url);
      if (response.ok) {
        const blob = await response.blob();
        setImagePreload(URL.createObjectURL(blob));
      }
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  useEffect(() => {
    if (imagePreload !== image && !isDelayed) {
      setImage(imagePreload);
      setImageLoaded(true);
    }
  }, [imagePreload, isDelayed, image]);

  useEffect(() => {
    if ( delay > 0 ) {
      setIsDelayed(true)
      const timeoutId = setTimeout(()=>setIsDelayed(false),500)
      return ()=>clearTimeout(timeoutId)
    }
  }, [urlState]);

  return { imageLoaded, image, fetchImage };
}

export default useImageLoader;
