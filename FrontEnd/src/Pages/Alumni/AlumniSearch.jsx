
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Input,
  SimpleGrid,
  Button,
  VStack,
  Text,
  Image,
  HStack,
  useToast,
  Heading,
  Select,
  InputGroup,
  InputLeftElement,
  Flex,
  Badge,
  useColorModeValue,
  Icon,
  Skeleton,
} from '@chakra-ui/react';
import { FaLinkedin, FaEnvelope, FaSearch, FaBuilding, FaGraduationCap, FaMapMarkerAlt } from 'react-icons/fa';

const AlumniSearch = () => {
  const [filters, setFilters] = useState({
    city: '',
    college: '',
    pastSchool: '',
    currentEmployer: '',
  });

  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      // LinkedIn API integration would go here
      // This is a mock response for demonstration
      const mockResponse = await fetch('/api/alumni/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters),
      });
      const data = await mockResponse.json();
      setAlumni(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch alumni data',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  const AlumniCard = ({ person }) => (
    <Box
      p={6}
      borderRadius="xl"
      bg={cardBg}
      shadow="lg"
      border="1px"
      borderColor={borderColor}
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }}
    >
      <VStack spacing={4} align="center">
        <Box position="relative">
          <Image
            borderRadius="full"
            boxSize="120px"
            src={person.profilePic}
            alt={person.name}
            objectFit="cover"
          />
          <Badge
            position="absolute"
            bottom="0"
            right="0"
            colorScheme="linkedin"
            borderRadius="full"
            px={2}
          >
            {person.connectionDegree}
          </Badge>
        </Box>
        
        <VStack spacing={2} align="center">
          <Heading size="md">{person.name}</Heading>
          <Text color="gray.500" fontSize="sm">
            <Icon as={FaBuilding} mr={2} />
            {person.position}
          </Text>
          <Text color="gray.500" fontSize="sm">
            <Icon as={FaGraduationCap} mr={2} />
            {person.education}
          </Text>
          <Text color="gray.500" fontSize="sm">
            <Icon as={FaMapMarkerAlt} mr={2} />
            {person.location}
          </Text>
        </VStack>

        <HStack spacing={4} mt={2}>
          <Button
            leftIcon={<FaLinkedin />}
            colorScheme="linkedin"
            size="sm"
            onClick={() => window.open(`https://www.linkedin.com/in/${person.linkedinId}`, '_blank')}
          >
            Connect
          </Button>
          <Button
            leftIcon={<FaEnvelope />}
            colorScheme="blue"
            variant="outline"
            size="sm"
            onClick={() => window.open(`https://www.linkedin.com/messaging/compose?to=${person.linkedinId}`, '_blank')}
          >
            Message
          </Button>
        </HStack>
      </VStack>
    </Box>
  );

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8}>
        <Box w="100%" textAlign="center" mb={8}>
          <Heading size="xl" mb={4}>Alumni Network</Heading>
          <Text color="gray.600">Connect with alumni from your institution</Text>
        </Box>

        <Box w="100%" p={6} borderRadius="xl" bg={cardBg} shadow="lg">
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FaMapMarkerAlt color="gray.300" />
              </InputLeftElement>
              <Input
                name="city"
                placeholder="City"
                value={filters.city}
                onChange={handleFilterChange}
              />
            </InputGroup>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FaGraduationCap color="gray.300" />
              </InputLeftElement>
              <Input
                name="college"
                placeholder="College"
                value={filters.college}
                onChange={handleFilterChange}
              />
            </InputGroup>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FaGraduationCap color="gray.300" />
              </InputLeftElement>
              <Input
                name="pastSchool"
                placeholder="Past School"
                value={filters.pastSchool}
                onChange={handleFilterChange}
              />
            </InputGroup>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FaBuilding color="gray.300" />
              </InputLeftElement>
              <Input
                name="currentEmployer"
                placeholder="Current Employer"
                value={filters.currentEmployer}
                onChange={handleFilterChange}
              />
            </InputGroup>
          </SimpleGrid>
          <Button
            mt={4}
            colorScheme="linkedin"
            onClick={handleSearch}
            width="full"
            leftIcon={<FaSearch />}
            isLoading={loading}
          >
            Search Alumni
          </Button>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="100%">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} height="400px" borderRadius="xl" />
            ))
          ) : (
            alumni.map((person) => (
              <AlumniCard key={person.id} person={person} />
            ))
          )}
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default AlumniSearch;
