import { FC } from 'react';
import { Button, useDisclosure } from '@chakra-ui/react';
import { ConfirmModal } from '../../common';
import { useTranslation } from 'react-i18next';

interface FinishGameProps {
  finishGame: () => void;
}

export const FinishGame: FC<FinishGameProps> = ({ finishGame }) => {
  const { t } = useTranslation('room');
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button size="xs" onClick={onOpen}>
        {t('finish_game')}
      </Button>

      <ConfirmModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={finishGame}
        message={t('finish_game_confirmation')}
      />
    </>
  );
};
