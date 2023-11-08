import { FC } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaChevronLeft } from "react-icons/fa";
import { SelectAvatar } from ".";
import { Button, Input } from "../../../components/ui";

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

            <Input
              id="username"
              label={t("username_placeholder")}
              value={form.username}
              onChange={(value) =>
                onChangeForm("username", value)
              }
            />


            {selectedOption === "join_game" && (
              <Input
                id="roomCode"
                label={t("room_code_placeholder")}
                value={form.roomCode}
                onChange={(value) =>
                  onChangeForm("roomCode", value)
                }
              />

            )}
          </div>

          <Button
            className="w-full mt-10"
            onClick={onSubmit}
          >
            {t(selectedOption)}
          </Button>


        </div>
      </motion.div>
    </AnimatePresence>
  );
};
