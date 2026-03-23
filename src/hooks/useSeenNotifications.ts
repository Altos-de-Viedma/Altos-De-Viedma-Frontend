import { useState, useEffect } from 'react';

interface SeenNotifications {
  emergencies: string[];
  packages: string[];
  visitors: string[];
}

const STORAGE_KEY = 'altos-de-videma-seen-notifications';

const getInitialSeenNotifications = (): SeenNotifications => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Error loading seen notifications:', error);
  }

  return {
    emergencies: [],
    packages: [],
    visitors: []
  };
};

export const useSeenNotifications = () => {
  const [seenNotifications, setSeenNotifications] = useState<SeenNotifications>(getInitialSeenNotifications);

  // Save to localStorage whenever seenNotifications changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seenNotifications));
    } catch (error) {
      console.warn('Error saving seen notifications:', error);
    }
  }, [seenNotifications]);

  const markAsSeen = (type: keyof SeenNotifications, id: string) => {
    setSeenNotifications(prev => ({
      ...prev,
      [type]: [...prev[type].filter(existingId => existingId !== id), id]
    }));
  };

  const markAsUnseen = (type: keyof SeenNotifications, id: string) => {
    setSeenNotifications(prev => ({
      ...prev,
      [type]: prev[type].filter(existingId => existingId !== id)
    }));
  };

  const isNotificationSeen = (type: keyof SeenNotifications, id: string): boolean => {
    return seenNotifications[type].includes(id);
  };

  const clearAllSeen = () => {
    setSeenNotifications({
      emergencies: [],
      packages: [],
      visitors: []
    });
  };

  const clearSeenByType = (type: keyof SeenNotifications) => {
    setSeenNotifications(prev => ({
      ...prev,
      [type]: []
    }));
  };

  return {
    seenNotifications,
    markAsSeen,
    markAsUnseen,
    isNotificationSeen,
    clearAllSeen,
    clearSeenByType
  };
};