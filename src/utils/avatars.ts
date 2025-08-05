// Simple avatar colors
const colors = [
  '#1976d2', '#388e3c', '#f57c00', '#d32f2f', 
  '#7b1fa2', '#303f9f', '#c2185b', '#ff6f00'
];

// Get color for name
export const getColor = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index] || '#1976d2';
};

// Get initials
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Avatar props
export const getAvatarProps = (name: string) => {
  return {
    color: getColor(name),
    textColor: 'white',
    text: getInitials(name),
    size: '40px'
  };
}; 