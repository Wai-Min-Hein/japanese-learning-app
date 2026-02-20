import { View } from 'react-native';

import { Cell } from './cell';

type SimpleTableProps = {
  rows: { left: string; right: string }[];
};

export function SimpleTable({ rows }: SimpleTableProps) {
  return (
    <View className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {rows.map((row, index) => (
        <View key={`row-${index}`} className="flex-row">
          <Cell className="bg-slate-50">{row.left}</Cell>
          <Cell>{row.right}</Cell>
        </View>
      ))}
    </View>
  );
}
