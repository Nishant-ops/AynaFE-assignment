import React from "react";
import {
  Box,
  Avatar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
function Drawer({
  username,
  chatRooms,
  handleRoomSelect,
  setCreateRoomOpen,
  handleLogout,
  selectedRoom,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundImage: "linearGradient(#0A0908, rgba(255, 255, 255, 0.15))",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          p: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <Avatar alt="Logo" src="https://getayna.com/images/icon.svg" />
          <Box sx={{ ml: 2 }}>
            <Typography variant="h6">Chat Rooms</Typography>
            <Typography variant="caption" sx={{ color: "grey.500" }}>
              {username} {/* Assuming 'username' is accessible here */}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {chatRooms &&
          chatRooms.map((room) => (
            <ListItem
              button
              key={room.id}
              selected={selectedRoom && selectedRoom.id === room.id}
              onClick={() => handleRoomSelect(room)}
            >
              <ListItemText primary={room.attributes.name} />
            </ListItem>
          ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          fullWidth
          color="primary"
          sx={{ borderRadius: 3 }}
          onClick={() => setCreateRoomOpen(true)}
        >
          Create Room
        </Button>
        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            backgroundColor: "#F06543",
            "&:hover": { backgroundColor: "darkred" },
            borderRadius: 3,
          }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
}

export default Drawer;
