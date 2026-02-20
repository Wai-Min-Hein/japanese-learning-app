import { Pressable, Text } from 'react-native';

type AppButtonProps = {
  title: string;
  onPress?: () => void;
};

export function AppButton({ title, onPress }: AppButtonProps) {
  return (
    <Pressable className="rounded-xl bg-sakura-700 px-4 py-3" onPress={onPress}>
      <Text className="text-center text-base font-semibold text-white">{title}</Text>
    </Pressable>
  );
}
