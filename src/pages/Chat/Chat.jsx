import React, { useEffect, useState } from "react";
import {
  Container,
  CssBaseline,
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Drawer,
  useMediaQuery,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  AppBar,
  Toolbar,
  Avatar,
} from "@mui/material";
import io from "socket.io-client";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { listRooms, listMessages, createRoom } from "../../api/chat";
import { ChatDrawer } from "../../Components/ChatDrawer";

export default function ChatPage() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [chatRooms, setChatRooms] = useState([]);
  const [createRoomOpen, setCreateRoomOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [ws, setWs] = useState(null);
  const isMobile = useMediaQuery("(max-width:600px)");
  const navigate = useNavigate();

  const username = localStorage.getItem("username"); // Retrieve username from local storage

  useEffect(() => {
    fetchRooms();
    connectToSocket();
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [navigate]);
  useEffect(() => {
    if (!ws) return;
    ws.on("recieve-messages", (event) => {
      const incomingMessage = event.message;
      setChat((prevChat) => [...prevChat, incomingMessage]);
    });
  }, [ws]);
  function connectToSocket() {
    const socket = io.connect(
      "https://exciting-purpose-518385d87d.strapiapp.com/"
    );
    setWs(socket);
  }
  async function fetchRooms() {
    const rooms = await listRooms();
    const data = rooms.data;
    setChatRooms(data);
    if (data.length > 0) {
      handleRoomSelect(data[0]);
    }
  }

  async function fetchMessages(roomId) {
    const messages = await listMessages(roomId);
    setChat(messages);
  }

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      const newMessage = {
        content: message,
      };
      console.log(ws);
      ws.emit("sendMessage", newMessage, selectedRoom.id);
      setMessage("");
    }
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleCreateRoom = async () => {
    if (newRoomName.trim() !== "") {
      const newRoom = await createRoom(newRoomName);
      setChatRooms([...chatRooms, newRoom.data]);
      setNewRoomName("");
      setCreateRoomOpen(false);
      handleRoomSelect(newRoom.data);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleRoomSelect = async (room) => {
    setSelectedRoom(room);
    setDrawerOpen(false); // Close drawer on mobile after selecting a room
    fetchMessages(room.id);
  };

  return (
    <Container component="main" maxWidth="lg" sx={{ padding: "0px" }}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
        }}
      >
        {isMobile && (
          <AppBar position="static">
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>

              {username && (
                <Typography variant="body1" sx={{ ml: 2 }}>
                  {username}
                </Typography>
              )}
            </Toolbar>
          </AppBar>
        )}

        <Box sx={{ display: "flex", flexGrow: 1 }}>
          {!isMobile && (
            <Box
              sx={{
                width: "25%",
                borderRight: 1,
                borderColor: "divider",
                overflow: "auto",
              }}
            >
              <ChatDrawer
                username={username}
                chatRooms={chatRooms}
                setCreateRoomOpen={setCreateRoomOpen}
                handleRoomSelect={handleRoomSelect}
                handleLogout={handleLogout}
                selectedRoom={selectedRoom}
              />
            </Box>
          )}

          {/* Chat Window */}
          <Box
            sx={{
              width: isMobile ? "100%" : "75%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                flexGrow: 1,
                p: 2,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {chat &&
                chat.map((chat) => (
                  <Box
                    key={chat.id}
                    sx={{
                      alignSelf:
                        chat.sender_type === "USER" ? "flex-end" : "flex-start",
                      bgcolor:
                        chat.sender_type === "USER" ? "forestgreen" : "snow",
                      color: "#000000",
                      p: 1,
                      borderRadius: 3,
                      maxWidth: "60%",
                      mb: 1,
                    }}
                  >
                    {chat.content}
                  </Box>
                ))}
            </Box>
            {selectedRoom && (
              <Box
                sx={{
                  display: "flex",
                  p: 2,
                  borderTop: 1,
                  borderColor: "divider",
                }}
              >
                <TextField
                  variant="outlined"
                  fullWidth
                  placeholder="Type a message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                  sx={{ mr: 2 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSendMessage()}
                  sx={{ borderRadius: 3 }}
                >
                  Send
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Create Room Dialog */}
      <Dialog open={createRoomOpen} onClose={() => setCreateRoomOpen(false)}>
        <DialogTitle>Create a new chat room</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name for the new chat room.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Room Name"
            fullWidth
            variant="outlined"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateRoomOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateRoom} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        {
          <ChatDrawer
            username={username}
            chatRooms={chatRooms}
            setCreateRoomOpen={setCreateRoomOpen}
            handleRoomSelect={handleRoomSelect}
            handleLogout={handleLogout}
            selectedRoom={selectedRoom}
          />
        }
      </Drawer>
    </Container>
  );
}
