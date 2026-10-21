export type Shortcut = {
  id: string;
  label: string;
  url: string;
  color: string;
  icon: string;
  textColor?: string;
};

export const shortcuts: Shortcut[] = [
  { id: 'google', label: 'Google', url: 'https://www.google.com', color: '#f2f2f2', icon: 'G', textColor: '#111827' },
  { id: 'youtube', label: 'YouTube', url: 'https://www.youtube.com', color: '#ef4444', icon: '▶', textColor: '#ffffff' },
  { id: 'facebook', label: 'Facebook', url: 'https://www.facebook.com', color: '#2563eb', icon: 'f', textColor: '#ffffff' },
  { id: 'wikipedia', label: 'Wikipedia', url: 'https://www.wikipedia.org', color: '#eff6ff', icon: 'W', textColor: '#111827' },
  { id: 'yandex', label: 'Yandex', url: 'https://www.yandex.com', color: '#facc15', icon: 'Y', textColor: '#111827' },
  { id: 'x', label: 'X', url: 'https://x.com', color: '#0f172a', icon: 'X', textColor: '#ffffff' },
  { id: 'instagram', label: 'Instagram', url: 'https://www.instagram.com', color: '#f472b6', icon: '◎', textColor: '#ffffff' },
  { id: 'reddit', label: 'Reddit', url: 'https://www.reddit.com', color: '#f97316', icon: 'R', textColor: '#ffffff' },
];
