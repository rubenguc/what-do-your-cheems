import { CSSProperties, FC } from "react";
import { RoomJudge } from "wdyc-interfaces";
import { Card } from "../../../components/common";
import { useDroppable } from "@dnd-kit/core";
import { useMedia } from "react-use";
import { useTranslation } from "react-i18next";

interface JudgeCardProps {
  judge: RoomJudge;
}

export const JudgeCard: FC<JudgeCardProps> = ({ judge }) => {
  const isMobile = useMedia('(max-width: 640px)')

  const { t } = useTranslation("room")

  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
  });


  const style: CSSProperties = {
    color: isOver ? "yellow" : undefined,
    borderColor: "yellow",
    borderWidth: "3px",
    borderStyle: "dashed",
  };


  return (
    <div className={`flex gap-2 w-full h-full justify-center`}>
      <Card card={judge.card} isInJudgePosition />

      <div
        className="h-56 rounded-xl px-4 flex items-center justify-center w-full min-w-[160px] max-w-[16px] text-center"
        ref={setNodeRef}
        style={{
          ...style,
        }}
      >
        {t(isMobile ? "select_your_card" : "drag_your_card_here")}
      </div>
    </div>
  );
};
