import { Heading, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import { FaUserAstronaut } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { WaitRoomPlayer } from '@wdyc/game-interfaces';

interface WaitingPlayersProps {
  players: WaitRoomPlayer[];
}

export const WaitingPlayers = ({ players }: WaitingPlayersProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Heading color="gray.800">{t('players')}</Heading>
      <VStack alignItems="start" gap={4}>
        {players.map((p, index) => (
          <HStack key={index.toString()}>
            <Icon as={FaUserAstronaut} color="black" fontSize="2xl" />
            <Text color="gray.700">{p.username}</Text>
          </HStack>
        ))}
      </VStack>
    </>
  );
};
