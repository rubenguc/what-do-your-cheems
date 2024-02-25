import { FC, useState, useMemo } from "react";
import { Card as ICard, Player } from "wdyc-interfaces";
import { Card, } from "../../../components/common";
import { useModal } from "../../../hooks/common";
import { ConfirmCard } from "./ConfirmCard";

interface CardProps {
  cards: ICard[];
  setCard: (card: ICard) => void;
  waitingForJudge: boolean;
  isJudge: boolean;
  playerCards: Player["cards"];
}

export const Cards: FC<CardProps> = ({
  cards,
  setCard,
  waitingForJudge,
  playerCards,
  isJudge,
}) => {
  const [selectCard, setselectCard] = useState<ICard | null>(null);
  const { isOpenModal, onOpenModal, onCloseModal } = useModal();

  const onSelectCard = (card: ICard) => {
    if (cards.length < 7) return;
    if (!isJudge && waitingForJudge) return;
    setselectCard(card);
    onOpenModal();
  };

  const closeModal = () => {
    setselectCard(null);
    onCloseModal();
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
      <div className="flex gap-1 md:gap-2 py-5 overflow-x-auto md:overflow-visible md:overflow-x-visible mb-2 md:justify-center">
        {cardsToSelect.map((card, index, totalCards) => (
          <Card key={index.toString()} index={index} card={card} onSelect={onSelectCard} totalCards={totalCards.length} />
        ))}
      </div>

      <ConfirmCard
        card={selectCard}
        isOpen={isOpenModal}
        onClose={closeModal}
        onConfirm={confirmCard}
      />
    </>
  );
};
