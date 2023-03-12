import { Box, Button, Heading, Select, Stack, Text } from '@chakra-ui/react';
import { GAME_MODES, ROUNDS_TO_SELECT } from '@wdyc/game/utils';
import { RoomConfig as IRoomConfig } from '@wdyc/game-interfaces';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface RoomConfigProps {
  startGame: () => void;
  roomConfig: IRoomConfig;
  onChangeRoomConfigForm: (name: string, value: string) => void;
  isLoading: boolean;
  onCloseRoom: () => void;
}

export const RoomConfig: FC<RoomConfigProps> = ({
  startGame,
  roomConfig,
  onChangeRoomConfigForm,
  isLoading,
  onCloseRoom,
}) => {
  const { t } = useTranslation('waiting_room');

  return (
    <Stack>
      <Heading fontSize="2xl" color="gray.800">
        {t('config')}
      </Heading>
      <Stack>
        <Box>
          <Text>{t('rounds')}:</Text>
          <Select
            bg={'gray.100'}
            border={0}
            value={roomConfig.totalRounds}
            onChange={({ target }) => {
              onChangeRoomConfigForm('totalRounds', parseInt(target.value));
            }}
          >
            {ROUNDS_TO_SELECT.map((round) => (
              <option key={round} value={round}>
                {round}
              </option>
            ))}
          </Select>
        </Box>

        <Select
          bg={'gray.100'}
          border={0}
          _placeholder={{
            color: 'gray.500',
          }}
          value={roomConfig.gameMode}
          onChange={({ target }) =>
            onChangeRoomConfigForm('gameMode', target.value)
          }
        >
          {GAME_MODES.map((gm) => (
            <option key={gm.key} value={gm.key}>
              {t(gm.value)}
            </option>
          ))}
        </Select>
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
        onClick={startGame}
        disabled={isLoading}
        isLoading={isLoading}
        mb={2}
      >
        {t('start_game')}
      </Button>
      <Button
        fontFamily={'heading'}
        mt={8}
        w={'full'}
        onClick={onCloseRoom}
        disabled={isLoading}
        isLoading={isLoading}
      >
        {t('close_room')}
      </Button>
    </Stack>
  );
};
