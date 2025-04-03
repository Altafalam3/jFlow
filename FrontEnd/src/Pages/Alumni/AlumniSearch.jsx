import React, { useState } from "react";
import {
    Box,
    Container,
    VStack,
    Heading,
    SimpleGrid,
    Input,
    Select,
    Button,
    Text,
    Image,
    Badge,
    HStack,
    Icon,
    Flex,
    useColorModeValue,
} from "@chakra-ui/react";
import {
    FaLinkedin,
    FaBuilding,
    FaGraduationCap,
    FaMapMarkerAlt,
} from "react-icons/fa";
import dummyAlumni from "../../data/dummyAlumni";

const AlumniSearch = () => {
    const [filters, setFilters] = useState({
        search: "",
        college: "",
        company: "",
        location: "",
    });
    const [showResults, setShowResults] = useState(false);
    const [filteredAlumni, setFilteredAlumni] = useState([]);

    const handleSearch = () => {
        let results = dummyAlumni;

        if (filters.search) {
            results = results.filter(
                (alumni) =>
                    alumni.name
                        .toLowerCase()
                        .includes(filters.search.toLowerCase()) ||
                    alumni.currentCompany
                        .toLowerCase()
                        .includes(filters.search.toLowerCase()) ||
                    alumni.role
                        .toLowerCase()
                        .includes(filters.search.toLowerCase())
            );
        }

        if (filters.college) {
            results = results.filter(
                (alumni) => alumni.pastCollege === filters.college
            );
        }

        if (filters.company) {
            results = results.filter((alumni) =>
                alumni.currentCompany
                    .toLowerCase()
                    .includes(filters.company.toLowerCase())
            );
        }

        if (filters.location) {
            results = results.filter(
                (alumni) => alumni.location === filters.location
            );
        }

        setFilteredAlumni(results);
        setShowResults(true);
    };

    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");

    return (
        <Box bg={useColorModeValue("gray.50", "gray.900")} minH="100vh" py={8}>
            <Container maxW="container.xl">
                <VStack spacing={8}>
                    <Heading
                        size="2xl"
                        bgGradient="linear(to-r, blue.400, purple.500)"
                        bgClip="text"
                    >
                        Alumni Network
                    </Heading>

                    <Box
                        w="full"
                        bg={bgColor}
                        p={6}
                        borderRadius="xl"
                        shadow="base"
                    >
                        <SimpleGrid
                            columns={{ base: 1, md: 2, lg: 4 }}
                            spacing={6}
                        >
                            <Input
                                placeholder="Search alumni..."
                                value={filters.search}
                                onChange={(e) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        search: e.target.value,
                                    }))
                                }
                            />

                            <Select
                                placeholder="Select College"
                                value={filters.college}
                                onChange={(e) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        college: e.target.value,
                                    }))
                                }
                            >
                                {[
                                    ...new Set(
                                        dummyAlumni.map((a) => a.pastCollege)
                                    ),
                                ].map((college) => (
                                    <option key={college} value={college}>
                                        {college}
                                    </option>
                                ))}
                            </Select>

                            <Select
                                placeholder="Select Location"
                                value={filters.location}
                                onChange={(e) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        location: e.target.value,
                                    }))
                                }
                            >
                                {[
                                    ...new Set(
                                        dummyAlumni.map((a) => a.location)
                                    ),
                                ].map((location) => (
                                    <option key={location} value={location}>
                                        {location}
                                    </option>
                                ))}
                            </Select>

                            <Button
                                colorScheme="blue"
                                onClick={handleSearch}
                                w="full"
                            >
                                Search
                            </Button>
                        </SimpleGrid>
                    </Box>

                    {showResults && (
                        <SimpleGrid
                            columns={{ base: 1, md: 2, lg: 3 }}
                            spacing={6}
                            w="full"
                        >
                            {filteredAlumni.map((alumni) => (
                                <Box
                                    key={alumni.id}
                                    p={6}
                                    bg={bgColor}
                                    borderRadius="xl"
                                    border="1px"
                                    borderColor={borderColor}
                                    transition="all 0.3s"
                                    _hover={{
                                        transform: "translateY(-4px)",
                                        shadow: "xl",
                                    }}
                                >
                                    <VStack spacing={4}>
                                        <Image
                                            borderRadius="full"
                                            boxSize="120px"
                                            src={alumni.profilePic}
                                            alt={alumni.name}
                                        />

                                        <VStack spacing={2} alignItems="center">
                                            <Heading size="md">
                                                {alumni.name}
                                            </Heading>
                                            <Text color="gray.500">
                                                <Icon as={FaBuilding} mr={2} />
                                                {alumni.currentCompany} -{" "}
                                                {alumni.role}
                                            </Text>
                                            <Text color="gray.500">
                                                <Icon
                                                    as={FaGraduationCap}
                                                    mr={2}
                                                />
                                                {alumni.pastCollege}
                                            </Text>
                                            <Text color="gray.500">
                                                <Icon
                                                    as={FaMapMarkerAlt}
                                                    mr={2}
                                                />
                                                {alumni.location}
                                            </Text>
                                        </VStack>

                                        <Flex
                                            wrap="wrap"
                                            justify="center"
                                            gap={2}
                                        >
                                            {alumni.skills.map((skill) => (
                                                <Badge
                                                    key={skill}
                                                    colorScheme="blue"
                                                    borderRadius="full"
                                                    px={3}
                                                >
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </Flex>

                                        <Button
                                            leftIcon={<FaLinkedin />}
                                            colorScheme="linkedin"
                                            as="a"
                                            href={alumni.linkedinUrl}
                                            target="_blank"
                                            w="full"
                                        >
                                            Connect on LinkedIn
                                        </Button>
                                    </VStack>
                                </Box>
                            ))}
                        </SimpleGrid>
                    )}
                </VStack>
            </Container>
        </Box>
    );
};

export default AlumniSearch;
