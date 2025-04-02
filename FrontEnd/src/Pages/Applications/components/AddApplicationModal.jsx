
import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useToast,
  Select,
} from '@chakra-ui/react';
import applicationService from '../../../services/applicationService';

const AddApplicationModal = ({ isOpen, onClose, onApplicationAdded }) => {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    status: 'Applied',
    applicationDate: new Date().toISOString().split('T')[0],
    logo: 'https://via.placeholder.com/50'
  });
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await applicationService.addApplication(formData);
      onApplicationAdded(response);
      onClose();
      toast({
        title: 'Application added successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error adding application',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Application</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Company</FormLabel>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Position</FormLabel>
                <Input
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Status</FormLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="Applied">Applied</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Offer Received">Offer Received</option>
                  <option value="Rejected">Rejected</option>
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Application Date</FormLabel>
                <Input
                  type="date"
                  value={formData.applicationDate}
                  onChange={(e) => setFormData({...formData, applicationDate: e.target.value})}
                />
              </FormControl>
              <Button type="submit" colorScheme="blue" width="100%">
                Add Application
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddApplicationModal;
