import { Text, View } from 'react-native';

type CellProps = {
  children: string;
  className?: string;
};

export function Cell({ children, className = '' }: CellProps) {
  return (
    <View className={`flex-1 border-b border-slate-200 p-3 ${className}`}>
      <Text className="text-sm text-slate-700">{children}</Text>
    </View>
  );
}
