/* global chrome */

import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import style from "./LoginPage.module.css";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import axiosInstance from "../../utils/axiosInstance";

const LoginForm = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [loginCreds, setLoginCreds] = useState({
    email: "",
    password: "",
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginCreds({ ...loginCreds, [name]: value });
  };

  const isExtensionContext = () => {
    return typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginCreds.email || !loginCreds.password) {
      return toast({
        title: "Missing Fields",
        description: "Please enter both email and password.",
        status: "error",
        duration: 2000,
        position: "top",
        isClosable: true,
      });
    }
    try {
      const response = await axiosInstance.post("/api/user/login", loginCreds);
      console.log(response);

      const data = response.data;

      // Check if the login was successful (assuming status 200)
      if (response.status === 200 && data.token) {
        // Save the token to localStorage
        localStorage.setItem("token", data.token);

        try {
          if (isExtensionContext) {
            chrome.runtime.sendMessage("kjiopgbfdcejcbjpnbjlmbpnflehecnl", {
              action: "AddToken",
              token: data.token,
            });
          }
        }
        catch (error) {
          console.log("extension not activated")
        }

        toast({
          title: "Login Successful",
          status: "success",
          duration: 2000,
          position: "top",
          isClosable: true,
        });
        console.log("success");
        console.log(data);
        navigate("/");
      } else {
        toast({
          title: "Login Failed",
          description: data.message || "Invalid credentials.",
          status: "error",
          duration: 2000,
          position: "top",
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.response?.data.message || error.message || "Login failed",
        status: "error",
        duration: 2000,
        position: "top",
        isClosable: true,
      });
    }
  };

  return (
    <div>
      <Heading size="md">Login</Heading>
      <form onSubmit={handleLoginSubmit}>
        <FormControl className={style.formLogin} isRequired>
          <div>
            <FormLabel fontSize="sm" htmlFor="email">
              Email ID
            </FormLabel>
            <Input
              value={loginCreds.email}
              onChange={handleLoginChange}
              type="email"
              name="email"
              placeholder="Enter Email ID"
            />
          </div>
          <div>
            <FormLabel fontSize="sm" htmlFor="password">
              Password
            </FormLabel>
            <InputGroup size="md">
              <Input
                pr="4.5rem"
                placeholder="Enter password"
                name="password"
                type="password"
                value={loginCreds.password}
                onChange={handleLoginChange}
              />
            </InputGroup>
          </div>
          <div>
            <Button colorScheme="blue" my="5" w="300px" type="submit">
              Login
            </Button>
          </div>
          <div className={style.googleDividerDiv}>
            <Divider />
            <div className={style.GoogleDividerORLogin}>OR</div>
            <Button
              className={style.GoogleButton}
              leftIcon={<FcGoogle />}
              colorScheme="blue"
              variant="outline"
              borderRadius="20px"
            >
              Sign in with Google
            </Button>
          </div>
        </FormControl>
      </form>
    </div>
  );
};

export default LoginForm;
