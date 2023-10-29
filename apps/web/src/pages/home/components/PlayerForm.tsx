import { FC } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaChevronLeft } from "react-icons/fa";
import { SelectAvatar } from ".";

interface Form {
  username: string;
  roomCode: string;
  avatar: number;
}

interface PlayerFormProps {
  selectedOption: "create_game" | "join_game";
  form: Form;
  onChangeForm: (key: "username" | "roomCode" | "avatar", value: any) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export const PlayerForm: FC<PlayerFormProps> = ({
  selectedOption,
  form,
  onBack,
  onChangeForm,
  onSubmit,
}) => {
  const { t } = useTranslation("home");

  const onChangeAvatar = (action: "prev" | "next") => {
    const actualValue = form.avatar;

    if (actualValue === 1 && action === "prev") {
      onChangeForm("avatar", 5);
    } else if (actualValue === 5 && action === "next") {
      onChangeForm("avatar", 1);
    } else {
      onChangeForm(
        "avatar",
        action === "prev" ? actualValue - 1 : actualValue + 1
      );
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 w-full mt-10"
      >
        <div className="flex items-center gap-2">
          <button
            className="rounded-full p-1 hover:bg-gray-400/25"
            onClick={onBack}
          >
            <FaChevronLeft className="text-white" />
          </button>
          <h1 className="text-3xl font-extrabold leading-none tracking-tight text-gray-900  dark:text-white">
            {t(selectedOption)}
          </h1>
        </div>

        <div className="mt-10">
          <div className="flex flex-col gap-4">
            <SelectAvatar
              avatar={form.avatar}
              onChangeAvatar={onChangeAvatar}
            />

            <div>
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                First name
              </label>
              <input
                type="text"
                id="username"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                value={form.username}
                onChange={({ target }) =>
                  onChangeForm("username", target.value)
                }
              />
            </div>

            {selectedOption === "join_game" && (
              <div>
                <label
                  htmlFor="roomCode"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  roomCode
                </label>
                <input
                  type="text"
                  id="roomCode"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  value={form.roomCode}
                  onChange={({ target }) =>
                    onChangeForm("roomCode", target.value)
                  }
                />
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onSubmit}
            className="mt-10 w-full text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {t(selectedOption)}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
