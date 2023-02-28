import { FC } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

interface FinishGameProps {
  finishGame: () => void;
}

export const FinishGame: FC<FinishGameProps> = ({ finishGame }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen}>Finish game</Button>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Text>Confirm</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={finishGame}>Finish</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
