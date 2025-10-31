import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import { useUserId } from "./useUserId";
import { 
  addNotification, 
  connectSocketSuccess,
  connectSocketFailure,
  disconnectSocket
} from "@/app/redux/reducers/notification/notificationReducer";
import { socketConnectionSelector } from "@/app/redux/reducers/notification/selectors/notificationSelector";
import { INotification, NotificationType, NotificationPriority, NotificationChannel, NotificationStatus } from "@/app/redux/types/notification";

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

export interface SocketNotification {
  id?: string;
  _id?: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  priority?: string;
  channel?: string;
  status?: string;
  recipientId?: string;
  readBy?: string[];
  createdAt?: string;
  updatedAt?: string;
  sentAt?: string;
  userId?: string;
}

// useSocketNotifications.ts
export const useSocketNotifications = () => {
  const dispatch = useDispatch();
  const { userId } = useUserId();
  const isConnected = useSelector(socketConnectionSelector);

  useEffect(() => {
    if (!userId) {
      dispatch(disconnectSocket());
      return;
    }

    console.log("🔌 Initializing socket connection for user:", userId);

    const socket: Socket = io(SOCKET_SERVER_URL, {
      query: { userId },
      transports: ["websocket"],
      autoConnect: true,
    });

    socket.on("connect", () => {
      console.log("✅ Connected to socket server", socket.id);
      dispatch(connectSocketSuccess());
    });

    socket.on("notification", (notification: SocketNotification) => {
      console.log("🔔 Received notification:", notification);
      
      // Map socket notification to INotification format
      const mappedNotification: INotification = {
        id: notification.id || notification._id || "",
        _id: notification._id || notification.id || "",
        type: notification.type as NotificationType || NotificationType.SYSTEM_UPDATE,
        title: notification.title,
        message: notification.message,
        data: notification.data || {},
        priority: (notification.priority as NotificationPriority) || NotificationPriority.MEDIUM,
        channel: (notification.channel as NotificationChannel) || NotificationChannel.IN_APP,
        status: (notification.status as NotificationStatus) || NotificationStatus.PENDING,
        recipientId: notification.recipientId || userId || "",
        readBy: notification.readBy || [],
        retryCount: 0,
        maxRetries: 3,
        createdAt: notification.createdAt || new Date().toISOString(),
        updatedAt: notification.updatedAt || new Date().toISOString(),
        sentAt: notification.sentAt || new Date().toISOString(),
        __v: 0,
        isRead: false,
      };
      
      // Add notification to Redux store
      dispatch(addNotification(mappedNotification));
    });

    socket.on("disconnect", (reason) => {
      console.log("⚠️ Disconnected from socket server:", reason);
      dispatch(disconnectSocket());
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
      dispatch(connectSocketFailure(error.message || "Connection failed"));
    });

    // Cleanup on unmount
    return () => {
      console.log("🧹 Cleaning up socket connection");
      socket.disconnect();
      dispatch(disconnectSocket());
    };
  }, [dispatch, userId]);

  return {
    isConnected,
    userId,
  };
};
