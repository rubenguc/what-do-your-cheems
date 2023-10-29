import { FC } from "react";
import { GAME_MODES, ROUNDS_TO_SELECT } from "wdyc-utils";
import { RoomConfig as IRoomConfig } from "wdyc-interfaces";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui";

interface RoomConfigProps {
  startGame: () => void;
  roomConfig: IRoomConfig;
  onChangeRoomConfigForm: (name: string, value: string) => void;
  isLoading: boolean;
  onCloseRoom: () => void;
}

export const RoomConfig: FC<RoomConfigProps> = ({
  startGame,
  roomConfig,
  onChangeRoomConfigForm,
  isLoading,
  onCloseRoom,
}) => {
  const { t } = useTranslation("waiting_room");

  return (
    <>
      <h2 className="text-2xl ">{t("config")}</h2>

      <div className="flex flex-col gap-2">
        <div className="">
          <label
            htmlFor="gameMode"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            {t("rounds")}:
          </label>
          <select
            id="totalRounds"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={roomConfig.totalRounds}
            onChange={({ target }) => {
              onChangeRoomConfigForm("totalRounds", target.value);
            }}
          >
            {ROUNDS_TO_SELECT.map((round) => (
              <option key={round} value={round}>
                {round}
              </option>
            ))}
          </select>
        </div>

        <div className="">
          <label
            htmlFor="gameMode"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            {t("game_mode")}:
          </label>
          <select
            id="gameMode"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={roomConfig.gameMode}
            onChange={({ target }) =>
              onChangeRoomConfigForm("gameMode", target.value)
            }
          >
            {GAME_MODES.map((gm) => (
              <option key={gm.key} value={gm.key}>
                {t(gm.value)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 my-2">
          <Button isLoading={isLoading} onClick={startGame}>
            {t("start_game")}
          </Button>

          <Button isLoading={isLoading} onClick={onCloseRoom}>
            {t("close_room")}
          </Button>
        </div>
      </div>
    </>
  );
};
