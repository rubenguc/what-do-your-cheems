import { FC } from 'react';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';

interface ConnectionInfoProps {
  isSocketOnline: boolean;
}

export const ConnectionInfo: FC<ConnectionInfoProps> = ({ isSocketOnline }) => {
  if (isSocketOnline) return null;

  return (
    <Modal onClose={() => null} isOpen={!isSocketOnline} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <VStack py={10}>
            <Text fontSize="5xl">Connecting...</Text>
            <Spinner size="xl" />
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
