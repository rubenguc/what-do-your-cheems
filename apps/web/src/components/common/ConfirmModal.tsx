import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { FC } from 'react';

interface ConfirmModalProps {
  onClose: () => void;
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const ConfirmModal: FC<ConfirmModalProps> = ({
  onClose,
  isOpen,
  onConfirm,
  message,
  isLoading = false,
}) => {
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent maxW="md">
        <ModalHeader />

        <ModalCloseButton />
        <ModalBody>
          <Text textAlign="center" py={4} fontSize="2xl" fontWeight="bold">
            {message}
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button isLoading={isLoading} onClick={onConfirm}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
