import React, {useState} from 'react';
import {TimeSplit} from "./typings/global";
import {tick, getTwoDaysFromNow} from "./utils/time";

interface CountdownProps {
  targetDate: string
}

const DEFAULT_TARGET_DATE = getTwoDaysFromNow();

const Countdown: StorefrontFunctionComponent<CountdownProps> = ({targetDate = DEFAULT_TARGET_DATE}) => {

  const [remainingTime, setTime] = useState<TimeSplit>({
    hours: '00',
     minutes: '00',
     seconds: '00'
  });

  tick(targetDate, setTime);

  return(
    <div>
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
