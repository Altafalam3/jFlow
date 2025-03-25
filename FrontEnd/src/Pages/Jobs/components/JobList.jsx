import React from 'react';
import {
  VStack,
  Box,
  Heading,
  Text,
  Badge,
  HStack,
  Link,
  Icon,
  Divider,
  useColorModeValue,
  Button,
  Spacer,
} from '@chakra-ui/react';
import { FaBriefcase, FaBuilding, FaMapMarkerAlt, FaClock, FaDollarSign, FaBookmark, FaPaperPlane } from 'react-icons/fa';
import { format } from 'date-fns';

const JobList = ({ jobs, onSave, onApply, user }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const formatSalary = (min, max, interval, currency = 'USD') => {
    if (!min && !max) return null;
    
    const formatNumber = (num) => {
      if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
      } else if (num >= 1000) {
        return `${(num / 1000).toFixed(0)}K`;
      }
      return num;
    };

    const parts = [];
    if (min) parts.push(`${formatNumber(min)}`);
    if (max && max !== min) parts.push(`${formatNumber(max)}`);
    
    return `${currency} ${parts.join(' - ')}${interval ? `/${interval}` : ''}`;
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  if (!jobs.length) {
    return (
      <Box textAlign="center" py={10}>
        <Text fontSize="lg" color="gray.500">
          No jobs found. Try adjusting your search criteria.
        </Text>
      </Box>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      {jobs.map((job, index) => (
        <Box
          key={job.id || index}
          p={6}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          shadow="sm"
          _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
          transition="all 0.2s"
        >
          <VStack align="stretch" spacing={4}>
            <HStack justify="space-between" align="start">
              <VStack align="start" spacing={2}>
                <Heading size="md" color="blue.600">
                  <Link href={job.job_url} isExternal>
                    {job.title}
                  </Link>
                </Heading>
                
                <HStack spacing={4}>
                  <HStack>
                    <Icon as={FaBuilding} color="gray.500" />
                    <Text color="gray.700">{job.company}</Text>
                  </HStack>
                  
                  <HStack>
                    <Icon as={FaMapMarkerAlt} color="gray.500" />
                    <Text color="gray.700">{job.location}</Text>
                  </HStack>
                </HStack>
              </VStack>

              <Badge
                colorScheme={job.site === 'linkedin' ? 'blue' : 
                           job.site === 'indeed' ? 'green' : 
                           job.site === 'glassdoor' ? 'teal' : 'gray'}
                fontSize="sm"
                textTransform="capitalize"
              >
                {job.site}
              </Badge>
            </HStack>

            <Divider />

            <HStack spacing={6} wrap="wrap">
              {job.job_type && (
                <HStack>
                  <Icon as={FaBriefcase} color="gray.500" />
                  <Text color="gray.700" fontSize="sm">
                    {job.job_type}
                  </Text>
                </HStack>
              )}

              {formatSalary(job.min_amount, job.max_amount, job.interval, job.currency) && (
                <HStack>
                  <Icon as={FaDollarSign} color="gray.500" />
                  <Text color="gray.700" fontSize="sm">
                    {formatSalary(job.min_amount, job.max_amount, job.interval, job.currency)}
                  </Text>
                </HStack>
              )}

              {job.date_posted && (
                <HStack>
                  <Icon as={FaClock} color="gray.500" />
                  <Text color="gray.700" fontSize="sm">
                    Posted {formatDate(job.date_posted)}
                  </Text>
                </HStack>
              )}

              {job.is_remote && (
                <Badge colorScheme="purple">Remote</Badge>
              )}

              <Spacer />

              {user && (
                <HStack spacing={2}>
                  <Button
                    leftIcon={<Icon as={FaBookmark} />}
                    size="sm"
                    variant="outline"
                    colorScheme="blue"
                    onClick={() => onSave(job)}
                  >
                    Save
                  </Button>
                  <Button
                    leftIcon={<Icon as={FaPaperPlane} />}
                    size="sm"
                    colorScheme="blue"
                    onClick={() => onApply(job)}
                  >
                    Apply
                  </Button>
                </HStack>
              )}
            </HStack>

            {job.description && (
              <Text
                color="gray.600"
                noOfLines={3}
                fontSize="sm"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            )}
          </VStack>
        </Box>
      ))}
    </VStack>
  );
};

export default JobList; 