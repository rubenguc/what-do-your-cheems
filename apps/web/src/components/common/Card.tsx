import { FC } from 'react';
import { Box, Text } from '@chakra-ui/react';
import {
  Card as ICard,
  MemeCard as IMemeCard,
  PhraseCard as IPhraseCard,
} from '@wdyc/game-interfaces';

const COMMON_CARD_PROPS = {
  borderRadius: '2xl',
  bgColor: 'black',
  p: '2',
  shadow: 'base',
  borderWidth: '2px',
  borderColor: 'black',
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

  const rotate = isHorizontal && isInJudgePosition;

  return (
    <Box
      {...COMMON_CARD_PROPS}
      w="100%"
      h="100%"
      mx="auto"
      minW={rotate ? '300px' : '200px'}
      maxW={rotate ? '300px' : '200px'}
      minH={rotate ? '200px' : '300px'}
      maxH={rotate ? '200px' : '300px'}
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
        bgColor="transparent"
        minW={isHorizontal ? '300px' : '200px'}
        maxW={isHorizontal ? '300px' : '200px'}
        minH={isHorizontal ? '200px' : '300px'}
        maxH={isHorizontal ? '200px' : '300px'}
        transform={
          !rotate && isHorizontal ? 'rotate(-90deg) translate(-16%, -26%)' : ''
        }
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
      bgColor="blue.700"
      onClick={() => onSelect?.(card)}
    >
      <Text color="white" fontWeight="bold">
        {card.content}
      </Text>
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
