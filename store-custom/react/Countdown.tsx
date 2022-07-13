import React, {useState, useEffect} from 'react';
import {TimeSplit} from "./typings/global";
import {tick, getTwoDaysFromNow} from "./utils/time";
import { useCssHandles } from 'vtex.css-handles';
import {useQuery} from "react-apollo";
import useProduct from "vtex.product-context/useProduct";
import productReleaseDate from './graphql/productReleaseDate.graphql';

const DEFAULT_TARGET_DATE = getTwoDaysFromNow();

const Countdown: StorefrontFunctionComponent = () => {


  //Countdown
  const [remainingTime, setTime] = useState<TimeSplit>({
    hours: '00',
     minutes: '00',
     seconds: '00'
  });

  const [isReleased, setIsRelased] = useState(false);
  const [releasedDate, setRelasedDate] = useState("");

  const CSS_HANDLES = ['countdown']
  const handles = useCssHandles(CSS_HANDLES);

  //Product
  const {product} = useProduct();



  const { data, loading, error } = useQuery(productReleaseDate, {
    variables: {
      slug: product?.linkText
    },
    ssr: false
  })
  
  useEffect(() => {
    if (data) {
      const releasedDate = new Date(data.product.releaseDate)
      const releaseDateMilliSeconds = releasedDate.getTime();
      const today = new Date().getTime();
      today > releaseDateMilliSeconds && setIsRelased(true);
      setRelasedDate(releasedDate.toLocaleDateString());
    }
  }, [data]);
  
  if (!product) {
    return (
      <div>
        <span>There is no product context.</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div>
        <span>Loading...</span>
      </div>
    )
  }
  if (error) {
    return (
      <div>
        <span>Error!</span>
      </div>
    )
  }

  if (isReleased) {
    return (
      <div>
        <p>Product released on {`${releasedDate}`}</p>
      </div>
    )
  }
    
  tick(data?.product?.releaseDate || DEFAULT_TARGET_DATE, setTime);

  return(
      <div className={`${handles.countdown} db tc`}>
        <h1>{`${remainingTime.hours}:${remainingTime.minutes}:${remainingTime.seconds}`}</h1>
      </div>
  )
}

Countdown.schema = {
  title: 'editor.countdown.title',
  description: 'editor.countdown.description',
  type: 'object',
    properties: {
      targetDate: {
        title: 'Final date',
        description: 'Final date used in the countdown',
        type: 'string',
        default: null,
      }
  },
}

export default Countdown
