import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store"; // ✅ Import RootState for type safety

const MAX_NOTIFICATIONS = 5;
const AUTO_DISMISS_DELAY = 4000; // 4 seconds

const Notification = () => {
  const livePrices = useSelector((state: RootState) => state.websocket?.livePrices || {});
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    const newNotifications = Object.keys(livePrices).map(
      (id) => `📈 ${id.toUpperCase()} updated: $${livePrices[id]?.usd?.toFixed(2) || "N/A"}`
    );

    if (newNotifications.length > 0) {
      setNotifications((prev) => {
        const updated = [...newNotifications, ...prev];
        return updated.slice(0, MAX_NOTIFICATIONS);
      });
    }
  }, [livePrices]);

  // Auto-dismiss oldest notification every 4 seconds
  useEffect(() => {
    if (notifications.length === 0) return;

    const timeout = setTimeout(() => {
      setNotifications((prev) => prev.slice(0, -1)); // Remove the oldest
    }, AUTO_DISMISS_DELAY);

    return () => clearTimeout(timeout);
  }, [notifications]);

  return (
    <div className="fixed top-5 right-5 w-64 max-h-60 overflow-y-auto bg-gray-900 text-white p-4 rounded-lg shadow-lg z-50">
      {notifications.length > 0 ? (
        notifications.map((note, index) => (
          <p key={index} className="text-sm mb-2 flex items-center gap-2 animate-fade-in">
            {note}
          </p>
        ))
      ) : (
        <p className="text-sm text-gray-400">No new updates</p>
      )}
    </div>
  );
};

export default Notification;
