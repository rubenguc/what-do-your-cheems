import { Container } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

export const PageWrapper = () => {
  return (
    <Container maxW="7xl" h="full">
      <Outlet />
    </Container>
  );
};
