import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, X, CheckCircle2, AlertTriangle, Info, Calendar } from "lucide-react";
import { mockNotifications } from "../mock/data";

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "info":
      default:
        return <Info className="w-5 h-5 text-accent-cyan" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-300"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-border flex items-center justify-between bg-background/50">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-accent-purple/20 text-accent-purple text-xs font-medium px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              <AnimatePresence initial={false}>
                {notifications.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-8 text-center flex flex-col items-center justify-center text-muted-foreground"
                  >
                    <Bell className="w-8 h-8 mb-3 opacity-20" />
                    <p className="text-sm">You're all caught up!</p>
                  </motion.div>
                ) : (
                  notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, scaleY: 0, transformOrigin: "top" }}
                      className={`relative p-4 border-b border-border/50 hover:bg-muted/50 transition-colors group ${
                        !notification.read ? "bg-accent-purple/5" : ""
                      }`}
                      onMouseEnter={() => {
                        if (!notification.read) markAsRead(notification.id);
                      }}
                    >
                      {!notification.read && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-purple rounded-r-full" />
                      )}
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className={`text-sm font-medium truncate ${!notification.read ? "text-foreground" : "text-foreground/80"}`}>
                              {notification.title}
                            </h4>
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                              {formatTimeAgo(notification.date)}
                            </span>
                          </div>
                          <p className={`text-xs leading-relaxed ${!notification.read ? "text-muted-foreground" : "text-muted-foreground/70"}`}>
                            {notification.message}
                          </p>
                          {notification.type === "warning" && (
                            <div className="mt-2 flex items-center gap-1 text-[10px] font-medium text-amber-500 bg-amber-500/10 w-fit px-2 py-1 rounded-md">
                              <Calendar className="w-3 h-3" /> Due Soon
                            </div>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissNotification(notification.id);
                          }}
                          className="flex-shrink-0 text-muted-foreground/50 hover:text-foreground opacity-0 group-hover:opacity-100 transition-all p-1 rounded-md hover:bg-background"
                          aria-label="Dismiss notification"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
            {notifications.length > 0 && (
              <div className="p-3 border-t border-border bg-background/50 text-center">
                <button className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                  View All Activity
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
