import React, { useState } from "react";
import { IoBagOutline, IoBagAddSharp } from "react-icons/io5";
import { CiLocationOn } from "react-icons/ci";
import { HiOutlineDocumentText } from "react-icons/hi";
import { TfiTimer } from "react-icons/tfi";
import { AiOutlinePlus } from "react-icons/ai";
import { Link } from "react-router-dom";
import {
    Button,
    Container,
    HStack,
    VStack,
    Box,
    Heading,
    Text,
    SimpleGrid,
    useToast,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Badge,
    Flex,
    Image,
    useColorModeValue,
} from "@chakra-ui/react";
import JobSearchForm from "./components/JobSearchForm";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorAlert from "./components/ErrorAlert";

const Jobs = () => {
    const [localJobs, setLocalJobs] = useState([
        {
            id: 1,
            title: "Sales Executive",
            company: "Tushar Hr Consultancy",
            experience: "0 - 4 years",
            salary: "Not Disclosed",
            location: "Ambikapur, Gondiya, Mangaon, Delhi / NCR",
            candidate: "Hired",
            posted: "2 Days ago",
            jobId: "sales-exec",
            jobApplicants: 12,
            keySkills: ["Sales", "Marketing"],
        },
        {
            id: 2,
            title: "Software Engineer",
            company: "Tech Solutions Ltd.",
            experience: "2 - 6 years",
            salary: "₹8 - 12 LPA",
            location: "Bangalore, Hyderabad",
            candidate: "Shortlisted",
            posted: "5 Days ago",
            jobId: "software-eng",
            jobApplicants: 20,
            keySkills: ["JavaScript", "React", "Node.js"],
        },
        {
            id: 3,
            title: "Digital Marketing Specialist",
            company: "Creative Media Pvt Ltd",
            experience: "1 - 3 years",
            salary: "₹4 - 6 LPA",
            location: "Mumbai, Pune",
            candidate: "Interview Scheduled",
            posted: "1 Week ago",
            jobId: "digital-marketing",
            jobApplicants: 15,
            keySkills: ["SEO", "Google Ads", "Content Marketing"],
        },
    ]);

    const [scrapedJobs, setScrapedJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const toast = useToast();
    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");

    const handleSearch = async (searchParams) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("http://localhost:8000/scrape", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(searchParams),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch jobs");
            }

            const data = await response.json();
            setScrapedJobs(data.jobs);

            toast({
                title: `Found ${data.count} jobs`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (err) {
            setError(err.message);
            toast({
                title: "Error",
                description: err.message,
                status: "error",
                duration: 8800,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const formatSalary = (job) => {
        if (job.salary) return job.salary;
        if (job.min_amount || job.max_amount) {
            const min = job.min_amount
                ? `${job.currency || ""}${job.min_amount}`
                : "";
            const max = job.max_amount
                ? `${job.currency || ""}${job.max_amount}`
                : "";
            const interval = job.interval ? `/${job.interval}` : "";
            if (min && max) return `${min} - ${max}${interval}`;
            if (min) return `${min}${interval}+`;
            if (max) return `Up to ${max}${interval}`;
        }
        return "Not Disclosed";
    };

    const formatDate = (date) => {
        if (!date) return "";
        if (typeof date === "string") return date;
        try {
            const dateObj = new Date(date);
            const now = new Date();
            const diffTime = Math.abs(now - dateObj);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 0) return "Today";
            if (diffDays === 1) return "Yesterday";
            if (diffDays < 7) return `${diffDays} days ago`;
            if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
            return `${Math.floor(diffDays / 30)} months ago`;
        } catch (e) {
            return date.toString();
        }
    };

    const JobCard = ({ job, isScraped = false }) => (
        <Box
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            borderColor={borderColor}
            bg={bgColor}
            shadow="sm"
            _hover={{ shadow: "md", transform: "translateY(-2px)" }}
            transition="all 0.2s"
        >
            <VStack align="stretch" spacing={4}>
                <Flex justify="space-between" align="start">
                    <VStack align="start" spacing={1}>
                        <Link
                            to={isScraped ? job.job_url : `/jobspage/${job.id}`}
                            target={isScraped ? "_blank" : "_self"}
                        >
                            <Heading
                                size="md"
                                color="blue.600"
                                _hover={{ color: "blue.700" }}
                            >
                                {job.title}
                            </Heading>
                        </Link>
                        <Text color="gray.600" fontSize="md">
                            {job.company}
                        </Text>
                    </VStack>
                    {!isScraped && job.candidate && (
                        <Badge
                            colorScheme={
                                job.candidate === "Hired"
                                    ? "green"
                                    : job.candidate === "Shortlisted"
                                    ? "yellow"
                                    : "blue"
                            }
                        >
                            {job.candidate}
                        </Badge>
                    )}
                    {isScraped && job.is_remote && (
                        <Badge colorScheme="purple">Remote</Badge>
                    )}
                </Flex>

                <SimpleGrid columns={[1, 2, 3]} spacing={4}>
                    <HStack spacing={2}>
                        <IoBagOutline />
                        <Text fontSize="sm">
                            {isScraped
                                ? job.job_type || "Not specified"
                                : job.experience}
                        </Text>
                    </HStack>
                    <HStack spacing={2}>
                        <CiLocationOn />
                        <Text fontSize="sm">
                            {job.location || "Location not specified"}
                        </Text>
                    </HStack>
                    <HStack spacing={2}>
                        <HiOutlineDocumentText />
                        <Text fontSize="sm">{formatSalary(job)}</Text>
                    </HStack>
                </SimpleGrid>

                {!isScraped && job.keySkills && (
                    <Flex wrap="wrap" gap={2}>
                        {job.keySkills.map((skill, index) => (
                            <Badge
                                key={index}
                                colorScheme="blue"
                                variant="subtle"
                            >
                                {skill}
                            </Badge>
                        ))}
                    </Flex>
                )}
                {isScraped && job.job_function && (
                    <Flex wrap="wrap" gap={2}>
                        <Badge colorScheme="blue" variant="subtle">
                            {job.job_function}
                        </Badge>
                    </Flex>
                )}

                <Flex justify="space-between" align="center">
                    <HStack>
                        <TfiTimer />
                        <Text fontSize="sm" color="gray.500">
                            {isScraped
                                ? formatDate(job.date_posted)
                                : job.posted}
                        </Text>
                    </HStack>
                    {!isScraped && (
                        <Text fontSize="sm" color="gray.500">
                            {job.jobApplicants} applicants
                        </Text>
                    )}
                    {isScraped && (
                        <Text fontSize="sm" color="gray.500">
                            via {job.site}
                        </Text>
                    )}
                </Flex>
            </VStack>
        </Box>
    );

    return (
        <Container maxW="container.xl" pt={20} pb={8}>
            <VStack spacing={8} align="stretch">
                <Box borderRadius="lg" bg={bgColor} p={6} shadow="sm">
                    <VStack spacing={4} align="stretch">
                        <Flex align="center" gap={4}>
                            <IoBagAddSharp size={24} color="blue.500" />
                            <Heading size="lg">
                                Find Your Next Opportunity
                            </Heading>
                        </Flex>
                        <JobSearchForm onSearch={handleSearch} />
                    </VStack>
                </Box>

                <Tabs variant="enclosed">
                    <TabList>
                        <Tab>Local Jobs ({localJobs.length})</Tab>
                        <Tab>Scraped Jobs ({scrapedJobs.length})</Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel>
                            {localJobs.length > 0 ? (
                                <SimpleGrid columns={[1, 1, 2]} spacing={6}>
                                    {localJobs.map((job) => (
                                        <JobCard key={job.id} job={job} />
                                    ))}
                                </SimpleGrid>
                            ) : (
                                <Box textAlign="center" py={10}>
                                    <Image
                                        src="https://images.squarespace-cdn.com/content/v1/576a6006f5e23175ba4e41d8/1595066134418-O7DO7A6F7FZATW78PAI4/Cyber+Security+Boot+Camp"
                                        alt="No jobs found"
                                        maxW="300px"
                                        mx="auto"
                                        mb={4}
                                    />
                                    <Text color="gray.500">
                                        No local jobs found
                                    </Text>
                                </Box>
                            )}
                        </TabPanel>

                        <TabPanel>
                            {isLoading && <LoadingSpinner />}
                            {error && <ErrorAlert message={error} />}
                            {!isLoading &&
                                !error &&
                                (scrapedJobs.length > 0 ? (
                                    <SimpleGrid columns={[1, 1, 2]} spacing={6}>
                                        {scrapedJobs.map((job, index) => (
                                            <JobCard
                                                key={index}
                                                job={job}
                                                isScraped={true}
                                            />
                                        ))}
                                    </SimpleGrid>
                                ) : (
                                    <Box textAlign="center" py={10}>
                                        <Text color="gray.500">
                                            Use the search form above to find
                                            jobs from multiple sources
                                        </Text>
                                    </Box>
                                ))}
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </VStack>
        </Container>
    );
};

export default Jobs;
