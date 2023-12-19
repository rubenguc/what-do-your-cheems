import { FC } from "react";
import { FaGavel } from "react-icons/fa";
import { AVATARS } from "../../../constants/players";

interface PlayersProps {
  players: { username: string; numberOfWins: number }[];
  judgeUsername: string;
}

export const Players: FC<PlayersProps> = ({ players, judgeUsername }) => {

  return (
    <div
      className="flex flex-row overflow-x-auto py-1 gap-5 px-3 justify-center"
    >
      {players.map((player, index) => (
        <div key={index.toString()} className="relative">
          <div className="flex relative border-2 border-white rounded-full overflow-visible">
            <img src={AVATARS[player.avatar]} alt="" className="w-10 h-10 rounded-full" />

            {
              judgeUsername === player.username && (
                <>
                  <div className="absolute top-0 left-0 w-full h-full rounded-full bg-black/30 flex items-start justify-center text-white">
                  </div>
                  <FaGavel className="absolute text-yellow-400 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 -rotate-90" size="22" />
                </>
              )
            }

            <div className="absolute -top-1.5 -right-2 w-6 h-6 rounded-full bg-white flex items-start justify-center text-red-500">
              {player.numberOfWins}
            </div>
          </div>
          <p className="text-center overflow-hidden text-ellipsis whitespace-normal max-w-[10ch]">{player.username}</p>
        </div>
      ))}
    </div>
  );
};
