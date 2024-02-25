import { FC, useMemo } from "react";
import { FaGavel } from "react-icons/fa";
import { AVATARS } from "../../../constants/players";
import { RoomPlayer } from "wdyc-interfaces";
import { useUserContext } from "wdyc-shared-ui/hooks";

interface PlayersProps {
  players: RoomPlayer[];
  judgeUsername: string;
}

export const Players: FC<PlayersProps> = ({ players, judgeUsername }) => {
  const { user } = useUserContext();

  const sortedPlayers = useMemo(() => {
    // user.username must be the first player
    const sortedPlayers = [...players];
    const userIndex = players.findIndex((player) => player.username === user.username);

    if (userIndex !== -1) {
      sortedPlayers.splice(userIndex, 1);
      sortedPlayers.unshift(players[userIndex]);
    }

    return sortedPlayers;
  }, [players, user])

  return (
    <div
      className="flex flex-row overflow-x-auto py-2 gap-8 px-3 justify-center bg-primary-default"
    >
      {sortedPlayers.map((player, index) => (
        <div key={index.toString()} className="relative">
          <div className="flex relative border-2 border-white rounded-full overflow-visible w-fit mx-auto">
            <img src={AVATARS[player.avatar]} alt="" className="w-9 h-9 md:w-12 md:h-12 rounded-full" />

            {
              judgeUsername === player.username && (
                <>
                  <div className="absolute top-0 left-0 w-full h-full rounded-full bg-black/40 flex items-start justify-center text-white">
                  </div>
                  <FaGavel className="absolute text-yellow-400 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 -rotate-90" size="22" />
                </>
              )
            }

            <div className="absolute -top-1.5 -right-2 w-6 h-6 rounded-full bg-white flex items-start justify-center text-red-500">
              {player.numberOfWins}
            </div>
          </div>
          <p className="text-center overflow-hidden text-ellipsis whitespace-normal max-w-[10ch] leading-none text-sm md:text-base">{player.username}</p>
        </div>
      ))}
    </div>
  );
};
