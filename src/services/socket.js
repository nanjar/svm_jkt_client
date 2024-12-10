import React from 'react';
import socketio from "socket.io-client";

export const socket = (function(){
    if(window.location.hostname !== "localhost")
        return;
    console.log('helelo wr sisici')
    return socketio.connect(process.env.REACT_APP_WEBSOCKET)
})();
export const SocketContext = React.createContext();