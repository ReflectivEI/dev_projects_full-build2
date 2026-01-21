/**
 * Avatar Storage Utility
 * 
 * Handles avatar image storage for user profiles.
 * Images are stored as base64 in localStorage for simplicity.
 * For production, consider uploading to public/assets/avatars/ via API.
 */

export interface AvatarData {
  url: string;
  uploadedAt: string;
}

const AVATAR_STORAGE_KEY = 'user_avatar';

/**
 * Save avatar to localStorage
 * @param base64Data - Base64 encoded image data
 * @returns Avatar data object
 */
export function saveAvatar(base64Data: string): AvatarData {
  const avatarData: AvatarData = {
    url: base64Data,
    uploadedAt: new Date().toISOString(),
  };

  localStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify(avatarData));
  return avatarData;
}

/**
 * Load avatar from localStorage
 * @returns Avatar data or null if not found
 */
export function loadAvatar(): AvatarData | null {
  const stored = localStorage.getItem(AVATAR_STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as AvatarData;
  } catch (error) {
    console.error('Failed to parse avatar data:', error);
    return null;
  }
}

/**
 * Delete avatar from localStorage
 */
export function deleteAvatar(): void {
  localStorage.removeItem(AVATAR_STORAGE_KEY);
}

/**
 * Validate image file
 * @param file - File to validate
 * @returns Error message or null if valid
 */
export function validateAvatarFile(file: File): string | null {
  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return 'Please upload a valid image file (JPG, PNG, GIF, or WebP)';
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return 'Image size must be less than 5MB';
  }

  return null;
}

/**
 * Convert File to base64 string
 * @param file - File to convert
 * @returns Promise resolving to base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Get initials from name for avatar fallback
 * @param name - Full name
 * @returns Initials (max 2 characters)
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
