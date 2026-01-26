'use client';

import { useEffect, useState, useRef } from 'react';
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Initialize audio for notification sound
  useEffect(() => {
    let audioContext: AudioContext | null = null;
    
    // Function to play notification sound
    const playNotificationSound = async () => {
      try {
        // Create or resume audio context (browsers require user interaction first)
        if (!audioContext) {
          audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        }
        
        // Resume context if suspended (required after user interaction)
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Create a pleasant notification sound (two-tone chime)
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } catch (error) {
        console.error('Error playing notification sound:', error);
      }
    };

    // Store play function for use in notifications
    (window as unknown as { playNotificationSound: () => void }).playNotificationSound = playNotificationSound;

    // Initialize audio context on first user interaction
    const initAudio = async () => {
      if (!audioContext) {
        audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        // Play silent sound to unlock audio context
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.001);
      }
    };

    // Try to initialize on any user interaction
    const events = ['click', 'keydown', 'touchstart'];
    events.forEach((event) => {
      document.addEventListener(event, initAudio, { once: true });
    });

    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

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
              const playSound = (window as unknown as { playNotificationSound?: () => void }).playNotificationSound;
              if (playSound) {
                playSound();
              }
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
  }, []);

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
      <div className={`${styles.statusIndicator} ${isConnected ? styles.connected : styles.disconnected}`}>
        <span className={styles.statusDot}></span>
        <span className={styles.statusText}>
          {isConnected ? 'Live' : 'Connecting...'}
        </span>
      </div>

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
