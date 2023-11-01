'use client';

import { FaSearch } from "react-icons/fa";
import { Box, Center, Checkbox, Flex, Heading, Input, InputGroup, InputLeftElement, Stack } from "@chakra-ui/react";
import { SignOutBtn } from "@/components/btns";
import { useEffect, useState } from "react";
import { Student, Teacher } from "users";
import { useSession } from "next-auth/react";
import { TeacherTable } from "@/widget/tables";
import { TeacherForm } from "@/widget/form";

export default function Home() {
  const { data: session } = useSession();
  const [ teacher, setTeacher ] = useState<Teacher>();
  const [ searchTxt, setSearchTxt ] = useState<string>('');
  const [ filteredStudents, setFilteredStudents ] = useState<Array<Student>>([]);
  const [ checked, setChecked ] = useState<Array<boolean>>([true, false, false]);

  const setCheckedHandler = (i: number, v: boolean) => {
    let newChecked = checked.slice();
    newChecked[i] = v;
    setChecked(newChecked);
  }

  useEffect(() => {
    // if (session === null) location.href = '/';
    if (!session || !session.user) return;
    fetch('/api/teacher?' + new URLSearchParams('email='+session.user.email))
    .then(res => res.json())
    .then(data => setTeacher(data.teacher))
    .catch(err => console.log(err));
  }, [session]);

  useEffect(() => {
    if (!teacher || !teacher.students) return;

    let newFilteredStudents = teacher.students.filter((student) => 
      searchTxt === '' 
      || student.name.toLowerCase().includes(searchTxt)
      || student.email.split('@')[0].includes(searchTxt)
    );

    newFilteredStudents = newFilteredStudents.map(student => ({
      ...student,
      serviceHours: student.serviceHours.filter((serviceHour) => {
        if (checked[0] && serviceHour.status == 'Pending') return true;
        if (checked[1] && serviceHour.status == 'Confirmed') return true;
        if (checked[2] && serviceHour.status == 'Denied') return true;
        return false;
      })
    }));

    setFilteredStudents(newFilteredStudents);

  }, [searchTxt, teacher, checked]);


  return (
    <Flex p={10} justifyContent={'center'} flexDir={'column'}>
      <Flex mb={10}>
        <Heading m={5}>Teacher Page</Heading>
        <SignOutBtn />
      </Flex>
      <Center flexDir={'column'} maxW={'900px'} w={'90%'} m={'auto'}>
        <TeacherForm 
          teacher={teacher} setTeacher={setTeacher} 
          initialValues={{id: 0, hourName: '', hourType: 0, hours: 1, teacherEmail: '', status: 'Pending', studentEmail: ''}} 
          borderw={2.5} 
        />
        <InputGroup display={'flex'} h={'60px'}>
          <InputLeftElement>
            <FaSearch />
          </InputLeftElement>
          <Input 
            border={'solid 2.5px black'} borderRadius={0} bg={'white'} w={'100%'} 
            onChange={(e) => setSearchTxt(e.currentTarget.value)} placeholder="Search Student" 
          />
        </InputGroup>
        <Stack spacing={5} direction='row' mx={5} mt={1} mb={5}> 
          <Checkbox 
            colorScheme='gray' isChecked={checked[0]} defaultChecked
            onChange={(e)=>setCheckedHandler(0,e.currentTarget.checked)} 
          >
            Pending
          </Checkbox>
          <Checkbox 
            colorScheme='green' isChecked={checked[1]} 
            onChange={(e)=>setCheckedHandler(1,e.currentTarget.checked)}
          >
            Confirmed
          </Checkbox>
          <Checkbox 
            colorScheme='red' isChecked={checked[2]}
            onChange={(e)=>setCheckedHandler(2,e.currentTarget.checked)}
          >
            Rejected
          </Checkbox>
        </Stack>
      </Center>
      <TeacherTable borderw={2.5} hourTypes={teacher?.hourTypes} students={filteredStudents} />
    </Flex>
  );
}