'use client';

import { Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const TotalHourHeading = ({ hour }: {hour: number}) => {
  const [currentHr, setCurrentHr] = useState(0)

  useEffect(() => {
    let requestId: number | null = null

    const scrambleText = () => {
      setCurrentHr(prevHr => {
        const newHr = prevHr + 0.08;
        // Stop the animation when reaching or exceeding the target hour
        if (newHr >= hour) {
          cancelAnimationFrame(requestId!)
          return hour;
        }
        return newHr;
      })
      requestId = requestAnimationFrame(scrambleText)
    }
    requestId = requestAnimationFrame(scrambleText)

    return () => {
      if (requestId) {
        cancelAnimationFrame(requestId)
      }
    }
  }, [hour]); 

  return (
    <Heading>
      Total Hour: {Math.floor(currentHr)} hours
    </Heading>
  )
}

export { TotalHourHeading }