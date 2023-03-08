import { FC } from 'react';
import { Box, Text } from '@chakra-ui/react';
import {
  Card as ICard,
  MemeCard as IMemeCard,
  PhraseCard as IPhraseCard,
} from '@wdyc/game-interfaces';

const COMMON_CARD_PROPS = {
  borderRadius: 'xl',
  bgColor: 'white',
  p: '2',
  shadow: 'base',
  borderWidth: '2px',
  minW: '40',
};

interface PhraseCardProps {
  card: IPhraseCard;
  onSelect?: (card: IPhraseCard) => void;
}

interface MemeCardProps {
  card: IMemeCard;
  onSelect?: (card: IMemeCard) => void;
  isInJudgePosition: boolean;
}

const MemeCard: FC<MemeCardProps> = ({ card, onSelect, isInJudgePosition }) => {
  const isHorizontal = card.imageOrientation === 'H';

  const rotate = isHorizontal && !isInJudgePosition;

  return (
    <Box
      {...COMMON_CARD_PROPS}
      w="100%"
      h="100%"
      mx="auto"
      minW={isHorizontal ? '320px' : '200px'}
      maxW={isHorizontal ? '320px' : '200px'}
      minH={isHorizontal ? '200px' : '300px'}
      maxH={isHorizontal ? '200px' : '300px'}
      borderColor="#444"
      position="relative"
      overflow="hidden"
      onClick={() => onSelect?.(card)}
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        bgImage={card.url}
        bgSize={'cover'}
        bgRepeat={'no-repeat'}
        bgPosition={'center'}
        bgColor="red.50"
        minW={isHorizontal ? '320px' : '200px'}
        maxW={isHorizontal ? '320px' : '200px'}
        minH={isHorizontal ? '200px' : '300px'}
        maxH={isHorizontal ? '200px' : '300px'}
        transform={rotate ? 'rotate(-90deg) translate(-18%, -31%)' : ''}
      />
    </Box>
  );
};

const PhraseCard: FC<PhraseCardProps> = ({ card, onSelect }) => {
  return (
    <Box
      {...COMMON_CARD_PROPS}
      width="full"
      maxW="40"
      borderColor="black"
      h="56"
      onClick={() => onSelect?.(card)}
    >
      <Text color="black">{card.content}</Text>
    </Box>
  );
};

interface CardProps {
  card: ICard;
  onSelect?: (card: ICard) => void;
  isInJudgePosition?: boolean;
}

export const Card: FC<CardProps> = ({
  card,
  onSelect,
  isInJudgePosition = false,
}) => {
  return (
    <>
      {card.type === 'MEME' && (
        <MemeCard
          card={card}
          onSelect={onSelect}
          isInJudgePosition={isInJudgePosition}
        />
      )}

      {card.type === 'PHRASE' && <PhraseCard card={card} onSelect={onSelect} />}
    </>
  );
};
