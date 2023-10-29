import { AbsoluteCenter, Input, InputProps, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, SelectProps } from "@chakra-ui/react";
import { FormikProps } from "formik";

interface InputFieldProps extends InputProps {
  borderw: number;
}

const InputField = (props: InputFieldProps) => {
  return (
    <Input
      border={'none'} borderBottom={`solid ${props.borderw}px black`} borderRadius={0} boxShadow={'none !important'}
      _focus={{border: 'none', borderBottom: `${props.borderw}px solid #3182ce`, outline: 'none'}}
      {...props}
    />
  )
}

interface HourTypeSelectProps extends SelectProps {
  hourTypes: Array<string>;
  borderw: number;
}

const HourTypeSelect = (props: HourTypeSelectProps) => {
  return (
    <Select 
      placeholder={'select hour type'} variant={'flushed'} boxShadow={'none !important'}
      border={'none'}  borderBottom={`${props.borderw}px solid black`} 
      _hover={{border: 'none', borderBottom: `${props.borderw}px solid #cbd5e0`, outline: 'none'}}
      _focus={{border: 'none', borderBottom: `${props.borderw}px solid #3182ce`, outline: 'none'}}
      {...props}
    >
      {props.hourTypes.map((v, i) => 
        <option style={{color: 'black !important'}} key={i} value={i+1}>{v}</option>
      )}
    </Select>
  )
}

const HourInput = ({borderw, props}: {borderw: number, props: FormikProps<any>}) => {
  return (
    <NumberInput 
      defaultValue={1} min={1} max={20} minW={'120px'} pos={'relative'} 
      isInvalid={(props.errors.hours && props.touched.hours) as boolean} 
    >
      <NumberInputField borderColor={'black'} borderWidth={borderw+"px"} {...props.getFieldProps('hours')} />
      <AbsoluteCenter> hours </AbsoluteCenter>
      <NumberInputStepper>
        <NumberIncrementStepper border={'none'} _active={{}} />
        <NumberDecrementStepper border={'none'} _active={{}} />
      </NumberInputStepper>
    </NumberInput>
  )
}

export { InputField, HourTypeSelect, HourInput };