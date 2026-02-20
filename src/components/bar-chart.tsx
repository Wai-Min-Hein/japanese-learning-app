import { View, Text } from 'react-native';

type BarChartProps = {
  values: number[];
};

export default function BarChart({ values }: BarChartProps) {
  const max = Math.max(...values, 1);

  return (
    <View className="rounded-xl bg-white p-4">
      <Text className="mb-3 text-sm font-medium text-slate-700">Weekly Study Minutes</Text>
      <View className="flex-row items-end gap-2">
        {values.map((value, index) => (
          <View
            key={`bar-${index}`}
            className="w-8 rounded-t-md bg-sakura-500"
            style={{ height: `${(value / max) * 120}%`, minHeight: 8 }}
          />
        ))}
      </View>
    </View>
  );
}
