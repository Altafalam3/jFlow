
import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
} from '@chakra-ui/react';

const AddApplicationModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    salary: '',
    applicationUrl: '',
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      ...formData,
      applicationDate: new Date().toISOString(),
      status: 'Applied'
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
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
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Enter company name"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Position</FormLabel>
                <Input
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="Enter job title"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Location</FormLabel>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter job location"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Salary Range</FormLabel>
                <Input
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="Enter salary range"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Application URL</FormLabel>
                <Input
                  name="applicationUrl"
                  value={formData.applicationUrl}
                  onChange={handleChange}
                  placeholder="Enter job posting URL"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Notes</FormLabel>
                <Input
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Enter any additional notes"
                />
              </FormControl>
            </VStack>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Add Application
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddApplicationModal;
