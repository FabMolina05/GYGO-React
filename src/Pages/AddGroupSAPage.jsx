import React, { useEffect } from "react";

import { AddGroupForm } from "../components/AddGroupForm";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import { useAuth } from "../context/AuthContext";

import { Box, Typography, Divider, Paper } from "@mui/material";

export const AddGroupSAPage = () => {
  const { refreshUserData } = useAuth();
  const handleGroupCreated = async () => {
    await refreshUserData();
  };

  return (
    <>
      <Box component={Paper} elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Crear nuevo grupo
        </Typography>

        <hr></hr>
        <AddGroupForm onGroupCreated={handleGroupCreated} />
      </Box>
    </>
  );
};
