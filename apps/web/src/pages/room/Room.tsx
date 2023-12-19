import { Cards, FinishGame, JudgeCard, Players } from "./components";
import JSConfetti from "js-confetti";
import { useEffect } from "react";
import { useUserContext, useRoom } from "wdyc-shared-ui/hooks";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useToast } from "../../hooks/common";
import { MenuContainer } from "../../components/common";
import { FaCrown } from "react-icons/fa";

export const Room = () => {
  const { t } = useTranslation("room");

  const jsConfetti = new JSConfetti();
  const navigate = useNavigate();

  const { showErrorToast, showSuccessToast, closeAllToasts } = useToast();

  const { user, clear } = useUserContext();

  const onClear = () => {
    localStorage.removeItem("user");
    clear();
  };

  const {
    judge,
    cardsToSelect,
    players,
    isJudge,
    isRoomCreator,
    setCard,
    waitingForJudge,
    playerCards,
    game,
    goToHome,
    finishGame,
  } = useRoom({
    navigate,
    onShowError: showErrorToast,
    onClear,
    onShowMessage: showSuccessToast,
    onCloseAllToasts: closeAllToasts,
  });

  const userIsWinner = game.winner && game.winner === user.username;

  useEffect(() => {
    if (userIsWinner) {
      const interval = setInterval(() => {
        jsConfetti.addConfetti();
      }, 2000);

      return () => {
        clearInterval(interval);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.winner, userIsWinner]);

  if (game.isEnded) {
    return (
      <div className="flex flex-col justify-center items-center h-full py-2  ">
        <MenuContainer>
          <div className="mb-3 text-center">
            {game.winner ? (
              <div className="flex items-center gap-2 justify-center text-4xl font-bold mb-3">
                <FaCrown color="#d9a760" />
                <p>{game.winner}</p>
              </div>
            ) : (
              <p className="text-4xl font-bold mb-3">{t("tie")}</p>
            )}

            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">{t("player")}</th>
                    <th scope="col" className="px-6 py-3">{t("number_of_wins")}</th>
                  </tr>
                </thead>
                <tbody>
                  {game.players?.map((player) => (
                    <tr key={player.username} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-6 py-4">{player.username}</td>
                      <td className="px-6 py-4 text-center">{player.numberOfWins}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center mt-5">
              <button
                className="px-4 py-2 bg-gray-700 text-white rounded-md"
                onClick={goToHome}
              >
                {t("exit")}
              </button>
            </div>
          </div>
        </MenuContainer>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between px-2 py-2 bg-gray-700">
        <p></p>
        <p color="white">
          {t("round")}: {game.round}/{game.config?.totalRounds}
        </p>
        {isRoomCreator && <FinishGame finishGame={finishGame} />}
      </div>

      <div className="flex flex-col py-2 flex-1">
        <div className="flex-1">
          <p>judge: {judge.username}</p>
          <JudgeCard judge={judge} />
        </div>

        <div>
          <Cards
            cards={cardsToSelect}
            setCard={setCard}
            waitingForJudge={waitingForJudge}
            playerCards={playerCards}
            isJudge={isJudge}
          />

          <Players players={players} judgeUsername={judge.username} />
        </div>
      </div>
    </div>
  );
};
