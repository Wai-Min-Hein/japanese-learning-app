import { View, Text } from 'react-native';

type BarChartProps = {
  values: number[];
};

export default function BarChartWeb({ values }: BarChartProps) {
  const max = Math.max(...values, 1);

  return (
    <View className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <Text className="mb-3 text-sm font-medium text-slate-700">Weekly Study Minutes (Web)</Text>
      <View className="flex-row items-end gap-3">
        {values.map((value, index) => (
          <View key={`bar-web-${index}`} className="items-center">
            <View
              className="w-9 rounded-t-md bg-emerald-500"
              style={{ height: `${(value / max) * 120}%`, minHeight: 8 }}
            />
            <Text className="mt-1 text-xs text-slate-500">D{index + 1}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
