import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmModal } from '../../../components/common';
import { useModal } from '../../../hooks/common';
import { Button } from '../../../components/ui';

interface FinishGameProps {
  finishGame: () => void;
}

export const FinishGame: FC<FinishGameProps> = ({ finishGame }) => {
  const { t } = useTranslation('room');

  const { isOpenModal, onOpenModal, onCloseModal } = useModal()

  return (
    <>
      <Button onClick={onOpenModal} className='!text-sm !md:text-base !px-2 !md:px-2'>
        {t('finish_game')}
      </Button>

      <ConfirmModal
        isOpen={isOpenModal}
        onClose={onCloseModal}
        onConfirm={finishGame}
        message={t('finish_game_confirmation')}
      />
    </>
  );
};
