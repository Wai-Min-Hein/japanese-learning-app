import { useColorScheme } from 'react-native';

export function useTheme() {
  const colorScheme = useColorScheme();
  return {
    colorScheme,
    isDark: colorScheme === 'dark',
  };
}
