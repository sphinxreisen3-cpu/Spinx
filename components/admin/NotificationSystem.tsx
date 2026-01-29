'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import styles from '@/styles/components/admin/NotificationSystem.module.css';

interface Notification {
  id: string;
  type: 'booking' | 'review' | 'connected';
  data?: unknown;
  message?: string;
  timestamp: number;
}

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isSoundReady, setIsSoundReady] = useState(false);
  const [isSoundBlocked, setIsSoundBlocked] = useState(false);
  const soundPoolRef = useRef<HTMLAudioElement[]>([]);
  const soundIndexRef = useRef(0);
  const eventSourceRef = useRef<EventSource | null>(null);

  const enableSound = useCallback((playSample: boolean) => {
    const pool = soundPoolRef.current;
    if (!pool.length) return;
    const audio = pool[0];

    const run = async () => {
      if (playSample) {
        audio.muted = false;
        audio.pause();
        audio.currentTime = 0;
        await audio.play();
        setIsSoundReady(true);
        setIsSoundBlocked(false);
        return;
      }

      audio.muted = true;
      await audio.play();
      audio.pause();
      audio.currentTime = 0;
      audio.muted = false;
      setIsSoundReady(true);
      setIsSoundBlocked(false);
    };

    run().catch((error) => {
      console.error('Error enabling notification sound:', error);
      setIsSoundBlocked(true);
    });
  }, []);

  const playNotificationSound = useCallback(() => {
    const pool = soundPoolRef.current;
    if (!pool.length) return;
    const index = soundIndexRef.current % pool.length;
    soundIndexRef.current += 1;
    const audio = pool[index];

    try {
      audio.pause();
      audio.currentTime = 0;
      const playPromise = audio.play();
      if (playPromise) {
        playPromise.catch((error) => {
          console.error('Error playing notification sound:', error);
          setIsSoundBlocked(true);
        });
      }
    } catch (error) {
      console.error('Error playing notification sound:', error);
      setIsSoundBlocked(true);
    }
  }, []);

  // Initialize audio for notification sound (unlock on first user interaction)
  useEffect(() => {
    const soundSrc = '/sounds/mixkit-arabian-mystery-harp-notification-2489.wav';
    const pool = Array.from({ length: 3 }, () => {
      const audio = new Audio(soundSrc);
      audio.volume = 0.9;
      audio.preload = 'auto';
      return audio;
    });
    soundPoolRef.current = pool;

    const unlockAudio = () => enableSound(false);

    document.addEventListener('click', unlockAudio, { once: true });
    document.addEventListener('keydown', unlockAudio, { once: true });
    document.addEventListener('touchstart', unlockAudio, { once: true });

    return () => {
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
      soundPoolRef.current.forEach((audio) => {
        audio.pause();
      });
      soundPoolRef.current = [];
    };
  }, [enableSound]);

  // Connect to SSE stream
  useEffect(() => {
    const connectToNotifications = () => {
      try {
        const eventSource = new EventSource('/api/notifications');
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
          setIsConnected(true);
        };

        eventSource.onmessage = (event) => {
          try {
            const notification: Notification = JSON.parse(event.data);
            
            if (notification.type === 'connected') {
              setIsConnected(true);
              return;
            }

            // Add notification
            const newNotification: Notification = {
              ...notification,
              id: `${notification.type}-${notification.timestamp}-${Math.random()}`,
            };

            setNotifications((prev) => [newNotification, ...prev].slice(0, 10)); // Keep last 10

            // Play notification sound
            if (notification.type === 'booking' || notification.type === 'review') {
              playNotificationSound();
            }

            // Show browser notification if permission granted
            if ('Notification' in window && Notification.permission === 'granted') {
              const title = notification.type === 'booking' 
                ? 'New Booking Received!' 
                : 'New Review Submitted!';
              
              const body = notification.type === 'booking'
                ? 'A new tour booking has been received'
                : 'A new review has been submitted';

              new Notification(title, {
                body,
                icon: '/images/logo/logo.webp',
                badge: '/images/logo/logo.webp',
              });
            }
          } catch (error) {
            console.error('Error parsing notification:', error);
          }
        };

        eventSource.onerror = (error) => {
          console.error('SSE connection error:', error);
          setIsConnected(false);
          
          // Attempt to reconnect after 3 seconds
          setTimeout(() => {
            if (eventSourceRef.current) {
              eventSourceRef.current.close();
            }
            connectToNotifications();
          }, 3000);
        };
      } catch (error) {
        console.error('Error connecting to notifications:', error);
        setIsConnected(false);
      }
    };

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    connectToNotifications();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [playNotificationSound]);

  // Auto-remove notifications after 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setNotifications((prev) => {
        const now = Date.now();
        return prev.filter((notif) => now - notif.timestamp < 5000);
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getNotificationMessage = (notification: Notification): string => {
    if (notification.type === 'booking') {
      const booking = notification.data as { name?: string; tourTitle?: string };
      return `New booking from ${booking?.name || 'Customer'} for ${booking?.tourTitle || 'Tour'}`;
    }
    if (notification.type === 'review') {
      const review = notification.data as { name?: string; rating?: number };
      return `New review from ${review?.name || 'Customer'} (${review?.rating || 0} stars)`;
    }
    return notification.message || 'Notification';
  };

  const getNotificationIcon = (type: string): string => {
    if (type === 'booking') return '📅';
    if (type === 'review') return '⭐';
    return '🔔';
  };

  return (
    <div className={styles.container}>
      {/* Connection Status Indicator */}
      <div className={styles.headerRow}>
        <div className={`${styles.statusIndicator} ${isConnected ? styles.connected : styles.disconnected}`}>
          <span className={styles.statusDot}></span>
          <span className={styles.statusText}>
            {isConnected ? 'Live' : 'Connecting...'}
          </span>
        </div>

        <button
          type="button"
          className={styles.soundButton}
          onClick={() => enableSound(true)}
          title={isSoundReady ? 'Test notification sound' : 'Enable notification sound'}
        >
          {isSoundReady ? 'Test sound' : 'Enable sound'}
        </button>
      </div>

      {isSoundBlocked && (
        <div className={styles.soundHint}>
          Sound is blocked by the browser. Click &quot;Enable sound&quot; to allow it.
        </div>
      )}

      {/* Notifications List */}
      {notifications.length > 0 && (
        <div className={styles.notificationsList}>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`${styles.notification} ${styles[notification.type]}`}
            >
              <span className={styles.notificationIcon}>
                {getNotificationIcon(notification.type)}
              </span>
              <span className={styles.notificationMessage}>
                {getNotificationMessage(notification)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
