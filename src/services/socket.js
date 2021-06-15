import React from 'react';
import socketio from "socket.io-client";

export const socket = socketio.connect('http://192.168.50.4:3002');
export const SocketContext = React.createContext();