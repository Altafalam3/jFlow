
import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Text,
  Image,
  HStack,
  useToast,
  Heading,
  SimpleGrid,
  Input,
  Button,
  useColorModeValue,
  Icon,
  Flex,
  Badge,
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
  const toast = useToast();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const cardHoverBg = useColorModeValue('gray.50', 'gray.700');

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const AlumniCard = ({ person }) => (
    <Box
      p={6}
      bg={bgColor}
      borderRadius="2xl"
      border="1px"
      borderColor={borderColor}
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-4px)', bg: cardHoverBg, shadow: 'xl' }}
    >
      <VStack spacing={4}>
        <Box position="relative">
          <Image
            borderRadius="full"
            boxSize="120px"
            src={person.profilePic || 'https://via.placeholder.com/120'}
            alt={person.name}
            border="4px solid"
            borderColor="blue.400"
          />
          <Badge
            position="absolute"
            bottom={0}
            right={0}
            colorScheme="blue"
            fontSize="sm"
            borderRadius="full"
            px={3}
            py={1}
          >
            {person.connectionDegree}
          </Badge>
        </Box>
        
        <VStack spacing={2} alignItems="center">
          <Heading size="md" color={useColorModeValue('gray.800', 'white')}>
            {person.name}
          </Heading>
          <Text color="gray.500" fontSize="sm">
            <Icon as={FaBuilding} mr={2} color="blue.400" />
            {person.position}
          </Text>
          <Text color="gray.500" fontSize="sm">
            <Icon as={FaGraduationCap} mr={2} color="blue.400" />
            {person.education}
          </Text>
          <Text color="gray.500" fontSize="sm">
            <Icon as={FaMapMarkerAlt} mr={2} color="blue.400" />
            {person.location}
          </Text>
        </VStack>

        <HStack spacing={4}>
          <Button
            leftIcon={<FaLinkedin />}
            colorScheme="linkedin"
            size="sm"
            rounded="full"
          >
            Connect
          </Button>
          <Button
            leftIcon={<FaEnvelope />}
            colorScheme="blue"
            variant="outline"
            size="sm"
            rounded="full"
          >
            Message
          </Button>
        </HStack>
      </VStack>
    </Box>
  );

  return (
    <Box bg={useColorModeValue('gray.50', 'gray.900')} minH="100vh" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8}>
          <Box textAlign="center" w="full">
            <Heading 
              size="2xl" 
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
              mb={4}
            >
              Alumni Network
            </Heading>
            <Text fontSize="lg" color="gray.500">
              Connect with professionals from your institution
            </Text>
          </Box>

          <Box 
            w="full" 
            bg={bgColor} 
            p={8} 
            borderRadius="2xl" 
            shadow="lg"
            border="1px"
            borderColor={borderColor}
          >
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              <Box>
                <Input
                  name="city"
                  placeholder="City"
                  value={filters.city}
                  onChange={handleFilterChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  border="2px"
                  borderColor={borderColor}
                  _focus={{ borderColor: 'blue.400', boxShadow: 'none' }}
                  leftElement={<Icon as={FaMapMarkerAlt} color="gray.400" ml={3} />}
                  size="lg"
                  rounded="xl"
                />
              </Box>
              {/* Similar styling for other inputs */}
            </SimpleGrid>
            <Button
              mt={6}
              size="lg"
              w="full"
              colorScheme="blue"
              leftIcon={<FaSearch />}
              rounded="xl"
              onClick={() => {
                // Search functionality
                toast({
                  title: "Search initiated",
                  description: "Searching for alumni...",
                  status: "info",
                  duration: 2000,
                });
              }}
            >
              Search Alumni
            </Button>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
            {/* Sample alumni data */}
            {[1, 2, 3].map((i) => (
              <AlumniCard
                key={i}
                person={{
                  name: `Alumni ${i}`,
                  position: "Software Engineer",
                  education: "Computer Science",
                  location: "New York",
                  connectionDegree: "2nd",
                }}
              />
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default AlumniSearch;
