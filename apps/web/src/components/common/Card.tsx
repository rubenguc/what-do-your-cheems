import { CSSProperties, FC } from "react";
import {
  Card as ICard,
  MemeCard as IMemeCard,
  PhraseCard as IPhraseCard,
} from "wdyc-interfaces";
import { useDraggable } from '@dnd-kit/core';
import { useMedia } from 'react-use';
import { motion } from "framer-motion"

const COMMON_CARD_PROPS = "rounded-xl p-2 shadow-base border-1 min-w-[160px]";

const getCardRotation = (index: number, totalCards: number): {
  transform: string;
  rotate: number;
  translateY: number;
} => {


  let rotate = 0
  let translateY = 0

  const differenceFromMiddle = index - parseInt(String(totalCards / 2))

  const isEven = index % 2 === 0

  if (differenceFromMiddle < 0) {
    translateY = differenceFromMiddle * (isEven ? -1 : -3)
    rotate = differenceFromMiddle * 1
  }

  if (differenceFromMiddle > 0) {
    translateY = differenceFromMiddle * (isEven ? 1 : 3)
    rotate = differenceFromMiddle * 1
  }

  if (differenceFromMiddle === 0) {
    translateY = -3
    rotate = 0
  }

  return {
    transform: `rotate(${rotate}deg) translateY(${translateY}px)`,
    rotate,
    translateY
  }
}

interface PhraseCardProps {
  card: IPhraseCard;
  onSelect?: (card: IPhraseCard) => void;
  index: number;
  totalCards: number;
}

interface MemeCardProps {
  card: IMemeCard;
  onSelect?: (card: IMemeCard) => void;
  isInJudgePosition: boolean;
  index: number
  totalCards: number
}

const MemeCard: FC<MemeCardProps> = ({ card, onSelect, isInJudgePosition, index, totalCards }) => {
  const isHorizontal = card.imageOrientation === "H";

  const rotate = isHorizontal && isInJudgePosition;

  const minWidth = rotate ? "300px" : "200px";
  const maxWidth = rotate ? "300px" : "200px";
  const minHeight = rotate ? "200px" : "300px";
  const maxHeight = rotate ? "200px" : "300px";

  return (
    <div
      className={`${COMMON_CARD_PROPS} mx-auto border border-[#444] relative overflow-hidden`}
      onClick={() => onSelect?.(card)}
      style={{
        minHeight,
        maxHeight,
        minWidth,
        maxWidth,
        ...getCardRotation(index, totalCards)
      }}
    >
      <div className={`absolute top-0 left-0 bg-cover bg-no-repeat bg-transparent transform ${rotate ? 'rotate(-90deg) translate(-16%, -26%)' : ''}`}
        style={{
          backgroundImage: `url(${card.url})`,
          minHeight,
          maxHeight,
          minWidth,
          maxWidth
        }}
      />


    </div>
  );
};

const PhraseCard: FC<PhraseCardProps> = ({ card, onSelect, index, totalCards }) => {

  const isMobile = useMedia('(max-width: 640px)')

  const { attributes, listeners, setNodeRef } = useDraggable({
    id: index + 1,
    disabled: isMobile,
    data: card,
  });

  const { rotate, translateY } = getCardRotation(index, totalCards)

  return (
    <motion.div
      animate={{ y: 0, opacity: 1, rotate: rotate, translateY: translateY }}
      initial={{ y: 100, opacity: 0, rotate: 0, translateY: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: index * 0.1
      }}
      drag={!isMobile}
      dragSnapToOrigin

      ref={setNodeRef}  {...listeners} {...attributes}
      className={`${COMMON_CARD_PROPS} border border-white w-full max-w-[160px] h-56  bg-blue-800`}
      onClick={() => onSelect?.(card)}

    >
      <p className="font-bold select-none text-sm">{card.content}</p>
    </motion.div>
  );
};

interface CardProps {
  card: ICard;
  onSelect?: (card: ICard) => void;
  isInJudgePosition?: boolean;
  index?: number;
  totalCards?: number;
}

export const Card: FC<CardProps> = ({
  card,
  onSelect,
  isInJudgePosition = false,
  index = -1,
  totalCards = 0
}) => {
  return (
    <>
      {card.type === "MEME" && (
        <MemeCard
          card={card}
          onSelect={onSelect}
          isInJudgePosition={isInJudgePosition}
          index={index}
          totalCards={totalCards}
        />
      )}

      {card.type === "PHRASE" && <PhraseCard card={card} onSelect={onSelect} index={index}
        totalCards={totalCards} />}
    </>
  );
};
