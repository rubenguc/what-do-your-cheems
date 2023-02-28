import { Box, Button, Heading, Select, Stack, Text } from '@chakra-ui/react';
import { FC } from 'react';
// import { RoomConfigForm } from "interfaces/form-interfaces";
import { GAME_MODES, ROUNDS_TO_SELECT } from '../../../utils/constants';

interface RoomConfigProps {
  startGame: () => void;
  roomConfig: any;
  onChangeRoomConfigForm: (name: string, value: any) => void;
  isLoading: boolean;
}

export const RoomConfig: FC<RoomConfigProps> = ({
  startGame,
  roomConfig,
  onChangeRoomConfigForm,
  isLoading,
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
      >
        Start game
      </Button>
    </Stack>
  );
};
