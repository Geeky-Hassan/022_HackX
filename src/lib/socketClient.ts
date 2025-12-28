"use client";

import {io, Socket} from "socket.io-client";
import Cookies from "js-cookie";

let socketInstance: Socket | null = null;

const createSocket = (): Socket => {
  const token = Cookies.get("serviceToken");

  // Always create a fresh socket instance with current token
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }

  socketInstance = io("https://5pgrpnef6shvo6xiewv5fkkrou.srv.us", {
    path: "/socket.io",
    transports: ["websocket", "polling"],
    ackTimeout: 60000,
    multiplex: true,
    reconnectionDelay: 3000,
    auth: {token: token},
    secure: true,
    autoConnect: false, // Prevent automatic connection
  });

  return socketInstance;
};

// Function to get socket with fresh token
const getSocket = (): Socket => {
  const currentToken = Cookies.get("serviceToken");

  // If no socket exists or token has changed, create a new one
  if (!socketInstance || (socketInstance as any).auth?.token !== currentToken) {
    return createSocket();
  }

  return socketInstance;
};

export const socket = new Proxy({} as Socket, {
  get(target, prop) {
    const socketInstance = getSocket();
    const value = (socketInstance as any)[prop];

    if (typeof value === "function") {
      return value.bind(socketInstance);
    }

    return value;
  },
  set(target, prop, value) {
    const socketInstance = getSocket();
    (socketInstance as any)[prop] = value;
    return true;
  },
});
