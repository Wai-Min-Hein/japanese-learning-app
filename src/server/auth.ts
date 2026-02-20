export type GuestProfile = {
  id: string;
  name: string;
  nativeLanguage: 'Burmese';
  japaneseLevel: 'Absolute Beginner';
};

export function getGuestProfile(): GuestProfile {
  return {
    id: 'guest-user',
    name: 'မင်္ဂလာပါ',
    nativeLanguage: 'Burmese',
    japaneseLevel: 'Absolute Beginner',
  };
}
