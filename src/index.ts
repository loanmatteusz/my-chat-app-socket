import { Server, Socket } from 'socket.io';

const io = new Server({
    cors: {
        origin: "http://localhost:5173"
    }
});

let activeUsers: any[] = [];

io.on('connection', (socket: Socket) => {
    console.log(`New connection with Id: ${socket.id}`);

    socket.on('add-new-user', (userId) => {
        if (!activeUsers.some(user => user._id === userId)) {
            activeUsers.push({
                userId,
                socketId: socket.id,
            });
        }
        console.log(`User connected - Users: ${JSON.stringify(activeUsers, undefined, 2)}`);
        io.emit('get-users', activeUsers);
    });


    socket.on('disconnect', () => {
        activeUsers = activeUsers.filter(user => user.socketId !== socket.id);
        console.log(`User disconnected - Users: ${JSON.stringify(activeUsers, undefined, 2)}`);
        io.emit('get-users', activeUsers);
    });
});

io.listen(8000);
