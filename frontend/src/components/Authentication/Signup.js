import { Button, Input, InputGroup, InputRightElement, VStack, FormControl, FormLabel, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useHistory } from "react-router-dom"
import { ChatState } from "../../Context/ChatProvide";

const Signup = () => {
    const [show, setShow] = useState(false)
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [confirmpassword, setConfirmpassword] = useState()
    const [pic, setPic] = useState()
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const history = useHistory()
    const { setUser } = ChatState()

    const handleClick = () => setShow(!show)

    const postDetails = (pics) => {
        setLoading(true)
        if (pics === undefined) {
            toast({
                title: "请选择图片",
                description: "请先选择要上传的图片",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-right",
            })
            setLoading(false)
            return
        }

        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData()
            data.append("file", pics)
            data.append("upload_preset", "chat-app")
            data.append("cloud_name", "dmmfmmslk")
            fetch("https://api.cloudinary.com/v1_1/dmmfmmslk/image/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log("Cloudinary 返回的完整数据:", data)
                    console.log("secure_url:", data.secure_url)
                    console.log("url:", data.url)
                    setPic(data.secure_url)
                    setLoading(false)
                    toast({
                        title: "上传成功",
                        description: "图片已上传",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                        position: "bottom",
                    })
                    console.log(data);

                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false)
                    toast({
                        title: "上传失败",
                        description: "请重试",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                        position: "bottom",
                    })
                })
        } else {
            toast({
                title: "图片格式错误",
                description: "请选择 JPEG 或 PNG 格式的图片",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-right",
            })
            setLoading(false)
            return
        }
    };

    const submitHandler = async () => {
        setLoading(true)
        if (!name || !email || !password || !confirmpassword) {
            toast({
                title: "请填写所有必填项",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            setLoading(false)
            return
        }
        if (password !== confirmpassword) {
            toast({
                title: "确认密码和密码不一致",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            setLoading(false)
            return
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }
            const { data } = await axios.post(
                "/api/user",
                { name, email, password, pic },
                config
            )
            toast({
                title: "注册成功",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })

            sessionStorage.setItem("userInfo", JSON.stringify(data))
            setUser(data)
            setLoading(false)
            history.push("/chats")
        } catch (error) {
            toast({
                title: "发生错误",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            setLoading(false)
        }
    }
    return (
        <VStack spacing={'5px'}>
            <FormControl id="first-name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder="Enter Your name"
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>
            <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder="Enter Your Email"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup size="md">
                    <Input
                        type={show ? "text" : "password"}
                        placeholder="Enter Your Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="confirm-password" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup size="md">
                    <Input
                        type={show ? "text" : "password"}
                        placeholder="Confirm Password"
                        onChange={(e) => setConfirmpassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="pic">
                <FormLabel>Upload your Picture</FormLabel>
                <Input
                    type="file"
                    p={1.5}
                    accept="image/*"
                    onChange={(e) => postDetails(e.target.files[0])}
                />
            </FormControl>
            <Button
                colorScheme={"blue"}
                width={"100%"}
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                isLoading={loading}
            >
                Sign Up
            </Button>
        </VStack>
    )
}

export default Signup