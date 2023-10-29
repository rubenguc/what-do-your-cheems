import { AnimatePresence, motion } from "framer-motion";
import { BsTelegram, BsGithub } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { PlayerForm } from "./components";
import { useHome, useUserContext } from "wdyc-shared-ui/hooks";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/common";
import { LoginProps } from "wdyc-interfaces";
import { MenuContainer } from '../../components/common/MenuContainer';

const GITHUB_LINK = import.meta.env.VITE_GITHUB_LINK;
const TELEGRAM_LINK = import.meta.env.VITE_TELEGRAM_LINK;

const OPTIONS = ["create_game", "join_game"];
const LINKS = [
  {
    title: "upload_memes_phrases",
    link: TELEGRAM_LINK,
    icon: <BsTelegram className="w-4 h-4" />,
  },
  {
    title: "give_me_a_star",
    link: GITHUB_LINK,
    icon: <BsGithub className="w-4 h-4" />,
  },
];

export const Home = () => {
  const { t } = useTranslation("home");
  const { showErrorToast } = useToast();
  const navigate = useNavigate();
  const { login } = useUserContext();


  const onLogin = (data: any) => {
    if (!data) return;
    localStorage.setItem('user', JSON.stringify(data));
    login(data as LoginProps);
  };


  const { selectedOption, setSelectedOption, onChangeForm, loginForm, createRoom, joinRoom } =
    useHome({
      navigate,
      onShowError: showErrorToast,
      onLogin,
    });



  return (
    <div className="flex flex-col items-center h-full justify-center">
      <div className="flex justify-center min-h-[166px] gap-3 -mt-32">
        <AnimatePresence>
          <motion.img
            className="min-w-[122px] max-w-[100px] transform rotate-10"
            initial={{ opacity: 0, x: -100, rotate: -20 }}
            animate={{ opacity: 1, x: 0, rotate: 10 }}
            transition={{
              ease: "linear",
              duration: 1,
            }}
            src="/assets/logo.png"
            key="logo"
          />

          <div className="flex flex-col gap-1">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                ease: "linear",
                duration: 1,
              }}
              className="text-4xl font-bold text-white white whitespace-break-spaces mt-7"
            >
              {"What do your \ncheems?"}
            </motion.h1>
          </div>
        </AnimatePresence>
      </div>

      {!selectedOption ? (
        <AnimatePresence>
          <MenuContainer>
            <div className="flex flex-col gap-4">
              {OPTIONS.map((option, index) => (
                <motion.button
                  key={index}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedOption(option)}
                  className="tracking-wide text-xl focus:outline-none font-extrabold rounded-xl px-5 py-2.5 inline-flex items-center justify-center bg-indigo-600 text-white hover:bg-indigo-500"
                >
                  {t(option)}
                </motion.button>
              ))}
            </div>
            <div className="flex flex-col mt-10 gap-4">
              {LINKS.map((link, index) => (
                <a
                  key={index}
                  href={link.link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-white text-sm"
                >
                  {link.icon}
                  {t(link.title)}
                </a>
              ))}
            </div>
          </MenuContainer>
        </AnimatePresence>
      ) : (
        <PlayerForm
          onChangeForm={onChangeForm}
          form={loginForm}
          selectedOption={selectedOption}
          onBack={() => setSelectedOption(null)}
          onSubmit={() => selectedOption === "create_game" ? createRoom() : joinRoom()}
        />
      )}
    </div>
  );
};
