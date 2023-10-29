import { BoxProps, Table, TableContainer, Box, Tbody, Td, Tfoot, Th, Thead, Tr, Center } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaXmark, FaCheck } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
import { Student } from "users";

interface StudentTableProps extends BoxProps {
  borderw: number;
  student?: Student;
}

const StudentTable = (props: StudentTableProps) => {
  const tableTitles = ['Hour Name', 'Hour Type', 'Hours', 'Teacher Email', 'Status'];
  const BORDER_W = props.borderw;
  const student = props.student;

  return (
    <TableContainer maxW={'900px'} w={'90%'} m={'auto'} {...props}>
      <Table variant={'unstyled'}>
        <Thead>
          <Tr>
            {tableTitles.map((v, i) => <Th key={i} textAlign={'center'}>{v}</Th>)}
          </Tr>
        </Thead>
        <Tbody bgColor={'white'}>
          {student && student.serviceHours 
          && student.serviceHours.map((v, i) => {
            const statusColor = new Map<string, string>();
            statusColor.set('Pending', 'grey');
            statusColor.set('Confirmed', 'green');
            statusColor.set('Denied', 'red');
            return (
              <Tr key={i} border={`solid ${BORDER_W}px black`}>
                <Td textAlign={'center'}>{v.hourName}</Td>
                <Td textAlign={'center'}>{student.hourTypes[v.hourType]}</Td>
                <Td textAlign={'center'}>{v.hours}</Td>
                <Td textAlign={'center'}>{v.teacherEmail}</Td>
                <Td textAlign={'center'} color={statusColor.get(v.status)}>{v.status}</Td>
              </Tr>
            )})
          }
        </Tbody>
        {student && student.serviceHours.length > 10 && <Tfoot>
          <Tr>
            {tableTitles.map((v, i) => {
              return (
                <Th key={i} textAlign={'center'}>{v}</Th>
              )})
            }
          </Tr>
        </Tfoot>}
      </Table>
    </TableContainer>
  )
}

interface TeacherTableProps extends BoxProps {
  borderw: number;
  hourTypes?: Array<string>;
  students?: Array<Student>;
}

const TeacherTable = (props: TeacherTableProps) => {
  
  const tableTitles = ['Student email' ,'Hour Name', 'Hour Type', 'Hours', 'Status'];
  const BORDER_W = props.borderw;
  
  const [students, setStudents] = useState<Student[]>(props.students || []);
  
  useEffect(() => {
    setStudents(props.students || []);
  }, [props.students]);

  const handleStatusChange = (hourId: number, newStatus: 'Pending' | 'Confirmed' | 'Denied') => {
    const updatedStudents = students.map(student => {
      return {
        ...student,
        serviceHours: student.serviceHours.map(serviceHour => {
          if (serviceHour.id === hourId) {
            return {
              ...serviceHour,
              status: newStatus
            };
          }
          return serviceHour; // this will retain the original status of other serviceHours
        })
      };
    });
    setStudents(updatedStudents);
  }
  
  const StudentNameTable = (studentTableProps: StudentTableProps) => {
    const student = studentTableProps.student!;
    
    return (
      <>{student.serviceHours.map((v, i) => 
        <Tr key={i} border={`solid ${BORDER_W}px black`}>
          <Td textAlign={'center'}>{student.email}</Td>
          <Td textAlign={'center'}>{v.hourName}</Td>
          <Td textAlign={'center'}>{props.hourTypes![v.hourType]}</Td>
          <Td textAlign={'center'}>{v.hours}</Td>
          <Td textAlign={'center'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
            {v.status === 'Pending' 
              ? <>
                <Center
                  p={1} border={'solid 2.5px black'} borderRadius={'10px'} bgColor={'red.400'} 
                  cursor={'pointer'} _active={{bgColor: 'red.500'}} mr={1} onClick={() => handleStatusChange(v.id, 'Denied')}
                >
                  <FaXmark />
                </Center>
                <Center
                  p={1} border={'solid 2.5px black'} borderRadius={'10px'} bgColor={'green.400'} 
                  cursor={'pointer'} _active={{bgColor: 'green.500'}} onClick={() => handleStatusChange(v.id, 'Confirmed')}
                >
                  <FaCheck />
                </Center>
              </>
              : <Center gap={1}>
                <Box color={v.status == 'Confirmed' ? 'green' : 'red'}>
                  {v.status} 
                </Box>
                <Center cursor={'pointer'} onClick={() => handleStatusChange(v.id, "Pending")}>
                  <FaXmark />
                </Center>
              </Center>
            }
          </Td>
          <Td textAlign={'center'}>
            <Center
              p={1} boxSize={8} border={'solid 2.5px black'} borderRadius={'10px'} bgColor={'red.400'} 
              cursor={'pointer'} _active={{bgColor: 'red.500'}} onClick={() => handleStatusChange(v.id, 'Denied')}
            >
              <MdDeleteOutline />
            </Center>
          </Td>
        </Tr>
      )}
      </>
    )
  }

  return (
    <TableContainer maxW={'900px'} w={'90%'} m={'auto'}>
      <Table variant={'unstyled'}>
        <Thead>
          <Tr>
            {tableTitles.map((v, i) => <Th key={i} textAlign={'center'}>{v}</Th>)}
          </Tr>
        </Thead>
        <Tbody bgColor={'white'}>
          {students && students.map((student, i) => 
            <StudentNameTable student={student} key={i} borderw={2.5} />
          )}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export { StudentTable, TeacherTable }