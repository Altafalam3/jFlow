
import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Button,
  useColorModeValue,
  Badge,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
} from '@chakra-ui/react';
import { FaBuilding, FaCalendarAlt, FaClock, FaPlus, FaChevronDown } from 'react-icons/fa';

const ApplicationTracker = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await applicationService.getAllApplications();
      setApplications(data);
    } catch (err) {
      setError('Failed to load applications');
      toast({
        title: 'Error',
        description: err.message,
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await applicationService.updateApplicationStatus(id, newStatus);
      setApplications(apps => 
        apps.map(app => 
          app.id === id ? { ...app, status: newStatus } : app
        )
      );
      toast({
        title: 'Status Updated',
        status: 'success',
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleAddApplication = async (newApp) => {
    try {
      const added = await applicationService.addApplication(newApp);
      setApplications(apps => [...apps, added]);
      setIsAddModalOpen(false);
      toast({
        title: 'Application Added',
        status: 'success',
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to add application',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const cardHoverBg = useColorModeValue('gray.50', 'gray.700');

  const getStatusColor = (status) => {
    const statusColors = {
      Applied: 'blue',
      'In Progress': 'yellow',
      'Interview Scheduled': 'purple',
      'Offer Received': 'green',
      Rejected: 'red',
    };
    return statusColors[status] || 'gray';
  };

  const ApplicationCard = ({ application }) => (
    <Box
      p={6}
      bg={bgColor}
      borderRadius="xl"
      border="1px"
      borderColor={borderColor}
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-4px)', bg: cardHoverBg, shadow: 'lg' }}
    >
      <VStack align="stretch" spacing={4}>
        <HStack justify="space-between">
          <HStack spacing={4}>
            <Box
              boxSize="50px"
              borderRadius="md"
              overflow="hidden"
              bg="gray.100"
            >
              <Image
                src={application.logo}
                alt={application.company}
                fallbackSrc="https://via.placeholder.com/50"
              />
            </Box>
            <VStack align="start" spacing={1}>
              <Heading size="md">{application.position}</Heading>
              <Text color="gray.500" fontSize="sm">
                <Icon as={FaBuilding} mr={2} />
                {application.company}
              </Text>
            </VStack>
          </HStack>
          <Badge
            colorScheme={getStatusColor(application.status)}
            px={3}
            py={1}
            borderRadius="full"
          >
            {application.status}
          </Badge>
        </HStack>

        <HStack spacing={4} color="gray.500" fontSize="sm">
          <HStack>
            <Icon as={FaCalendarAlt} />
            <Text>Applied: {new Date(application.applicationDate).toLocaleDateString()}</Text>
          </HStack>
          <HStack>
            <Icon as={FaClock} />
            <Text>Last Updated: 2 days ago</Text>
          </HStack>
        </HStack>

        <HStack spacing={4}>
          <Button size="sm" colorScheme="blue" variant="outline" rounded="full">
            View Details
          </Button>
          <Menu>
            <MenuButton
              as={Button}
              size="sm"
              variant="ghost"
              rightIcon={<FaChevronDown />}
            >
              Update Status
            </MenuButton>
            <MenuList>
              <MenuItem>Applied</MenuItem>
              <MenuItem>In Progress</MenuItem>
              <MenuItem>Interview Scheduled</MenuItem>
              <MenuItem>Offer Received</MenuItem>
              <MenuItem>Rejected</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </VStack>
    </Box>
  );

  return (
    <Box bg={useColorModeValue('gray.50', 'gray.900')} minH="100vh" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8}>
          <Flex w="full" justify="space-between" align="center">
            <Box>
              <Heading
                size="2xl"
                bgGradient="linear(to-r, blue.400, purple.500)"
                bgClip="text"
              >
                Application Tracker
              </Heading>
              <Text mt={2} color="gray.500">
                Track and manage your job applications
              </Text>
            </Box>
            <Button
              leftIcon={<FaPlus />}
              colorScheme="blue"
              size="lg"
              rounded="xl"
            >
              Add Application
            </Button>
          </Flex>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} w="full">
            {applications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default ApplicationTracker;
