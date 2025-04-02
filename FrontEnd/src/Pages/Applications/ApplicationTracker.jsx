
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
} from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa';

const statusColors = {
  'Applied': 'blue',
  'Interview Scheduled': 'purple',
  'In Progress': 'orange',
  'Offer Received': 'green',
  'Rejected': 'red',
};

const ApplicationTracker = () => {
  const [applications, setApplications] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [newApplication, setNewApplication] = useState({
    company: '',
    position: '',
    status: 'Applied',
    applicationDate: '',
  });

  const handleAddApplication = () => {
    setApplications([
      ...applications,
      { ...newApplication, id: Date.now() },
    ]);
    onClose();
    toast({
      title: 'Application added.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleStatusUpdate = (id, newStatus) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ));
    toast({
      title: 'Status updated.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Text fontSize="2xl" fontWeight="bold">Application Tracker</Text>
          <Button
            leftIcon={<FaPlus />}
            colorScheme="blue"
            onClick={onOpen}
          >
            Add Application
          </Button>
        </HStack>

        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Company</Th>
                <Th>Position</Th>
                <Th>Application Date</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {applications.map((app) => (
                <Tr key={app.id}>
                  <Td>{app.company}</Td>
                  <Td>{app.position}</Td>
                  <Td>{app.applicationDate}</Td>
                  <Td>
                    <Badge colorScheme={statusColors[app.status]}>
                      {app.status}
                    </Badge>
                  </Td>
                  <Td>
                    <Select
                      size="sm"
                      value={app.status}
                      onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                    >
                      {Object.keys(statusColors).map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </Select>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add New Application</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Company</FormLabel>
                  <Input
                    value={newApplication.company}
                    onChange={(e) => setNewApplication({
                      ...newApplication,
                      company: e.target.value
                    })}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Position</FormLabel>
                  <Input
                    value={newApplication.position}
                    onChange={(e) => setNewApplication({
                      ...newApplication,
                      position: e.target.value
                    })}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Application Date</FormLabel>
                  <Input
                    type="date"
                    value={newApplication.applicationDate}
                    onChange={(e) => setNewApplication({
                      ...newApplication,
                      applicationDate: e.target.value
                    })}
                  />
                </FormControl>

                <Button colorScheme="blue" mr={3} onClick={handleAddApplication}>
                  Save
                </Button>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
};

export default ApplicationTracker;
