import {
    Box,
    Heading,
    FormControl,
    FormLabel,
    FormHelperText,
    Input,
    InputLeftAddon,
    InputGroup,
    Text,
    Button,
    useToast,
  } from "@chakra-ui/react";
  import React, { useState } from "react";
  import style from "./Register.module.css";
  import NavbarRegister from "../NavAndFooter/NavbarRegister";
  import FooterRegister from "../NavAndFooter/FooterRegister";
  import { Link, useNavigate } from "react-router-dom";
  import axiosInstance from "../../../utils/axiosInstance.js";
  
  const RegisterPage = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [regCreds, setRegCreds] = useState({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      phone: "",
      role: "user",
    });
  
    const handleRegChange = (e) => {
      const { name, value } = e.target;
      setRegCreds({
        ...regCreds,
        [name]: value,
      });
    };
  
    const handleRegFormSubmit = async (e) => {
      e.preventDefault();
      // Check required fields
      if (
        !regCreds.first_name ||
        !regCreds.last_name ||
        !regCreds.email ||
        !regCreds.password ||
        !regCreds.phone
      ) {
        return toast({
          title: "Missing Fields",
          description: "Please enter all the required fields.",
          status: "error",
          duration: 2000,
          position: "top",
          isClosable: true,
        });
      }
  
      try {
        console.log(regCreds)
        const response = await axiosInstance.post("/api/user/signup", regCreds);
        if (response.status === 201) {
          toast({
            title: "Registration Successful",
            status: "success",
            duration: 2000,
            position: "top",
            isClosable: true,
          });
          navigate("/login");
        }
      } catch (error) {
        toast({
          title: "Registration Failed",
          description: error.response?.data.error || "User could not be created.",
          status: "error",
          duration: 2000,
          position: "top",
          isClosable: true,
        });
      }
    };
  
    return (
      <>
        <NavbarRegister />
        <div className={style.contentRegister}>
          <div className={style.rightRegister}>
            <Box className={style.rightRegisterBox}>
              <Heading size="lg" mb="5">
                Find a job & grow your career
              </Heading>
              <form onSubmit={handleRegFormSubmit}>
                <FormControl className={style.rightRegisterForm}>
                  <div>
                    <FormLabel htmlFor="first_name">First Name</FormLabel>
                    <Input
                      id="first_name"
                      type="text"
                      placeholder="Enter your first name"
                      name="first_name"
                      value={regCreds.first_name}
                      onChange={handleRegChange}
                      isRequired
                    />
                  </div>
                  <div>
                    <FormLabel htmlFor="last_name">Last Name</FormLabel>
                    <Input
                      id="last_name"
                      type="text"
                      placeholder="Enter your last name"
                      name="last_name"
                      value={regCreds.last_name}
                      onChange={handleRegChange}
                      isRequired
                    />
                  </div>
                  <div>
                    <FormLabel htmlFor="email">Email ID</FormLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email ID"
                      name="email"
                      value={regCreds.email}
                      onChange={handleRegChange}
                      isRequired
                    />
                    <FormHelperText>
                      We'll send you relevant jobs in your mail.
                    </FormHelperText>
                  </div>
                  <div>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a password for your account"
                      name="password"
                      value={regCreds.password}
                      onChange={handleRegChange}
                      isRequired
                    />
                    <FormHelperText>
                      Minimum 6 characters required.
                    </FormHelperText>
                  </div>
                  <div>
                    <FormLabel htmlFor="phone">Phone Number</FormLabel>
                    <InputGroup>
                      <InputLeftAddon children="+91" bg="white" />
                      <Input
                        type="tel"
                        placeholder="Enter your phone number"
                        name="phone"
                        value={regCreds.phone}
                        onChange={handleRegChange}
                        isRequired
                      />
                    </InputGroup>
                    <FormHelperText>
                      Recruiters will contact you on this number.
                    </FormHelperText>
                  </div>
                  <div>
                    <FormLabel htmlFor="resume">Resume</FormLabel>
                    <div className={style.rightRegisterBoxInputDiv}>
                      <label
                        htmlFor="files"
                        className={style.rightRegisterBoxInputBtn}
                      >
                        Upload Resume
                      </label>
                      <input
                        id="files"
                        type="file"
                        className={style.rightRegisterBoxInput}
                      />
                      <div>
                        <Text fontSize="xs" p="2" color="#8d8aad">
                          DOC, DOCx, PDF, RTF | Max: 2 MB
                        </Text>
                      </div>
                    </div>
                    <FormHelperText>
                      Recruiters give preference to candidates who have a resume.
                    </FormHelperText>
                  </div>
                  <div>
                    <Button colorScheme="blue" borderRadius="20" type="submit">
                      Register Now
                    </Button>
                  </div>
                  <Text mt="4">
                    Already registered?{" "}
                    <Link to="/login">
                      <Button colorScheme="blue" borderRadius="20">
                        Login
                      </Button>
                    </Link>
                  </Text>
                </FormControl>
              </form>
            </Box>
          </div>
        </div>
        <FooterRegister />
      </>
    );
  };
  
  export default RegisterPage;
  