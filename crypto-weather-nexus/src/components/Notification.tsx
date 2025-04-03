import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store"; // ✅ Import RootState for TypeScript safety

const MAX_NOTIFICATIONS = 5; // ✅ Limit the number of notifications

const Notification = () => {
  const livePrices = useSelector((state: RootState) => state.websocket?.livePrices || {});
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    const newNotifications = Object.keys(livePrices).map(
      (id) => `${id.toUpperCase()} updated: $${livePrices[id]?.usd?.toFixed(2) || "N/A"}`
    );

    setNotifications((prev) => {
      const updatedNotifications = [...newNotifications, ...prev].slice(0, MAX_NOTIFICATIONS);
      return updatedNotifications;
    });
  }, [livePrices]);

  return (
    <div className="fixed top-5 right-5 bg-gray-900 text-white p-4 rounded shadow-lg w-64">
      {notifications.length > 0 ? (
        notifications.map((note, index) => (
          <p key={index} className="text-sm mb-1 animate-fade-in">
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
