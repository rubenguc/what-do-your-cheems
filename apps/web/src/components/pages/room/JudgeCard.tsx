import { FC } from 'react';
import { Avatar, Box, Stack, Text } from '@chakra-ui/react';
// import { Judge } from "interfaces/room-interfaces";
import { Card } from '../../common';

interface JudgeCardProps {
  judge: any;
}

export const JudgeCard: FC<JudgeCardProps> = ({ judge }) => {
  const imageOrientiation = judge.card.imageOrientation;

  return (
    <Stack
      direction={imageOrientiation === 'H' ? 'column-reverse' : 'row'}
      alignItems="normal"
      justifyContent="center"
    >
      <Card card={judge.card} isInJudgePosition />

      <Box>
        <Text color="white">judge:</Text>
        <Avatar />
        <Text color="white" textAlign="center">
          {judge?.username || ''}
        </Text>
      </Box>
    </Stack>
  );
};
