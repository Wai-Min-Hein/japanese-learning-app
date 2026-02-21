import { View } from 'react-native';

import { Cell } from './cell';

type SimpleTableProps = {
  rows: { left: string; right: string }[];
};

export function SimpleTable({ rows }: SimpleTableProps) {
  return (
    <View className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      {rows.map((row, index) => (
        <View key={`row-${index}`} className="flex-row">
          <Cell className="bg-slate-50 dark:bg-slate-800">{row.left}</Cell>
          <Cell>{row.right}</Cell>
        </View>
      ))}
    </View>
  );
}
