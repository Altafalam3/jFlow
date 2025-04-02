
import React, { useState } from 'react';
import {
  Box,
  Container,
  Input,
  Select,
  SimpleGrid,
  Button,
  VStack,
  Text,
  Image,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { FaLinkedin, FaEnvelope } from 'react-icons/fa';

const AlumniSearch = () => {
  const [filters, setFilters] = useState({
    city: '',
    college: '',
    pastSchool: '',
    currentEmployer: '',
  });

  const [alumni, setAlumni] = useState([]);
  const toast = useToast();

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    // Integration with LinkedIn API would go here
    // For now, using mock data
    setAlumni([
      {
        id: 1,
        name: 'John Doe',
        profilePic: 'https://bit.ly/dan-abramov',
        position: 'Software Engineer at Google',
        connectionDegree: '2nd',
        linkedinId: 'johndoe',
      },
      // Add more mock data as needed
    ]);
  };

  const handleConnect = (linkedinId) => {
    window.open(`https://www.linkedin.com/in/${linkedinId}`, '_blank');
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8}>
        <Box w="100%" p={6} borderRadius="lg" bg="white" shadow="md">
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
            <Input
              name="city"
              placeholder="City"
              value={filters.city}
              onChange={handleFilterChange}
            />
            <Input
              name="college"
              placeholder="College"
              value={filters.college}
              onChange={handleFilterChange}
            />
            <Input
              name="pastSchool"
              placeholder="Past School"
              value={filters.pastSchool}
              onChange={handleFilterChange}
            />
            <Input
              name="currentEmployer"
              placeholder="Current Employer"
              value={filters.currentEmployer}
              onChange={handleFilterChange}
            />
          </SimpleGrid>
          <Button
            mt={4}
            colorScheme="linkedin"
            onClick={handleSearch}
            width="full"
          >
            Search Alumni
          </Button>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="100%">
          {alumni.map((person) => (
            <Box
              key={person.id}
              p={6}
              borderRadius="lg"
              bg="white"
              shadow="md"
              transition="all 0.3s"
              _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
            >
              <VStack spacing={4}>
                <Image
                  borderRadius="full"
                  boxSize="150px"
                  src={person.profilePic}
                  alt={person.name}
                />
                <Text fontSize="xl" fontWeight="bold">
                  {person.name}
                </Text>
                <Text color="gray.600">{person.position}</Text>
                <Text color="blue.500">{person.connectionDegree} connection</Text>
                <HStack spacing={4}>
                  <Button
                    leftIcon={<FaLinkedin />}
                    colorScheme="linkedin"
                    onClick={() => handleConnect(person.linkedinId)}
                  >
                    Connect
                  </Button>
                  <Button
                    leftIcon={<FaEnvelope />}
                    colorScheme="blue"
                    variant="outline"
                    onClick={() => handleConnect(person.linkedinId)}
                  >
                    Message
                  </Button>
                </HStack>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default AlumniSearch;
