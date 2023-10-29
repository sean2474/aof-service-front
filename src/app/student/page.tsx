'use client';

import { Box, Flex, Heading } from "@chakra-ui/react";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Student } from "users";
import { StudentInputForm } from "@/widget/form";
import { StudentTable } from "@/widget/tables";
import { ProgressBar } from "@/components/progressBar";
import { TotalHourHeading } from "@/components/heading";
import { PointerBar, PointerCenter } from "@/components/pointer";
import { SignOutBtn } from "@/components/btns";

const HOUR_REQUIERMENTS = 30;
const R = 300;
const BORDER_W = 2.5;

export default function Home() {
  const gradient = generateGradientSteps([111,255,154,1], [0,212,255,1], 8);
  
  const { data: session } = useSession();

  const [ student, setStudent ] = useState<Student>();
  
  const [ pointerDeg, setPointerDeg ] = useState<number>(0);
  const [ pointerColor, setPointerColor ] = useState<string>('rgb(111,255,154)');
  const [ isLoaded, setIsLoaded ] = useState<boolean>(false);

  useEffect(() => {
    if (session === null) location.href = '/';
    if (!session || !session.user) return;
    // if student email but no data, recieve empty data
    // if teacher email, 404 error, message: this user is teacher -> redirect to teacher page
    // if admin email, 404 error, message: this user is admin -> redirect to admin page
    // if external email, 404 error, message: this user is external -> sign out and redirect to /
    fetch('/api/student?' + new URLSearchParams('email='+session.user.email))
    .then(res => res.json())
    .then(data => setStudent(data.student))
    .catch(err => console.log(err));
    setIsLoaded(true);
  }, [session]);


  useEffect(() => {
    if (!student) return;
    const hours = student.totalHours > 30 ? 30 : student.totalHours;
    const deg = 180 * hours / HOUR_REQUIERMENTS;
    setPointerColor(gradient[Math.floor(hours / HOUR_REQUIERMENTS * gradient.length)]);
    setPointerDeg(deg);
  }, [gradient, student]);

  if (session) return (
    <Flex p={10} justifyContent={'center'} flexDir={'column'}>
      <SignOutBtn />
      <Heading fontSize={'6xl'} m={'auto'} mb={10}> Service Hour Tracker </Heading>
      <Box pos={'relative'} m={'auto'}>
        <ProgressBar r={R} borderw={BORDER_W} gradient={gradient} steps={8}/>
        <PointerBar deg={pointerDeg} r={R/1.5} pos={'absolute'} left={'50%'} bottom={'3%'} pointerborderw={BORDER_W}/>
        <PointerCenter r={R/4} centercolor={pointerColor} pos={'absolute'} left={'50%'} bottom={'5%'} transform={'translate(-50%, 50%);'} />
      </Box>
      <Flex w={R*2} m={'auto'} justifyContent={'space-between'} mb={5} fontSize={'xl'} py={1} fontWeight={'bold'}>
        <Box>0</Box>
        <Box>30</Box>
      </Flex>
      <Box m={'auto'} textAlign={'center'}>
        {isLoaded ? student && <TotalHourHeading hour={student.totalHours}/>: <Heading>Total Hours: 0 hour</Heading>}
      </Box>
      <Box m={'auto'} mb={5}>
        {isLoaded && student && <Heading size={'md'} color={'gray'}> Memorial Pin: {student.memorialPinStatus} </Heading>}
      </Box>
      <StudentInputForm
        initialValues={{id: 0, hourName: '', hourType: 0, hours: 1, teacherEmail: '', status: 'Pending'}}
        student={student} setStudent={setStudent}
        borderw={BORDER_W}
      />
      <StudentTable borderw={BORDER_W} student={student} />
    </Flex>
  );
  return (<></>);
}

const generateGradientSteps = (startColor: Array<number>, endColor: Array<number>, steps: number): Array<string> => {
  let gradientSteps = [];
  
  for (let i = 0; i < steps; i++) {
    let t = i / (steps - 1);
    
    let r = Math.round((1 - t) * startColor[0] + t * endColor[0]);
    let g = Math.round((1 - t) * startColor[1] + t * endColor[1]);
    let b = Math.round((1 - t) * startColor[2] + t * endColor[2]);
    let a = (1 - t) * startColor[3] + t * endColor[3];
    
    gradientSteps.push(`rgba(${r},${g},${b},${a})`);
  }
  
  return gradientSteps;
}