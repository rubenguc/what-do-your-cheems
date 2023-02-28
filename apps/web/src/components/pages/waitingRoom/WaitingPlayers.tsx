import { Heading, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import { FaUserAstronaut } from 'react-icons/fa';
// import { Player } from "../../../interfaces/room-interfaces";

interface WaitingPlayersProps {
  players: any[];
}

export const WaitingPlayers = ({ players }: WaitingPlayersProps) => {
  return (
    <>
      <Heading color="gray.800">Players</Heading>
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
