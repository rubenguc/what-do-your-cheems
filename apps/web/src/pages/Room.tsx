import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  HStack,
  Text,
} from '@chakra-ui/react';
import { FinishGame, JudgeCard, Players } from '../components/pages/room';
import { Cards } from '../components/pages/room/Cards';
import { useRoom } from '../hooks/pages/useRoom';
import useStore from '../store';
import JSConfetti from 'js-confetti';
import { useEffect } from 'react';

export const Room = () => {
  const jsConfetti = new JSConfetti();

  const user = useStore((state) => state.user);
  const {
    judge,
    cardsToSelect,
    players,
    isJudge,
    isRoomCreator,
    setCard,
    waitingForJudge,
    playerCards,
    game,
    goToHome,
    finishGame,
  } = useRoom();

  const userIsWinner = game.winner && game.winner === user.username;

  useEffect(() => {
    if (userIsWinner) {
      const interval = setInterval(() => {
        jsConfetti.addConfetti();
      }, 2000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [game?.winner]);

  if (game.isEnded) {
    return (
      <Box
        py={2}
        display="flex"
        flexDirection="column"
        h="full"
        justifyContent="center"
      >
        <Card bgColor="white">
          <CardBody>
            <Text color="black">Winner: {game.winner}</Text>
            <Flex justifyContent="center" mt={5}>
              <Button onClick={goToHome} mx="auto">
                Exit
              </Button>
            </Flex>
          </CardBody>
        </Card>
      </Box>
    );
  }

  return (
    <Box py={2} display="flex" flexDirection="column" h="full">
      <HStack justifyContent="space-between">
        <Text color="white">username: {user.username}</Text>
        <HStack gap={2}>
          <Text color="white">
            roud: {game.round}/{game.config?.totalRounds}
          </Text>
          {isRoomCreator && <FinishGame finishGame={finishGame} />}
        </HStack>
      </HStack>

      <Box flex="1">
        <JudgeCard judge={judge} />
      </Box>
      <Cards
        cards={cardsToSelect}
        setCard={setCard}
        waitingForJudge={waitingForJudge}
        playerCards={playerCards}
        isJudge={isJudge}
      />

      <Players players={players} judgeUsername={judge.username} />
    </Box>
  );
};
