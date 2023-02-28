import { FC, useRef, useState, useMemo } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  HStack,
  Image,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
// import { Card as ICard } from "interfaces/room-interfaces";
import { Card } from '../../common';

interface CardProps {
  cards: any[];
  setCard: (card: any) => void;
  waitingForJudge: boolean;
  isJudge: boolean;
  playerCards: any[];
}

export const Cards: FC<CardProps> = ({
  cards,
  setCard,
  waitingForJudge,
  playerCards,
  isJudge,
}) => {
  const [selectCard, setselectCard] = useState<any | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  const onSelectCard = (card: any) => {
    if (cards.length < 7) return;
    if (!isJudge && waitingForJudge) return;
    setselectCard(card);
    onOpen();
  };

  const closeModal = () => {
    setselectCard(null);
    onClose();
  };

  const confirmCard = () => {
    setCard(selectCard as any);
    closeModal();
  };

  const cardsToSelect = useMemo(() => {
    if (isJudge) return waitingForJudge ? playerCards : [];

    return cards;
  }, [cards, playerCards, isJudge]);

  return (
    <>
      <HStack
        overflowX="auto"
        py={5}
        overflowY="hidden"
        gap={5}
        px={3}
        justifyContent={{
          base: 'none',
          lg: 'center',
        }}
        mb={2}
        __css={{
          '&::-webkit-scrollbar': {
            width: '2px',
          },
          '&::-webkit-scrollbar-track': {
            width: '2px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#ddda',
            borderRadius: '24px',
          },
        }}
      >
        {cardsToSelect.map((card, index) => (
          <Card key={index.toString()} card={card} onSelect={onSelectCard} />
        ))}
      </HStack>

      {/* TODO: move to separate component */}
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={closeModal}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            You selected:
          </AlertDialogHeader>
          <AlertDialogBody>
            {selectCard?.type === 'PHRASE' && <Text>{selectCard.content}</Text>}

            {selectCard?.type === 'MEME' && (
              <Image
                src={selectCard.url}
                width="200px"
                height="200px"
                objectFit="contain"
                mx="auto"
              />
            )}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={closeModal}>
              No
            </Button>
            <Button colorScheme="red" ml={3} onClick={confirmCard}>
              Send
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
