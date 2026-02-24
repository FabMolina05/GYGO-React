import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
  TextField,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
  Typography,
  Chip
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MDBox from "../components/MDBox";
import MDTypography from "../components/MDTypography";
import * as signalR from "@microsoft/signalr";
import DashboardLayout from "../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../examples/Navbars/DashboardNavbar";
import { useAuth } from "../context/AuthContext";
import { appsettings } from "../settings/appsettings";


export function Messages() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isMessageSet, setIsMessageSet] = useState(true);
  const { userId } = useAuth();
  const connectionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const isLoadingMessagesRef = useRef(false);


  // Función para hacer scroll hacia abajo
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Función para hacer scroll hacia abajo inmediatamente (sin animación)
  const scrollToBottomInstant = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "instant" });
    }
  };

  // Scroll hacia abajo SOLO cuando se recibe un nuevo mensaje (no al cargar el historial)
  useEffect(() => {
    // Si se está cargando el historial inicial, no hacer scroll
    if (!isLoadingMessagesRef.current && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length]); // Solo depende de la longitud, no del array completo
  const URL = "/api/chatHub" // para el proxy en package.json;
  //const URL = "https://localhost:5135/chathub"; //ruta directa al hub de SignalR

  // Conexión SignalR
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(URL, { withCredentials: true })
      .withAutomaticReconnect()
      .build();

    connection.start().then(() => {
      // Obtener chats del usuario
      connection.invoke("getChats", userId);
    }).catch(err => console.error("Error de conexión:", err));

    // Recibir lista de chats
    connection.on("ReceiveChats", (userConnections) => {
      setChats(userConnections);
      if (userConnections.length > 0 && !selectedChat) {
        setSelectedChat(userConnections[0]);
      }
    });

    // Recibir historial de mensajes
    connection.on("ReceiveMessages", (messagesHistory) => {
      isLoadingMessagesRef.current = true;
      setMessages(messagesHistory);
      // Hacer scroll instantáneo al cargar el historial
      setTimeout(() => {
        scrollToBottomInstant();
        isLoadingMessagesRef.current = false;
      }, 100);
    });

    // Recibir mensajes nuevos
    connection.on("ReceiveSpecificMessage", (username, message) => {
      // Crear el objeto del mensaje con la estructura correcta
      const newMessage = {
        messageText: message.messageText,
        username: username,
        timestamp: message.timestamp,
      };

      setMessages((prev) => [...prev, newMessage]);
    });

    // Recibir usuarios disponibles para añadir
    connection.on("ReceiveUsersByGroup", (users) => {
      const filteredUsers = users.filter(user => user.id !== userId && !isUserAlreadyInChats(user));
      setAvailableUsers(filteredUsers);
      setIsLoadingUsers(false);
    });

    // Recibir confirmación de conexión añadida
    connection.on("ReceiveUserConnection", (newConnection) => {
      // Actualizar la lista de chats
      setChats(prev => [...prev, newConnection]);
      setIsModalOpen(false);
      // Opcional: mostrar notificación de éxito
      
    });

    connectionRef.current = connection;

    return () => {
      connection.stop();
    };
    // eslint-disable-next-line
  }, []);

  // Unirse a la sala y obtener historial cuando cambia el chat seleccionado
  useEffect(() => {
    if (selectedChat && connectionRef.current) {
      connectionRef.current.invoke("JoinSpecificChatRoom", {
        Id: selectedChat.id || selectedChat.Id,
        username: selectedChat.username,
        Chatroom: selectedChat.chatroom
      });
      connectionRef.current.invoke(
        "OnConnect", {
        Id: selectedChat.id || selectedChat.Id,
        username: selectedChat.username,
        Chatroom: selectedChat.chatroom
      });
    }
  }, [selectedChat, userId]);

  const handleSend = () => {
    if (input.trim() && connectionRef.current && selectedChat) {
      connectionRef.current.invoke("SendMessage", input, userId, selectedChat.chatroom);
      setInput("");
    }
  };

  // Función para abrir el modal y cargar usuarios disponibles
  const handleOpenAddContactModal = () => {
    setIsModalOpen(true);
    setIsLoadingUsers(true);
    if (connectionRef.current) {
      // Asumiendo que tienes un groupId, ajusta según tu lógica

      connectionRef.current.invoke("GetUsersByGroup");
    }
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setAvailableUsers([]);
  };

  // Función para añadir un contacto
  const handleAddContact = (user) => {
    if (connectionRef.current) {
      const userConnectionRequest = {
        Id: user.id || user.Id,
        username: user.username || user.Username
      };

      connectionRef.current.invoke("AddUserConnection", userConnectionRequest, userId);
    }
  };

  // Función para verificar si un usuario ya está en los chats
  const isUserAlreadyInChats = (user) => {
    return chats.some(chat =>
      (chat.username || chat.Username) === (user.username || user.Username)
    );
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox
        p={2}
        sx={{
          height: 'calc(100vh - 120px)',
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
          overflow: 'hidden'
        }}
      >
        <Grid container spacing={2} sx={{ height: '100%', width: '100%' }}>
          {/* Sidebar de chats */}
          <Box
            sx={{
              height: '100%',
              width: { xs: '30%', sm: '25%', md: '20%', lg: '20%' },
              minWidth: 200,
              maxWidth: 300,
              flexShrink: 0,
            }}
          >
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <MDBox p={2} sx={{ borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <MDTypography variant="h6">
                  Chats
                </MDTypography>
                <IconButton
                  color="primary"
                  onClick={handleOpenAddContactModal}
                  sx={{
                    backgroundColor: '#e3f2fd',
                    '&:hover': { backgroundColor: '#bbdefb' }
                  }}
                >
                  <PersonAddIcon />
                </IconButton>
              </MDBox>
              <Box sx={{ flex: 1, overflow: 'auto' }}>
                <List sx={{ py: 0 }}>
                  {chats.map((chat, idx) => (
                    <ListItem
                      component="button"
                      key={chat.chatroom || idx}
                      selected={
                        selectedChat &&
                        (selectedChat.chatroom || selectedChat.Chatroom) ===
                        (chat.chatroom || chat.Chatroom)
                      }
                      onClick={() => setSelectedChat(chat)}
                      sx={{
                        cursor: 'pointer',
                        p: 2,
                        border: '1px solid #f0f0f0',
                        borderLeft: selectedChat &&
                          (selectedChat.chatroom || selectedChat.Chatroom) ===
                          (chat.chatroom || chat.Chatroom) ? '4px solid #1976d2' : '4px solid transparent',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: '#f8f9fa',
                          transform: 'translateX(4px)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        },
                        '&.Mui-selected': {
                          backgroundColor: '#e3f2fd',
                          '&:hover': {
                            backgroundColor: '#e3f2fd',
                            transform: 'translateX(4px)'
                          }
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            backgroundColor: '#1976d2',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2,
                            color: 'white',
                            fontSize: '0.9rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {(chat.username || chat.Username)?.charAt(0)?.toUpperCase()}
                        </Box>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <MDTypography
                            variant="body1"
                            sx={{
                              fontWeight: selectedChat &&
                                (selectedChat.chatroom || selectedChat.Chatroom) ===
                                (chat.chatroom || chat.Chatroom) ? 600 : 500,
                              fontSize: '0.95rem',
                              mb: 0.5,
                              color: '#333'
                            }}
                          >
                            {chat.username || chat.Username}
                          </MDTypography>
                        </Box>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Card>
          </Box>

          {/* Chat principal */}
          <Box sx={{ flex: 1, height: '100%' }}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Header del chat */}
              <MDBox p={2} sx={{ borderBottom: '1px solid #eee' }}>
                <MDTypography variant="h6">
                  {selectedChat
                    ? selectedChat.username || selectedChat.Username
                    : "Selecciona un chat"}
                </MDTypography>
              </MDBox>

              {/* Área de mensajes */}
              <MDBox
                ref={messagesContainerRef}
                sx={{
                  flex: 1,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  p: 1
                }}
              >
                {messages.length > 0 ? (
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <List sx={{ py: 0, flex: 1, overflow: 'auto' }}>
                      {messages.map((msg, idx) => {
                        const isCurrentUser = msg.username === selectedChat?.username;

                        return (
                          <ListItem
                            key={idx}
                            sx={{
                              display: 'flex',
                              justifyContent: isCurrentUser ? 'flex-start' : 'flex-end',
                              alignItems: 'flex-start',
                              mb: 1,
                              px: 2,
                            }}
                          >
                            <Box
                              sx={{
                                maxWidth: '70%',
                                backgroundColor: isCurrentUser ? '#f5f5f5' : '#1976d2',
                                color: isCurrentUser ? 'white' : '#f5f5f5',
                                borderRadius: 2,
                                p: 1.5,
                                position: 'relative'
                              }}
                            >
                              <ListItemText
                                primary={msg.messageText}
                                secondary={
                                  <Box
                                    component="span"
                                    sx={{
                                      color: isCurrentUser ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)',
                                      fontSize: '0.75rem'
                                    }}
                                  >
                                    {new Date(msg.timestamp).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </Box>
                                }
                                sx={{
                                  margin: 0,
                                  '& .MuiListItemText-primary': {
                                    fontSize: '0.9rem',
                                    lineHeight: 1.4
                                  }
                                }}
                              />
                            </Box>
                          </ListItem>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </List>
                    
                    <Box
                      sx={{
                        py: 1,
                        px: 2,
                        textAlign: 'center',
                        borderTop: '1px solid #eee',
                        backgroundColor: '#fafafa'
                      }}
                    >
                      <MDTypography variant="caption" color="textSecondary">
                        Los mensajes se eliminarán después de 15 días
                      </MDTypography>
                    </Box>
                  </Box>
                
                ) : (
                  <Box
                    sx={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'text.secondary'
                    }}
                  >
                    <MDTypography variant="body2">
                      No hay mensajes en este chat
                    </MDTypography>

                  </Box>
                )}

              </MDBox>



              {/* Input para enviar mensaje */}
              {selectedChat && (
                <MDBox
                  p={2}
                  display="flex"
                  alignItems="center"
                  sx={{ borderTop: '1px solid #eee' }}
                >
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="Escribe un mensaje..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    sx={{ mr: 1 }}
                  />
                  <IconButton
                    color={input.trim() ? "primary" : "default"}
                    onClick={handleSend}
                    disabled={!input.trim()}
                  >
                    <SendIcon />
                  </IconButton>
                </MDBox>
              )}
            </Card>
          </Box>
        </Grid>
      </MDBox>

      {/* Modal para añadir contacto */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonAddIcon color="primary" />
            <Typography variant="h6">Añadir Contacto</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {isLoadingUsers ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <Typography>Cargando usuarios disponibles...</Typography>
            </Box>
          ) : (
            <List>
              {availableUsers.length > 0 ? (
                availableUsers.map((user, idx) => {
                  const isAlreadyAdded = isUserAlreadyInChats(user);

                  return (
                    <ListItem
                      key={user.id || user.Id || idx}
                      sx={{
                        border: '1px solid #e0e0e0',
                        borderRadius: 2,
                        mb: 1,
                        backgroundColor: isAlreadyAdded ? '#f5f5f5' : 'white'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            mr: 2,
                            backgroundColor: '#1976d2'
                          }}
                        >
                          {(user.username || user.Username)?.charAt(0)?.toUpperCase()}
                        </Avatar>

                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" fontWeight="medium">
                            {user.username || user.Username}
                          </Typography>
                          {user.email && (
                            <Typography variant="body2" color="text.secondary">
                              {user.email}
                            </Typography>
                          )}
                        </Box>

                        {isAlreadyAdded ? (
                          <Chip
                            label="Ya añadido"
                            size="small"
                            color="default"
                            variant="outlined"
                          />
                        ) : (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleAddContact(user)}
                            startIcon={<PersonAddIcon />}
                          >
                            Añadir
                          </Button>
                        )}
                      </Box>
                    </ListItem>
                  );
                })
              ) : (
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <Typography color="text.secondary">
                    No hay usuarios disponibles para añadir
                  </Typography>
                </Box>
              )}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}