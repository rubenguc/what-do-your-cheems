import {
  Button,
  Divider,
  Heading,
  HStack,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { RoomConfig, WaitingPlayers } from '../components/pages/waitingRoom';
import { BiCopy } from 'react-icons/bi';
import { useUserContext, useWaitingRoom } from '@wdyc/game';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/common/useToast';

export const WaitingRoom = () => {
  const navigate = useNavigate();
  const { showErrorToast } = useToast();

  const { user, clear } = useUserContext();

  const onClear = () => {
    localStorage.removeItem('user');
    clear();
  };

  const {
    players,
    startGame,
    roomConfig,
    onChangeRoomConfig,
    isRoomCreator,
    leaveRoom,
    isLoading,
    closeRoom,
  } = useWaitingRoom({
    navigate,
    onShowError: showErrorToast,
    onClear,
  });

  const { isOpen, onToggle, onClose } = useDisclosure();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(user.roomCode);
      onToggle();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Stack
      mt="40"
      bg={'gray.50'}
      rounded={'xl'}
      p={4}
      spacing={{ base: 8 }}
      maxW={{ lg: 'lg' }}
      w="full"
      mx="auto"
      zIndex="99999"
    >
      <Heading
        color={'gray.800'}
        lineHeight={1.1}
        textAlign="center"
        fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
      >
        Waiting Room
      </Heading>
      <HStack>
        <Text color={'gray.800'} fontSize="3xl" fontWeight="bold">
          code: {user.roomCode}
        </Text>
        {user.roomCode && (
          <Popover
            returnFocusOnClose={false}
            isOpen={isOpen}
            onClose={onClose}
            placement="right"
          >
            <PopoverTrigger>
              <IconButton
                aria-label="copy clipboard"
                icon={<BiCopy />}
                onClick={copyToClipboard}
              />
            </PopoverTrigger>
            <PopoverContent bgColor="#EDF2F7" w="fit-content">
              <PopoverBody>Copied</PopoverBody>
            </PopoverContent>
          </Popover>
        )}
      </HStack>
      <Stack direction={'column'} gap={4}>
        {isRoomCreator && (
          <RoomConfig
            startGame={startGame}
            roomConfig={roomConfig}
            onChangeRoomConfigForm={onChangeRoomConfig}
            isLoading={isLoading}
            onCloseRoom={closeRoom}
          />
        )}
        <Divider orientation="horizontal" bgColor="gray.400" />
        <WaitingPlayers players={players} />
        {!isRoomCreator && (
          <Button
            onClick={leaveRoom}
            disabled={isLoading}
            isLoading={isLoading}
          >
            Leave room
          </Button>
        )}
      </Stack>
    </Stack>
  );
};
