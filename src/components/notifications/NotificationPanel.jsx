import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatDistanceToNow } from "date-fns";
import NotificationItem from "./NotificationItem";

export default function NotificationPanel({ setUnreadCount }) {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("notifications")
        .select(
          `
          id,
          type,
          is_read,
          created_at,
          post_id,
          triggerUser:triggering_user_id (
            id,
            username,
            avatar_url
          )
        `
        )
        .eq("recipient_user_id", userData.user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]);
      } else if (data) {
        const formattedNotifications = data.map((n) => ({
          id: n.id,
          type: n.type,
          isRead: n.is_read,
          // Map Supabase columns to component props
          triggerUser: {
            id: n.triggerUser.id,
            name: n.triggerUser.username, // Use username for the name
            avatar: n.triggerUser.avatar_url, // Use avatar_url for the avatar
          },
          // Use post_id to build the link, or profile link as a fallback
          postLink: n.post_id ? `/post/${n.post_id}` : `/profile/${n.triggerUser.id}`,
          // Format the timestamp into a "time ago" string
          time: formatDistanceToNow(new Date(n.created_at), {
            addSuffix: true,
          }),
        }));
        setNotifications(formattedNotifications);

        // After fetching, mark the unread ones as read
        markAsRead(data);
      }
      setIsLoading(false);
    };

    // This function marks newly fetched unread notifications as read in the DB
    const markAsRead = async (fetchedNotifications) => {
      const unreadIds = fetchedNotifications.filter((n) => !n.is_read).map((n) => n.id);

      if (unreadIds.length > 0) {
        await supabase.from("notifications").update({ is_read: true }).in("id", unreadIds);
      }
    };

    fetchNotifications();
  }, [supabase]);

  // ADD THIS handler for the "Mark all as read" button
  const handleMarkAllAsRead = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Update all of this user's notifications to be read
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("recipient_user_id", user.id)
      .eq("is_read", false); // Only update unread ones

    if (!error) {
      // Update the local state to reflect the change immediately
      setNotifications((current) => current.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0); // Update the bell's count
    } else {
      console.error("Error marking all as read:", error);
    }
  };

  return (
    <div className="absolute top-full right-[-50px] md:right-0 mt-3 w-[330px] md:w-[400px] bg-dark-secondary border border-[color:var(--accent)]/30 rounded-lg shadow-2xl z-50">
      <div className="p-3 border-b border-dark-border">
        <h3 className="font-semibold text-light">Notifications</h3>
      </div>
      <div className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-dark-border scrollbar-track-transparent hover:scrollbar-thumb-gray-500 p-2">
        {/* MODIFY THIS: Use the real data and handle loading/empty states */}
        {isLoading ? (
          <p className="text-center text-light-secondary p-8">Loading...</p>
        ) : notifications.length > 0 ? (
          notifications.map((notif) => <NotificationItem key={notif.id} notification={notif} />)
        ) : (
          <p className="text-center text-light-secondary p-8">You have no new notifications.</p>
        )}
      </div>
      <div className="p-2 border-t border-dark-border text-center">
        {/* MODIFY THIS: Wire up the button */}
        <button
          onClick={handleMarkAllAsRead}
          className="text-sm text-accent hover:underline"
          disabled={notifications.every((n) => n.isRead)} // Optional: disable if all are read
        >
          Mark all as read
        </button>
      </div>
    </div>
  );
}
