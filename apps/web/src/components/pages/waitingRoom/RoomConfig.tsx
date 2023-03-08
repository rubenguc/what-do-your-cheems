import { Box, Button, Heading, Select, Stack, Text } from '@chakra-ui/react';
import { GAME_MODES, ROUNDS_TO_SELECT } from '@wdyc/game';
import { RoomConfig as IRoomConfig } from '@wdyc/game-interfaces';
import { FC } from 'react';

interface RoomConfigProps {
  startGame: () => void;
  roomConfig: IRoomConfig;
  onChangeRoomConfigForm: (name: string, value: any) => void;
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
  return (
    <Stack>
      <Heading color="gray.800">Config</Heading>
      <Stack>
        <Box>
          <Text>Rounds:</Text>
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
              {gm.value}
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
        Start game
      </Button>
      <Button
        fontFamily={'heading'}
        mt={8}
        w={'full'}
        onClick={onCloseRoom}
        disabled={isLoading}
        isLoading={isLoading}
      >
        Close room
      </Button>
    </Stack>
  );
};
