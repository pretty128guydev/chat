// Simple and reliable avatar system
const avatarColors = [
  '#1976d2', // Blue
  '#388e3c', // Green
  '#f57c00', // Orange
  '#d32f2f', // Red
  '#7b1fa2', // Purple
  '#303f9f', // Indigo
  '#c2185b', // Pink
  '#ff6f00', // Deep Orange
  '#2e7d32', // Dark Green
  '#1565c0', // Dark Blue
  '#6a1b9a', // Dark Purple
  '#c62828', // Dark Red
] as const;

// Generate consistent color based on name
export const getAvatarColor = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % avatarColors.length;
  return avatarColors[index] || '#1976d2';
};

// Get initials from name
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Generate avatar props for Quasar avatar component
export const getAvatarProps = (name: string) => {
  return {
    color: getAvatarColor(name),
    textColor: 'white',
    text: getInitials(name),
    size: '40px'
  };
}; 