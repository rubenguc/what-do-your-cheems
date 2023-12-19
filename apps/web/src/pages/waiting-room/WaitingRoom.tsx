import { useTranslation } from "react-i18next";
import { BiCopy } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useUserContext, useWaitingRoom } from "wdyc-shared-ui/hooks";
import { useModal, useToast } from "../../hooks/common";
import { RoomConfig, WaitingPlayers } from "./components";
import { ConfirmModal, MenuContainer } from "../../components/common";

export const WaitingRoom = () => {
  const { t } = useTranslation("waiting_room");
  const navigate = useNavigate();

  const { user, clear, startRoom } = useUserContext();

  const { showErrorToast, showInfoToast } = useToast();
  const { isOpenModal, onCloseModal, onOpenModal } = useModal();

  const onClear = () => {
    localStorage.removeItem("user");
    clear();
  };

  const {
    players,
    startGame,
    roomConfig,
    onChangeRoomConfig,
    isRoomCreator,
    leaveRoom,
    isLoading,
    closeRoom,
  } = useWaitingRoom({
    navigate,
    onShowError: showErrorToast,
    onClear,
    startRoom,
  });

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(user.roomCode);
      // TODO: add icon
      showInfoToast(t("code_copied"));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center h-full justify-center">
      <MenuContainer title={t("title")}>
        <button
          className="flex items-center gap-1 hover:bg-gray-500/20 p-1 rounded-xl"
          onClick={copyToClipboard}
        >
          <p className="text-3xl font-bold">
            {t("code")}: {user.roomCode}
          </p>
          <BiCopy />
        </button>
        <div className="flex flex-col gap4-">
          {isRoomCreator && (
            <RoomConfig
              startGame={startGame}
              roomConfig={roomConfig}
              onChangeRoomConfigForm={onChangeRoomConfig}
              isLoading={isLoading}
              onCloseRoom={onOpenModal}
            />
          )}

          <hr />

          <WaitingPlayers players={players} />
        </div>

        {!isRoomCreator && (
          <button
            className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            onClick={onOpenModal}
            disabled={isLoading}
          // isLoading={isLoading}
          >
            {t("leave_room")}
          </button>
        )}

        <ConfirmModal
          isOpen={isOpenModal}
          onClose={onCloseModal}
          onConfirm={!isRoomCreator ? leaveRoom : closeRoom}
          isLoading={isLoading}
          message={
            !isRoomCreator ? t("leave_room_confirm") : t("close_room_confirm")
          }
        />
      </MenuContainer>
    </div>
  );
};
