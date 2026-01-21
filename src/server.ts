import "dotenv/config";
import { Server as HttpServer } from 'http';
import { Socket, Server as SocketIOServer } from 'socket.io';
import app from './app';
import { prisma } from "./app/shared/prisma";
import config from './config';


async function bootstrap() {
    // This variable will hold our server instance
    let server: HttpServer;

    try {
        // Start the server
        server = app.listen(config.port, () => {
            console.log(`🚀 Server is running on http://localhost:${config.port}`);
        });

        const io = new SocketIOServer(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        io.on("connection", (socket: Socket) => {
            console.log("Client connected", socket.id);

            socket.on("join_room", (room: string) => {
                socket.join(room); // room = appointmentId
                console.log(`User ${socket.id} joined room ${room}`);
            });

            socket.on("send_message", async (data: any) => {
                console.log("Message received:", data);
                // data: { senderId, receiverId, appointmentId, message }

                try {
                    await prisma.chatMessage.create({
                        data: {
                            senderId: data.senderId,
                            receiverId: data.receiverId,
                            appointmentId: data.appointmentId,
                            message: data.message
                        }
                    });

                    // Emit to everyone in the room including sender (or use broadcast to exclude sender)
                    io.to(data.appointmentId).emit("receive_message", data);
                } catch (error) {
                    console.error("Error saving message:", error);
                }
            });

            socket.on("disconnect", () => {
                console.log("Client disconnected");
            });
        });

        // Function to gracefully shut down the server
        const exitHandler = () => {
            if (server) {
                server.close(() => {
                    console.log('Server closed gracefully.');
                    process.exit(1); // Exit with a failure code
                });
            } else {
                process.exit(1);
            }
        };

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (error) => {
            console.log('Unhandled Rejection is detected, we are closing our server...');
            if (server) {
                server.close(() => {
                    console.log(error);
                    process.exit(1);
                });
            } else {
                process.exit(1);
            }
        });
    } catch (error) {
        console.error('Error during server startup:', error);
        process.exit(1);
    }
}

bootstrap();