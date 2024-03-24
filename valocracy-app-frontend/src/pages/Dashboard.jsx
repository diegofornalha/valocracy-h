import { Box } from "@chakra-ui/react";
import { Navbar } from "../components/Navbar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <Box
      width="full"
      height="100%"
      minH={"100vh"}
      bgGradient="linear(to-r, gray.800, green.800, gray.800)"
      position={"relative"}
    >
      <Navbar />
      <Outlet />
    </Box>
  );
};

export default Dashboard;
