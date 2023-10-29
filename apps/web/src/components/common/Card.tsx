import { FC } from "react";
import {
  Card as ICard,
  MemeCard as IMemeCard,
  PhraseCard as IPhraseCard,
} from "wdyc-interfaces";

const COMMON_CARD_PROPS = "rounded-xl p-2 shadow-base border-1 min-w-[160px]";

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
        maxWidth
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

const PhraseCard: FC<PhraseCardProps> = ({ card, onSelect }) => {
  return (
    <div
      className={`${COMMON_CARD_PROPS} border border-white w-full max-w-[160px] h-56  bg-blue-800`}
      onClick={() => onSelect?.(card)}
    >
      <p className="font-bold select-none text-sm">{card.content}</p>
    </div>
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
      {card.type === "MEME" && (
        <MemeCard
          card={card}
          onSelect={onSelect}
          isInJudgePosition={isInJudgePosition}
        />
      )}

      {card.type === "PHRASE" && <PhraseCard card={card} onSelect={onSelect} />}
    </>
  );
};
