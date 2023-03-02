import { Box, Button, Heading, Input, Stack } from '@chakra-ui/react';
import { useHome } from '../../../hooks/pages/useHome';

export const CreateRoom = () => {
  const { loginForm, onChangeForm, createRoom } = useHome();

  return (
    <>
      <Heading
        color={'gray.800'}
        lineHeight={1.1}
        fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
      >
        Create Room
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
          onClick={createRoom}
        >
          Create
        </Button>
      </Box>
    </>
  );
};