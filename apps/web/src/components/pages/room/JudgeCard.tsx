import { FC } from 'react';
import { Avatar, Box, Stack, Text } from '@chakra-ui/react';
import { Card } from '../../common';
import { useTranslation } from 'react-i18next';
import { RoomJudge } from '@wdyc/game-interfaces';

interface JudgeCardProps {
  judge: RoomJudge;
}

export const JudgeCard: FC<JudgeCardProps> = ({ judge }) => {
  const { t } = useTranslation('room');
  const imageOrientiation = judge.card.imageOrientation;

  return (
    <Stack
      direction={imageOrientiation === 'H' ? 'column-reverse' : 'row'}
      alignItems="normal"
      justifyContent="center"
    >
      <Card card={judge.card} isInJudgePosition />

      <Box w="fit-content">
        <Text color="white">{t('judge')}:</Text>
        <Avatar />
        <Text color="white" textAlign="center">
          {judge?.username || ''}
        </Text>
      </Box>
    </Stack>
  );
};
