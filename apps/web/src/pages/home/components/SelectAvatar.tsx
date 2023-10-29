import { FC } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { AVATARS } from "../../../constants/players";

interface SelectAvatarProps {
  avatar: number;
  onChangeAvatar: (action: "prev" | "next") => void;
}

export const SelectAvatar: FC<SelectAvatarProps> = ({
  avatar,
  onChangeAvatar,
}) => {
  return (
    <div className="flex gap-2 items-center mx-auto">
      <button className="rounded-full p-1 hover:bg-gray-400/20" onClick={() => onChangeAvatar("prev")}>
        <FaChevronLeft className="text-white" />
      </button>

      <img
        src={AVATARS[avatar]}
        alt=""
        className="h-20 w-20 rounded-full"
      />

      <button className="rounded-full p-1 hover:bg-gray-400/20" onClick={() => onChangeAvatar("next")}>
        <FaChevronRight className="text-white" />
      </button>
    </div>
  );
};
