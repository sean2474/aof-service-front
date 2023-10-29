'use client';

import { AbsoluteCenter, Box, Button, Container, Flex, Heading } from "@chakra-ui/react";
import { useSession, signOut } from "next-auth/react";
import { GoogleLoginBtn } from "@/components/btns";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const [ userType, setUserType ] = useState<string|undefined>();

  useEffect(() => {
    if (!session || !session.user) return;
    fetch('/api/auth/check-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email: session.user.email})
    })
    .then(res => res.json())
    .then(data => setUserType(data.message))
    .catch(err => console.log(err));

    location.href = '/'+userType;
  }, [session, userType]);
  
  return (
    <AbsoluteCenter maxW={'500px'} w={'96%'}>
      { !session && 
        <Flex  
          flexDir={'column'} 
          h={'300px'} maxW={'500px'} w={'100%'}
          m={'auto'} bg={'white'} border={'solid 2.5px black'}
        >
          <Heading w={'90%'} m={'auto'} p={5} textAlign={'center'}> Sign in to track your service hour!</Heading>
          <Box w={'80%'} m={'auto'} mb={10}><GoogleLoginBtn /></Box>
        </Flex>
      }
    </AbsoluteCenter>
  );
}