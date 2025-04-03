import React, { useState, useEffect } from "react";
import {
    Box,
    Container,
    VStack,
    Heading,
    Text,
    SimpleGrid,
    Button,
    useColorModeValue,
    Image,
    Badge,
    HStack,
    Icon,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Flex,
    useToast,
    IconButton,
    useDisclosure,
} from "@chakra-ui/react";
import {
    FaBuilding,
    FaCalendarAlt,
    FaClock,
    FaPlus,
    FaChevronDown,
    FaEdit,
    FaTrash,
} from "react-icons/fa";
import AddApplicationModal from "./components/AddApplicationModal";

const ApplicationTracker = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    useEffect(() => {
        const savedApplications = localStorage.getItem("applications");
        if (savedApplications) {
            setApplications(JSON.parse(savedApplications));
        }
        setLoading(false);
    }, []);

    const handleAddApplication = (newApp) => {
        const updatedApps = [...applications, { ...newApp, id: Date.now() }];
        setApplications(updatedApps);
        localStorage.setItem("applications", JSON.stringify(updatedApps));
        onClose();
        toast({
            title: "Application Added",
            status: "success",
            duration: 2000,
        });
    };

    const handleStatusChange = (id, newStatus) => {
        const updatedApps = applications.map((app) =>
            app.id === id ? { ...app, status: newStatus } : app
        );
        setApplications(updatedApps);
        localStorage.setItem("applications", JSON.stringify(updatedApps));
        toast({
            title: "Status Updated",
            status: "success",
            duration: 2000,
        });
    };

    const handleDelete = (id) => {
        const updatedApps = applications.filter((app) => app.id !== id);
        setApplications(updatedApps);
        localStorage.setItem("applications", JSON.stringify(updatedApps));
        toast({
            title: "Application Deleted",
            status: "success",
            duration: 2000,
        });
    };

    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const cardHoverBg = useColorModeValue("gray.50", "gray.700");

    const getStatusColor = (status) => {
        const statusColors = {
            Applied: "blue",
            "In Progress": "yellow",
            "Interview Scheduled": "purple",
            "Offer Received": "green",
            Rejected: "red",
        };
        return statusColors[status] || "gray";
    };

    const ApplicationCard = ({ application }) => (
        <Box
            p={6}
            bg={bgColor}
            borderRadius="xl"
            border="1px"
            borderColor={borderColor}
            transition="all 0.3s"
            _hover={{
                transform: "translateY(-4px)",
                bg: cardHoverBg,
                shadow: "lg",
            }}
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
                        <Text>
                            Applied:{" "}
                            {new Date(
                                application.applicationDate
                            ).toLocaleDateString()}
                        </Text>
                    </HStack>
                </HStack>

                <HStack spacing={4} justify="space-between">
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
                            {[
                                "Applied",
                                "In Progress",
                                "Interview Scheduled",
                                "Offer Received",
                                "Rejected",
                            ].map((status) => (
                                <MenuItem
                                    key={status}
                                    onClick={() =>
                                        handleStatusChange(
                                            application.id,
                                            status
                                        )
                                    }
                                >
                                    {status}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <HStack>
                        <IconButton
                            icon={<FaTrash />}
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => handleDelete(application.id)}
                            aria-label="Delete application"
                        />
                    </HStack>
                </HStack>
            </VStack>
        </Box>
    );

    return (
        <Box bg={useColorModeValue("gray.50", "gray.900")} minH="100vh" py={8}>
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
                            onClick={onOpen}
                        >
                            Add Application
                        </Button>
                    </Flex>

                    <SimpleGrid
                        columns={{ base: 1, lg: 2 }}
                        spacing={6}
                        w="full"
                    >
                        {applications.map((application) => (
                            <ApplicationCard
                                key={application.id}
                                application={application}
                            />
                        ))}
                    </SimpleGrid>
                </VStack>
            </Container>
            <AddApplicationModal
                isOpen={isOpen}
                onClose={onClose}
                onApplicationAdded={handleAddApplication}
            />
        </Box>
    );
};

export default ApplicationTracker;
