import { Box, BoxProps } from "@chakra-ui/react";

interface ProgressBarProps extends BoxProps {
  gradient: Array<string>;
  steps: number;
  r?: number;
  borderw?: number;
}

const ProgressBar = (props: ProgressBarProps) => {
  const r = props.r || 600;
  const borderW = props.borderw || 2.5;
  const colors = props.gradient;
  return (
    <Box w={r*2} h={r} pos={'relative'} borderBottom={`${borderW}px solid black`} {...props}>
      {
        colors.map((color, i) => {
          const deg = 180/colors.length*i+180;
          const p = (1 - Math.tan(Math.PI/colors.length)) * 100;
          return (
            <Box
              pos={'absolute'} key={i}
              border={i == 0 ? '' : `${borderW}px solid black`}
              borderTop={`${borderW}px solid black`}
              borderLeft={`${borderW}px solid black`}
              w={r*2} h={r}
              left={'0'} bottom={'0'}
              bg={color}
              borderTopRadius={r*2}
              transformOrigin={'bottom center'}
              transform={`rotate(${deg+180}deg)`}
              clipPath={`polygon(0 100%, 50% 100%, 0 ${p}%)`}
            >
            </Box>
          );
        })
      }
      <Box 
        border={`${borderW}px solid black`}
        borderBottom={'var(--bg-color)'}
        pos={'absolute'} w={r} h={r/2} bg={'var(--bg-color)'} 
        borderTopRadius={r}
        bottom={0} left={'50%'} transform={'translate(-50%, 0%)'}
      />
      <Box 
        pos={'absolute'} w={r-borderW*2} h={r/2} bg={'var(--bg-color)'} 
        borderTopRadius={r}
        bottom={0} left={'50%'} transform={`translate(-50%, ${borderW*2}%)`}
      />
    </Box>
  );
}

export { ProgressBar }