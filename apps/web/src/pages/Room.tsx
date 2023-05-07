import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { FinishGame, JudgeCard, Players } from '../components/pages/room';
import { Cards } from '../components/pages/room/Cards';
import JSConfetti from 'js-confetti';
import { useEffect } from 'react';
import { useUserContext, useRoom } from '@wdyc/game/hooks';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/common/useToast';
import { useTranslation } from 'react-i18next';
import { FaCrown } from 'react-icons/fa';

export const Room = () => {
  const { t } = useTranslation('room');

  const jsConfetti = new JSConfetti();
  const navigate = useNavigate();

  const { showErrorToast, showSuccessToast, closeAllToasts } = useToast();

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
    onCloseAllToasts: closeAllToasts,
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
        <Card bgColor="white" width="full" maxW="md" mx="auto">
          <CardBody>
            <Box mb={3} textAlign="center">
              {game.winner ? (
                <Box
                  display="flex"
                  alignItems="center"
                  gap={2}
                  justifyContent="center"
                  fontSize="4xl"
                  fontWeight="bold"
                >
                  <FaCrown color="#d9a760" />
                  <Text color="black">{game.winner}</Text>
                </Box>
              ) : (
                <Text fontSize="4xl" fontWeight="bold">
                  {t('tie')}
                </Text>
              )}
            </Box>

            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th textTransform="capitalize">{t('player')}</Th>
                    <Th textAlign="center" textTransform="capitalize">
                      {t('number_of_wins')}
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {game.players?.map((player) => (
                    <Tr key={player.username}>
                      <Td>{player.username}</Td>
                      <Td textAlign="center">{player.numberOfWins}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>

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
