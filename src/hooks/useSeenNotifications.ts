import { useState, useEffect } from 'react';

interface SeenNotifications {
  emergencies: string[];
  packages: string[];
  visitors: string[];
  invoices: string[];
  insurance: string[];
}

const STORAGE_KEY = 'altos-de-videma-seen-notifications';

const getInitialSeenNotifications = (): SeenNotifications => {
  const defaultNotifications: SeenNotifications = {
    emergencies: [],
    packages: [],
    visitors: [],
    invoices: [],
    insurance: []
  };

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to ensure all properties exist
      return {
        ...defaultNotifications,
        ...parsed
      };
    }
  } catch (error) {
    console.warn('Error loading seen notifications:', error);
  }

  return defaultNotifications;
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
      visitors: [],
      invoices: [],
      insurance: []
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