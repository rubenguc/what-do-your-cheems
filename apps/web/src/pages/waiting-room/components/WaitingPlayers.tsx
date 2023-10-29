import { useTranslation } from 'react-i18next';
import { WaitRoomPlayer } from 'wdyc-interfaces';
import { AVATARS } from '../../../constants/players';
import { BiSolidCrown } from 'react-icons/bi';
import { AnimatePresence, motion } from 'framer-motion';

interface WaitingPlayersProps {
  players: WaitRoomPlayer[];
}

export const WaitingPlayers = ({ players }: WaitingPlayersProps) => {
  const { t } = useTranslation();

  return (
    <>
      <p className="text-gray-200 mb-5">{t('players')}</p>
      <div className='flex flex-col gap-4'>
        <AnimatePresence mode="popLayout">
          {players.map((p, index) => (
            <motion.div
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring" }}
              className='flex items-center gap-2'
              key={index.toString()}
            >
              <img
                src={AVATARS[p.avatar]}
                alt=""
                className="h-9 w-9 rounded-full"
              />
              {
                index === 0 && (
                  <BiSolidCrown
                    className="text-yellow-400 text-2xl"
                  />
                )
              }
              <p className="text-gray-100 text-xl">{p.username}</p>
            </motion.div>
          ))}

        </AnimatePresence>
      </div>
    </>
  );
};
