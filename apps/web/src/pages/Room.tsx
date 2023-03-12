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
import JSConfetti from 'js-confetti';
import { useEffect } from 'react';
import { useUserContext, useRoom } from '@wdyc/game/hooks';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/common/useToast';
import { useTranslation } from 'react-i18next';

export const Room = () => {
  const { t } = useTranslation('room');

  const jsConfetti = new JSConfetti();
  const navigate = useNavigate();

  const { showErrorToast, showSuccessToast } = useToast();

  const { user, clear } = useUserContext();

  const onClear = () => {
    localStorage.removeItem('user');
    clear();
  };

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
  } = useRoom({
    navigate,
    onShowError: showErrorToast,
    onClear,
    onShowMessage: showSuccessToast,
  });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.winner, userIsWinner]);

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
            <Text color="black">
              {t('winner')}: {game.winner}
            </Text>
            <Flex justifyContent="center" mt={5}>
              <Button onClick={goToHome} mx="auto">
                {t('exit')}
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
        <Text color="white">
          {t('username')}: {user.username}
        </Text>
        <HStack gap={2}>
          <Text color="white">
            {t('round')}: {game.round}/{game.config?.totalRounds}
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
