import { Pressable, StyleSheet, Text, View } from 'react-native';

export function CreateIcon({ label, color, textColor = '#fff' }: { label: string; color: string; textColor?: string }) {
  return (
    <View style={[styles.iconCircle, { backgroundColor: color }]}>
      <Text style={[styles.iconText, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  iconText: {
    fontSize: 18,
    fontWeight: '700',
  },
});
