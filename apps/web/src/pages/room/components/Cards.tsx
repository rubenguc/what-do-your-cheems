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
import { Card as ICard, Player } from 'wdyc-interfaces';
import { useTranslation } from 'react-i18next';
import { Card } from '../../../components/common';

interface CardProps {
  cards: ICard[];
  setCard: (card: ICard) => void;
  waitingForJudge: boolean;
  isJudge: boolean;
  playerCards: Player['cards'];
}

export const Cards: FC<CardProps> = ({
  cards,
  setCard,
  waitingForJudge,
  playerCards,
  isJudge,
}) => {
  const { t } = useTranslation('room');
  const [selectCard, setselectCard] = useState<ICard | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  const onSelectCard = (card: ICard) => {
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
    setCard(selectCard as ICard);
    closeModal();
  };

  const cardsToSelect = useMemo(() => {
    if (isJudge) return waitingForJudge ? playerCards : [];

    return cards;
  }, [isJudge, waitingForJudge, playerCards, cards]);

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
            {t('selected_card')}:
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
              {t('cancel')}
            </Button>
            <Button colorScheme="red" ml={3} onClick={confirmCard}>
              {t('send')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
