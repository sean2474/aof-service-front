'use client';

import { FaPlus, FaXmark, FaCheck } from "react-icons/fa6";
import { BoxProps, Box, Center, Flex } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ServiceHour, Student, Teacher, TeacherInfo } from "users";
import * as Yup from 'yup';
import { HourInput, HourTypeSelect, InputField } from "@/components/input";

interface ServiceFormProps extends BoxProps {
  initialValues: ServiceHour;
  borderw: number;
  student?: Student;
  setStudent: Dispatch<SetStateAction<Student | undefined>>;
}

const StudentInputForm = (serviceFormProps: ServiceFormProps) => {
  const [ emailInput, setEmailInput ] = useState<string>('');
  const [ emailFocused, setEmailFocused ] = useState<boolean>(false);

  const [ formError, setFormError ] = useState<string>('');
  const [ teacherInfos, setTeacherInfos ] = useState<Array<TeacherInfo>>([]);
  const [ filteredTeacherInfos, setFilteredTeacherInfos ] = useState<Array<TeacherInfo>>([]);
  const [ insertActivated, setInsertActivated ] = useState<boolean>(false);
  
  useEffect(() => {
    fetch('/api/teacher-list')
    .then(res => res.json())
    .then(data => setTeacherInfos(data.teacherInfos))
    .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    if (!teacherInfos) return;
    if (emailInput == '') {
      setFilteredTeacherInfos([]);
      return;
    }
    setFilteredTeacherInfos(teacherInfos.filter((teacherInfo) => 
      teacherInfo.name.toLowerCase().includes(emailInput)
      || teacherInfo.lastName.toLowerCase().includes(emailInput)
      || teacherInfo.email.split('@')[0].includes(emailInput)
    ));
  }, [emailInput, teacherInfos]);
  const boxProps: BoxProps = serviceFormProps;
  
  return (
    <>
      <Center 
        border={`solid ${serviceFormProps.borderw}px black`} textAlign={'center'} 
        w={'90%'} h={'60px'} maxW={'900px'} m={'auto'} mb={2} 
        bgColor={'white'}
      >
        {!insertActivated
          ? <Center onClick={()=>setInsertActivated(true)} cursor={'pointer'}>
            <Center m={3} p={1} boxSize={8} border={'solid 2.5px black'} borderRadius={'10px'}>
              <FaPlus />
            </Center>
            request for new service hour
          </Center>
          : <Formik
            initialValues={serviceFormProps.initialValues}
            validationSchema={Yup.object({
              hourName: Yup.string().required('Hour name is empty!'),
              hourType: Yup.number().min(1, 'Hour type is not selected!'),
              hours: Yup.number().min(1, 'You typed 0 hour!'),
              teacherEmail: Yup.string().required('Teacher email is empty!')
            })}
            onSubmit={(values, actions) => {
              if (teacherInfos.filter((teacherInfo) => teacherInfo.email == values.teacherEmail).length == 0) {
                actions.setErrors({teacherEmail: 'Teacher email is not found!'});
                return;
              }
              // fetch and if successful
              serviceFormProps.setStudent((prevStudent) => {
                if (!prevStudent) return prevStudent;
                const newStudent = {...prevStudent};
                newStudent.serviceHours = [...newStudent.serviceHours, values];
                return newStudent;
              });
              setInsertActivated(false);
              actions.resetForm();
            }}
          >
            {props => {
              const errors = props.errors;
              let errorMessage = '';
              Object.keys(props.touched).reverse().forEach((key) => {
                if (errors[key as keyof typeof errors] !== undefined) {
                  errorMessage = errors[key as keyof typeof errors] ?? '';
                  return;
                }
              });
              setFormError(errorMessage);
              return (
                <Form>
                  <Center gap={2} px={2}>
                    <InputField 
                      borderw={serviceFormProps.borderw} isInvalid={(props.errors.hourName && props.touched.hourName) as boolean} 
                      placeholder={'hour name'} {...props.getFieldProps('hourName')} 
                    />
                    <HourTypeSelect 
                      isInvalid={(props.errors.hourType && props.touched.hourType) as boolean}
                      hourTypes={Object.values(serviceFormProps.student?.hourTypes ?? {})} 
                      borderw={serviceFormProps.borderw} {...props.getFieldProps('hourTypes')} />
                    <HourInput borderw={serviceFormProps.borderw} props={props} />
                    <Box minW={'240px'} pos={'relative'}>
                      <InputField 
                        autoComplete={'off'}
                        onFocus={()=>setEmailFocused(true)} onBlurCapture={()=>setEmailFocused(false)}
                        borderw={serviceFormProps.borderw} placeholder={'teacher email'} 
                        isInvalid={(props.errors.teacherEmail && props.touched.teacherEmail) as boolean} 
                        onChangeCapture={e => setEmailInput(e.currentTarget.value)} {...props.getFieldProps('teacherEmail')}
                      />
                      {emailFocused && filteredTeacherInfos.length != 0 && <Flex pos={'absolute'} flexDir={'column'} minW={'240px'} 
                        transform={'translate(0, 2%)'}
                        border={`solid ${serviceFormProps.borderw}px black`}
                      >
                        {filteredTeacherInfos.slice(0, 3).map((teacherInfo, i) => 
                          <Center 
                            w={'100%'} h={'65px'} key={i} p={1}
                            borderBottom={(i==2 || (filteredTeacherInfos.length<3 && i==filteredTeacherInfos.length-1)) ? '' : `solid ${serviceFormProps.borderw}px black`} 
                            bgColor={'white'} onMouseDown={()=>{
                              props.setFieldValue('teacherEmail', teacherInfo.email);
                              setEmailInput('');
                              setFilteredTeacherInfos([]);
                            }} cursor={'pointer'}
                          >
                            {teacherInfo.name} {teacherInfo.lastName} ({teacherInfo.email})
                          </Center>
                        )}
                      </Flex>}
                    </Box>
                    <Flex mx={3} gap={2}>
                      <Center 
                        p={1} boxSize={8} border={'solid 2.5px black'} borderRadius={'10px'} bgColor={'red.400'} 
                        onClick={()=>{setInsertActivated(false); props.resetForm(); setFormError('')}} cursor={'pointer'} _active={{bgColor: 'red.500'}}
                      ><FaXmark /></Center>
                      <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <Center p={1} boxSize={8} border={'solid 2.5px black'} borderRadius={'10px'} bgColor={'green.400'} _active={{bgColor: 'green.500'}}>
                          <FaCheck />
                        </Center>
                      </button>
                    </Flex>
                  </Center>
                </Form>
              )
            }
          }
          </Formik>
        }
      </Center>
      <Box m={'auto'} mb={10} color={'#E53E3E'}>
        {formError && <Box border={`solid ${serviceFormProps.borderw}px #E53E3E`} bg={'white'} px={3} py={1}>{formError}</Box>}
      </Box>
    </>
  )
};

interface TeacherFormProps extends BoxProps {
  initialValues: ServiceHourWithStudentEmail;
  borderw: number;
  teacher?: Teacher;
  setTeacher: Dispatch<SetStateAction<Teacher | undefined>>;
}

interface ServiceHourWithStudentEmail extends ServiceHour {
  studentEmail: string;
}

const TeacherForm = (teacherFormProps: TeacherFormProps) => {
  const [formError, setFormError] = useState<string>('');
  const [insertActivated, setInsertActivated] = useState<boolean>(false);

  return (
    <>
      <Center 
        border={`solid ${teacherFormProps.borderw}px black`} textAlign={'center'} 
        w={'100%'} h={'60px'} maxW={'900px'} m={'auto'} mb={2} 
        bgColor={'white'}
      >
        {!insertActivated
          ? <Center onClick={()=>setInsertActivated(true)} cursor={'pointer'}>
            <Center m={3} p={1} boxSize={8} border={'solid 2.5px black'} borderRadius={'10px'}>
              <FaPlus />
            </Center>
            Create new service hour
          </Center>
          : <Formik
            initialValues={teacherFormProps.initialValues}
            validationSchema={Yup.object({
              hourName: Yup.string().required('Hour name is empty!'),
              hourType: Yup.number().min(1, 'Hour type is not selected!'),
              hours: Yup.number().min(1, 'You typed 0 hour!'),
              studentEmail: Yup.string().required('Student email is empty!').email('Invalid email format!')
            })}
            onSubmit={(values, actions) => {
              // fetch and if successful
              teacherFormProps.setTeacher((prevTeacher) => {
                if (!prevTeacher) return prevTeacher;
                const newTeacher: Teacher = { ...prevTeacher };
                const studentIndex = newTeacher.students.findIndex((student) => student.email === values.studentEmail);
                
                const newServiceHour: ServiceHour = { ...values };
                
                if (studentIndex === -1) {
                  // If the student is not found, 
                  // fetch student name from server
                  // and add a new student with the service hour
                  const newStudent = {
                    name: '', // fetch from server by email
                    email: values.studentEmail,
                    serviceHours: [newServiceHour],
                    totalHours: newServiceHour.hours,  // Assuming totalHours is the sum of hours
                    memorialPinStatus: 'Not Awarded',
                    hourTypes: teacherFormProps.teacher!.hourTypes,
                  };
                  newTeacher.students.push(newStudent);
                } else {
                  // If the student is found, add the service hour to the student
                  const updatedStudent = {
                    ...newTeacher.students[studentIndex],
                    serviceHours: [...newTeacher.students[studentIndex].serviceHours, newServiceHour],
                    totalHours: newTeacher.students[studentIndex].totalHours + newServiceHour.hours,
                  };
                  newTeacher.students[studentIndex] = updatedStudent;
                }
                
                return newTeacher;
              });
              
              setInsertActivated(false);
              actions.resetForm();
            }}
          >
            {props => {
              const errors = props.errors;
              let errorMessage = '';
              Object.keys(props.touched).reverse().forEach((key) => {
                if (errors[key as keyof typeof errors] !== undefined) {
                  errorMessage = errors[key as keyof typeof errors] ?? '';
                  return;
                }
              });
              setFormError(errorMessage);
              return (
                <Form>
                  <Center gap={2} px={2}>
                    <InputField 
                      borderw={teacherFormProps.borderw} isInvalid={(props.errors.studentEmail && props.touched.studentEmail) as boolean} 
                      placeholder={'student email'} {...props.getFieldProps('studentEmail')} 
                    />
                    <InputField 
                      borderw={teacherFormProps.borderw} isInvalid={(props.errors.hourName && props.touched.hourName) as boolean} 
                      placeholder={'hour name'} {...props.getFieldProps('hourName')} 
                    />
                    <HourTypeSelect 
                      isInvalid={(props.errors.hourType && props.touched.hourType) as boolean}
                      hourTypes={Object.values(teacherFormProps.teacher?.hourTypes ?? {})} 
                      borderw={teacherFormProps.borderw} {...props.getFieldProps('hourTypes')} />
                    <HourInput borderw={teacherFormProps.borderw} props={props} />
                    <Flex mx={3} gap={2}>
                      <Center 
                        p={1} boxSize={8} border={'solid 2.5px black'} borderRadius={'10px'} bgColor={'red.400'} 
                        onClick={()=>{setInsertActivated(false); props.resetForm(); setFormError('')}} cursor={'pointer'} _active={{bgColor: 'red.500'}}
                      ><FaXmark /></Center>
                      <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <Center p={1} boxSize={8} border={'solid 2.5px black'} borderRadius={'10px'} bgColor={'green.400'} _active={{bgColor: 'green.500'}}>
                          <FaCheck />
                        </Center>
                      </button>
                    </Flex>
                  </Center>
                </Form>
              )
            }}
          </Formik>
        }
      </Center>
      <Box m={'auto'} mb={10} color={'#E53E3E'}>
        {formError && <Box border={`solid ${teacherFormProps.borderw}px #E53E3E`} bg={'white'} px={3} py={1}>{formError}</Box>}
      </Box>
    </>
  )
};


export { StudentInputForm, TeacherForm };
export type { ServiceFormProps, TeacherFormProps };