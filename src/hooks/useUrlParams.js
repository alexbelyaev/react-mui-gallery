import { useParams } from 'react-router-dom';

export default function useUrlParams() {
  const { category, id, query } = useParams();

  // if category is not 2 digit number it is ID
  if (!id && !/^[0-9]{1,2}$/i.test(category)) {
    return [id, category, query]
  }
  
  return [category, id, query];
}