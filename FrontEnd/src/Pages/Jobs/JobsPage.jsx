import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, 
  Container,
  HStack,
  VStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  useDisclosure,
} from '@chakra-ui/react';
import { applyJob, getSingleJobs, savedJobs } from "../../Redux/Jobs/actions";
import './JobsPage.css';

const JobsPage = () => {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("User"));
  const currentjobs = useSelector((store) => store.job.singleJob);
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    if (id) {
      dispatch(getSingleJobs(id));
    }
  }, [dispatch, id]);

  const handleSaveJob = (job) => {
    dispatch(savedJobs({ ...job, userId: user?.userId }));
    toast({
      title: "Job saved successfully",
      status: "success",
      duration: 2000,
      position: "top",
      isClosable: true,
    });
  };

  const handleApplyJob = () => {
    dispatch(applyJob({ ...currentjobs, userId: user?.userId }));
    onClose();
    toast({
      title: "Job Applied successfully",
      status: "success",
      duration: 2000,
      position: "top",
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box p={6} borderWidth="1px" borderRadius="lg" bg="white" shadow="md">
          <VStack align="stretch" spacing={4}>
            <Box>
              <h2 className="data-marked">{currentjobs?.title}</h2>
              <div className="company-jobs">{currentjobs?.company}</div>
            </Box>
            
            <Box className="education">
              <div>Experience: {currentjobs?.experience}</div>
              <div>Salary: {currentjobs?.salary}</div>
              <div>Location: {currentjobs?.location}</div>
            </Box>

            <Box className="keyskill">
              {currentjobs?.keySkills?.map((skill, index) => (
                <span key={index} className="job-skills">
                  {skill}
                </span>
              ))}
            </Box>

            <Box mt={4}>
              <Button colorScheme="blue" mr={3} onClick={handleSaveJob}>
                Save Job
              </Button>
              <Button colorScheme="green" onClick={onOpen}>
                Apply Now
              </Button>
            </Box>
          </VStack>
        </Box>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Update your account</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Profile Picture</FormLabel>
                <Input placeholder="Picture link" />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Resume</FormLabel>
                <Input placeholder="Resume Link" />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Education</FormLabel>
                <Input placeholder="Educational Details" />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Gender</FormLabel>
                <Select placeholder="Select Gender">
                  <option value="option1">Male</option>
                  <option value="option2">Female</option>
                </Select>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={handleApplyJob}
                colorScheme="blue"
                mr={3}
              >
                Apply
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
};

export default JobsPage;
