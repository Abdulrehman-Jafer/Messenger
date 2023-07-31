import { io } from "socket.io-client";

const HOST = "http://localhost:3000";
const socket = io(HOST, {
  autoConnect: false,
});

export default socket;
