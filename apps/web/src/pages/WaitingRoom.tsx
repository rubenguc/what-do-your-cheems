import {
  Box,
  Button,
  Divider,
  Heading,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { BiCopy } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { useUserContext, useWaitingRoom } from '@wdyc/game/hooks';
import { RoomConfig, WaitingPlayers } from '../components/pages/waitingRoom';
import { useToast } from '../hooks/common/useToast';
import { ConfirmModal } from '../components/common';

export const WaitingRoom = () => {
  const { t } = useTranslation('waiting_room');
  const navigate = useNavigate();

  const { showErrorToast } = useToast();
  const { user, clear, startRoom } = useUserContext();

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
    startRoom,
  });

  const { isOpen, onToggle, onClose } = useDisclosure();
  const {
    isOpen: isOpenModal,
    onToggle: onTogleModal,
    onClose: onCloseModal,
  } = useDisclosure();

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
        {t('title')}
      </Heading>
      <Box display="flex" gap={2} alignItems="center">
        <Text color={'gray.800'} fontSize="3xl" fontWeight="bold">
          {t('code')}: {user.roomCode}
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
              <PopoverBody>{t('code_copied')}</PopoverBody>
            </PopoverContent>
          </Popover>
        )}
      </Box>
      <Stack direction={'column'} gap={4}>
        {isRoomCreator && (
          <RoomConfig
            startGame={startGame}
            roomConfig={roomConfig}
            onChangeRoomConfigForm={onChangeRoomConfig}
            isLoading={isLoading}
            onCloseRoom={onTogleModal}
          />
        )}
        <Divider orientation="horizontal" bgColor="gray.400" />
        <WaitingPlayers players={players} />
        {!isRoomCreator && (
          <Button
            onClick={onTogleModal}
            disabled={isLoading}
            isLoading={isLoading}
          >
            {t('leave_room')}
          </Button>
        )}
        <ConfirmModal
          isOpen={isOpenModal}
          onClose={onCloseModal}
          onConfirm={!isRoomCreator ? leaveRoom : closeRoom}
          isLoading={isLoading}
          message={
            !isRoomCreator ? t('leave_room_confirm') : t('close_room_confirm')
          }
        />
      </Stack>
    </Stack>
  );
};
