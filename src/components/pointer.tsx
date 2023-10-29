import { Box, BoxProps } from "@chakra-ui/react";

interface PointerProps extends BoxProps {
  deg?: number;
  r: number;
  pointerborderw?: number;
}

const PointerBar = (props: PointerProps) => {
  const deg = (props.deg || 0) - 180;
  const pointerBorderW = props.pointerborderw || 2.5;
  return (
    <Box
      transformOrigin={'0 50%'}
      transform={`rotate(${deg}deg)`}
      w={props.r/2} h={props.r/16}
      bg={'grey'} borderRadius={props.r/16}
      border={`${pointerBorderW}px solid black`}
      transition={'transform 1s ease-in-out'}
      {...props}
    />
  );
}

interface PointerCenterProps extends BoxProps {
  r: number;
  centercolor: string;
  pointerBorderW?: number;
}

const PointerCenter = (props: PointerCenterProps) => {
  const pointerBorderW = props.pointerBorderW || 2.5;
  return (
    <Box
      w={props.r} h={props.r}
      bgColor={props.centercolor}
      borderRadius={props.r} border={`${pointerBorderW}px solid black`}
      transition={'background-color 1s ease-in-out'}
      {...props}
    />
  );
}

export { PointerBar, PointerCenter }