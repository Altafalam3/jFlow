import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Switch,
  VStack,
  SimpleGrid,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';

const jobSites = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'indeed', label: 'Indeed' },
  { value: 'glassdoor', label: 'Glassdoor' },
  { value: 'zip_recruiter', label: 'ZipRecruiter' },
  { value: 'google', label: 'Google Jobs' },
  { value: 'bayt', label: 'Bayt' },
];

const jobTypes = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'temporary', label: 'Temporary' },
  { value: 'internship', label: 'Internship' },
];

const JobSearchForm = ({ onSearch }) => {
  const [formData, setFormData] = useState({
    site_name: ['linkedin', 'indeed'],
    search_term: '',
    location: '',
    distance: 50,
    is_remote: false,
    job_type: '',
    results_wanted: 15,
    country_indeed: 'usa',
    description_format: 'markdown',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSiteChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      site_name: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(formData);
  };

  return (
    <Box as="form" onSubmit={handleSubmit} bg="white" p={6} borderRadius="lg" shadow="md">
      <VStack spacing={6}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} width="100%">
          <FormControl isRequired>
            <FormLabel>Job Sites</FormLabel>
            <Select 
              name="site_name"
              multiple
              value={formData.site_name}
              onChange={handleSiteChange}
              size="lg"
              height="auto"
              minHeight="100px"
            >
              {jobSites.map(site => (
                <option key={site.value} value={site.value}>
                  {site.label}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Search Term</FormLabel>
            <Input
              name="search_term"
              value={formData.search_term}
              onChange={handleChange}
              placeholder="e.g. Software Engineer"
              size="lg"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Location</FormLabel>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. San Francisco, CA"
              size="lg"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Job Type</FormLabel>
            <Select
              name="job_type"
              value={formData.job_type}
              onChange={handleChange}
              size="lg"
            >
              <option value="">All Types</option>
              {jobTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Distance (miles)</FormLabel>
            <NumberInput
              name="distance"
              value={formData.distance}
              onChange={(value) => handleChange({ target: { name: 'distance', value } })}
              min={0}
              max={100}
              size="lg"
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <FormControl>
            <FormLabel>Results per Site</FormLabel>
            <NumberInput
              name="results_wanted"
              value={formData.results_wanted}
              onChange={(value) => handleChange({ target: { name: 'results_wanted', value } })}
              min={1}
              max={50}
              size="lg"
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </SimpleGrid>

        <FormControl display="flex" alignItems="center">
          <FormLabel mb="0">Remote Only</FormLabel>
          <Switch
            name="is_remote"
            isChecked={formData.is_remote}
            onChange={(e) => handleChange({
              target: {
                name: 'is_remote',
                value: e.target.checked
              }
            })}
            size="lg"
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          width="100%"
          maxW="400px"
        >
          Search Jobs
        </Button>
      </VStack>
    </Box>
  );
};

export default JobSearchForm; 