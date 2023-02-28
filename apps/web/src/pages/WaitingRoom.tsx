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
import { useWaitingRoom } from '../hooks/pages/useWaitingRoom';
import { BiCopy } from 'react-icons/bi';
import useStore from '../store';

export const WaitingRoom = () => {
  const store = useStore((state) => state.user);

  const {
    players,
    startGame,
    roomConfig,
    onChangeRoomConfig,
    isRoomCreator,
    leaveRoom,
    isLoading,
  } = useWaitingRoom();

  const { isOpen, onToggle, onClose } = useDisclosure();

  const copyToClipboard = async () => {
    try {
      navigator.clipboard.writeText(store.roomCode);
      onToggle();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Stack
      mt="40"
      bg={'gray.50'}
      rounded={'xl'}
      p={{ base: 4, sm: 6, md: 8 }}
      spacing={{ base: 8 }}
      maxW={{ lg: 'lg' }}
      w="full"
      mx="auto"
    >
      <Heading
        color={'gray.800'}
        lineHeight={1.1}
        fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
      >
        Waiting Room
      </Heading>
      <HStack>
        <Text color={'gray.800'} fontSize="3xl" fontWeight="bold">
          code: {store.roomCode}
        </Text>
        {store.roomCode && (
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
            <PopoverContent bgColor="#EDF2F7">
              <PopoverBody>Copied</PopoverBody>
            </PopoverContent>
          </Popover>
        )}
      </HStack>
      <Stack direction={{ base: 'column', lg: 'row' }} gap={4}>
        {/* TODO: make working game config */}
        {isRoomCreator && (
          <RoomConfig
            startGame={startGame}
            roomConfig={roomConfig}
            onChangeRoomConfigForm={onChangeRoomConfig}
            isLoading={isLoading}
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
