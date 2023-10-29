'use client';

import Image from 'next/image'; 
import { signIn, signOut } from 'next-auth/react';
import { Box, Center, Link } from '@chakra-ui/react';

export const GoogleLoginBtn = ({text}: {text?: String}) => {
  const handleGoogleLogin = () => {
    signIn('google');
  };
  return (
    <Center
      w={'100%'} h={'40px'}
      borderRadius={'5px'} 
      bgColor={'white'}
      border={'#888 solid 2.5px'} 
      color={'#444'}
      >
      <Link 
        onClick={handleGoogleLogin}
        display={'flex'} w={'100%'} 
        justifyContent={'flex-start'} alignItems={'center'}
        >
        <Center 
          w={'50px'} h={'40px'} maxW={'50px'} maxH={'40px'}
          borderRadius={'5px 0 0 5px'}
          borderRight={'#888 solid 2.5px'}
        >
          <Box
            w={'100%'} h={'100%'} padding={'10px'}
            >
            <Image src="https://authjs.dev/img/providers/google.svg" alt="Google logo" width={20} height={20} layout='responsive'/>
          </Box>
        </Center>
        <Box 
          w={'100%'} margin={'0 40px 0 0'}
          textAlign={'center'} fontSize={'1rem'} 
          fontWeight={'600'} 
          > {text || 'Google Login'} </Box>
      </Link>
    </Center>
  )
}

export const SignOutBtn = () => {
  const handleSignout = async () => {
    await signOut();
    location.href = '/';
  }
  return (
    <Box w={'fit-content'} m={'auto'} mr={0} mt={0}
      border={`solid ${2.5}px black`} p={2} px={3}
      bg={'white'} fontSize={'2xl'} cursor={'pointer'}
      _hover={{bg: 'gray.100'}}
      onClick={handleSignout} >
      Sign out
    </Box>
  )
}