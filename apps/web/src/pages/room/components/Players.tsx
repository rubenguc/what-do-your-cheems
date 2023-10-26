import { FC } from "react";
import { Avatar, Box, HStack, Text } from "@chakra-ui/react";
import { FaGavel } from "react-icons/fa";

interface PlayersProps {
  players: { username: string; numberOfWins: number }[];
  judgeUsername: string;
}

export const Players: FC<PlayersProps> = ({ players, judgeUsername }) => {
  return (
    <HStack
      overflowX="auto"
      py={1}
      gap={5}
      px={3}
      justifyContent={{
        base: "none",
        lg: "center",
      }}
    >
      {players.map((p, index) => (
        <Box key={index.toString()} pos="relative">
          <Box pos="relative" display="flex">
            <Avatar position="relative" overflow="hidden" mx="auto">
              {judgeUsername === p.username && (
                <Box
                  pos="absolute"
                  top={0}
                  left={0}
                  w="full"
                  h="full"
                  bgColor="black"
                  opacity="0.63"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <FaGavel className="gavel-icon" size="28" />
                </Box>
              )}
            </Avatar>
            <Text
              w="1.25rem"
              h="1.25rem"
              borderRadius="full"
              border="1px solid gray"
              position="absolute"
              top={0}
              right={0}
              bgColor="white"
              color="black"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              {p.numberOfWins}
            </Text>
          </Box>
          <Text
            color="white"
            textAlign="center"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="normal"
            maxW="10ch"
          >
            {p.username}
          </Text>
        </Box>
      ))}
    </HStack>
  );
};
