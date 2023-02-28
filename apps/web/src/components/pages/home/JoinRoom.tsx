import { Box, Button, Heading, Input, Stack } from '@chakra-ui/react';
import { useHome } from '../../../hooks/pages/useHome';

export const JoinRoom = () => {
  const { joinRoom, loginForm, onChangeForm } = useHome();

  return (
    <>
      <Heading
        color={'gray.800'}
        lineHeight={1.1}
        fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
      >
        Join Room
      </Heading>
      <Box mt={10}>
        <Stack spacing={4}>
          <Input
            placeholder="username"
            bg={'gray.100'}
            border={0}
            _placeholder={{
              color: 'gray.500',
            }}
            onChange={({ target }) => onChangeForm('username', target.value)}
            value={loginForm.username}
          />
          <Input
            placeholder="room code"
            bg={'gray.100'}
            border={0}
            _placeholder={{
              color: 'gray.500',
            }}
            onChange={({ target }) => onChangeForm('roomCode', target.value)}
            value={loginForm.roomCode}
          />
        </Stack>
        <Button
          fontFamily={'heading'}
          mt={8}
          w={'full'}
          bgGradient="linear(to-r, red.400,pink.400)"
          color={'white'}
          _hover={{
            bgGradient: 'linear(to-r, red.400,pink.400)',
            boxShadow: 'xl',
          }}
          _active={{
            bgGradient: 'linear(to-r, red.400,pink.400)',
            boxShadow: 'xl',
          }}
          onClick={joinRoom}
        >
          Join
        </Button>
      </Box>
    </>
  );
};
