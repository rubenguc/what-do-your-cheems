import {
  Button,
  HStack,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react';
import { CreateRoom, JoinRoom } from '../components/pages/home';
import { Image } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { BsTelegram, BsGithub } from 'react-icons/bs';
import pkg from '../../../../package.json';

export const Home = () => {
  return (
    <>
      <HStack justifyContent="center" pt="10" minH="166px">
        <AnimatePresence>
          <Image
            key="image"
            as={motion.img}
            minW="122px"
            initial={{ opacity: 0, x: -50, rotate: -10 }}
            animate={{ opacity: 1, x: 0, rotate: 10 }}
            transition="0.5s linear"
            src="/assets/logo.png"
            maxW="100px"
            transform="rotate(10deg)"
          />
          <Stack>
            <Text
              key="text"
              as={motion.p}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition="0.6s linear"
              whiteSpace="break-spaces"
              color="white"
              fontSize="3xl"
              fontWeight="bold"
            >
              {'What do your \ncheems?'}
            </Text>
            <Text fontSize="sm" color="white" fontWeight="bold">
              v {pkg.version}
            </Text>
          </Stack>
        </AnimatePresence>
      </HStack>

      <AnimatePresence>
        <Stack
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          mt="7"
          bg={'gray.50'}
          rounded={'xl'}
          p={{ base: 4, sm: 6, md: 8 }}
          spacing={{ base: 8 }}
          maxW="lg"
          w="full"
          mx="auto"
        >
          <Tabs isFitted variant="soft-rounded">
            <TabList mb="1em">
              <Tab>Create</Tab>
              <Tab>Join</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <CreateRoom />
              </TabPanel>
              <TabPanel>
                <JoinRoom />
              </TabPanel>
            </TabPanels>
          </Tabs>
          <VStack gap={1} alignItems="start">
            <a href="https://t.me/wdyc_bot" target="_blank" rel="noreferrer">
              <Button
                leftIcon={<BsTelegram />}
                size="sm"
                textDecoration="none"
                textTransform="none"
                variant="ghost"
              >
                Upload your own memes and phrases
              </Button>
            </a>
            <a
              href="https://github.com/rubenguc/wdyc-web"
              target="_blank"
              rel="noreferrer"
            >
              <Button
                leftIcon={<BsGithub />}
                size="sm"
                textDecoration="none"
                textTransform="none"
                variant="ghost"
              >
                Give me a star
              </Button>
            </a>
          </VStack>
        </Stack>
      </AnimatePresence>
    </>
  );
};
