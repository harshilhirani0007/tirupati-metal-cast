import { useEffect, useState } from 'react';
import { API_BASE } from '../context/AuthContext';

interface Settings {
  company_name?: string;
  tagline?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  founded?: string;
  capacity?: string;
  clients_served?: string;
  delivery_rate?: string;
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/settings`)
      .then(r => r.json())
      .then(setSettings)
      .catch(() => setSettings({}))
      .finally(() => setLoading(false));
  }, []);

  return { settings, loading };
}
