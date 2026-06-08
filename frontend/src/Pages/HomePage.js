import {
    Box,
    Container,
    Text,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel
} from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useEffect, React } from "react";
import { useHistory } from "react-router-dom"

const Homepage = () => {
    const history = useHistory()
    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("userInfo"))

        if (user) {
            history.push("/")
        }
    }, [history])

    return (
        <Container maxW={"xl"} centerContent>
            <Box
                display={"flex"}
                justifyContent={"center"}
                p={3}
                bg={"white"}
                w={"100%"}
                m={"40px 0 15px 0"}
                borderRadius={"lg"}
                borderWidth={"1px"}
            >
                <Text
                    fontSize={"4xl"}
                    fontFamily={"Work sans"}
                    color={"black"}
                    textAlign="center">
                    Talk-A-Tive
                </Text>
            </Box>
            <Box bg={"white"}
                w={"100%"}
                p={4}
                borderRadius={"lg"}
                borderWidth={"1px"}
                color={"black"}>
                <Tabs variant="soft-rounded" colorScheme="blue">
                    <TabList mb="1em">
                        <Tab width="50%">Login</Tab>
                        <Tab width="50%">Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <Signup />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}

export default Homepage