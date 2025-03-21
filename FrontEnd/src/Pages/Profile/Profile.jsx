import React, { useState, useEffect } from "react";
import "./Profile.css";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  Input,
  FormLabel,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import axiosInstance from "../../utils/axiosInstance";

const Profile = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Local state to hold user data
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    resume: null, // Will hold the uploaded file
    urls: [],
  });

  // Fetch user data on mount
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axiosInstance.get("/api/user");
        // The shape of data depends on your backend response
        // Example: { data: { user: {...} } }
        if (response.data && response.data.user) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    getUser();
  }, []);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // Handle resume file selection
  const handleFileChange = (e) => {
    setUser({ ...user, resume: e.target.files[0] });
  };

  // Save changes (PATCH request with FormData)
  const handleSave = async () => {
    try {
      const formData = new FormData();
      // Append fields
      if (user.resume) {
        formData.append("resume", user.resume);
      }
      formData.append("first_name", user.first_name);
      formData.append("last_name", user.last_name);
      formData.append("email", user.email);
      formData.append("phone", user.phone);

      // If you need to send URLs as well:
      (user.urls || []).forEach((urlObj) => {
        formData.append("urls", JSON.stringify(urlObj));
      });

      const response = await axiosInstance.patch("/api/user", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Profile updated:", response.data);

      // Optionally re-fetch updated user or update local state:
      if (response.data && response.data.user) {
        setUser(response.data.user);
      }

      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="profile">
      <div className="profileCon">
        <div className="profileImage">
          {/* Placeholder image; you can replace with user’s avatar if available */}
          <img src="./assets/user.png" alt="avatar" />
          <p>{user.email}</p>
          <button onClick={onOpen}>EDIT PROFILE</button>
        </div>
        <div className="profileDetails">
          <h3>Profile Details</h3>
          <div>
            <p>Full Name</p>
            <p>
              {user.first_name} {user.last_name}
            </p>
          </div>
          <div>
            <p>Mobile Number</p>
            <p>{user.phone}</p>
          </div>
          <div>
            <p>Email</p>
            <p>{user.email}</p>
          </div>
        </div>

        {/* Edit Profile Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Update your account</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>First Name</FormLabel>
                <Input
                  placeholder="Enter first name"
                  value={user.first_name}
                  name="first_name"
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Last Name</FormLabel>
                <Input
                  placeholder="Enter last name"
                  value={user.last_name}
                  name="last_name"
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Email</FormLabel>
                <Input
                  placeholder="Enter email"
                  value={user.email}
                  name="email"
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Phone</FormLabel>
                <Input
                  placeholder="Enter phone number"
                  value={user.phone}
                  name="phone"
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Resume</FormLabel>
                <Input type="file" onChange={handleFileChange} />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button onClick={handleSave} colorScheme="blue" mr={3}>
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default Profile;
