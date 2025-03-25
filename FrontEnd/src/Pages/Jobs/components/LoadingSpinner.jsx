import React from 'react';
import { Box, Spinner, Text, VStack } from '@chakra-ui/react';

const LoadingSpinner = () => {
  return (
    <Box textAlign="center" py={10}>
      <VStack spacing={4}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
        <Text color="gray.600" fontSize="lg">
          Searching for jobs...
        </Text>
      </VStack>
    </Box>
  );
};

export default LoadingSpinner; 