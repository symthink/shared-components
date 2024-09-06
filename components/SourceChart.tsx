import { View, Text, StyleSheet } from 'react-native';
import React, { useState } from 'react'
import { G, Rect, Text as SvgText } from 'react-native-svg';
import PieChart, { PieSection} from './PieChart';

type RGB = { r: number; g: number; b: number };
type Color = string;

function generateGradientSeries(
  steps: number,
  startColor: RGB = { r: 0, g: 66, b: 0 }, // Start with a deep blue
  endColor: RGB = { r: 197, g: 252, b: 69 } // End with a light blue
): Color[] {
  const colors: Color[] = [];
  
  for (let i = 0; i < steps; i++) {
    const r = Math.round(startColor.r + ((endColor.r - startColor.r) * i) / (steps - 1));
    const g = Math.round(startColor.g + ((endColor.g - startColor.g) * i) / (steps - 1));
    const b = Math.round(startColor.b + ((endColor.b - startColor.b) * i) / (steps - 1));

    const hex = rgbToHex(r, g, b);
    colors.push(hex);
  }

  return colors;
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;
}


type PieSectionDetail = PieSection & {
    details?: Record<string, number>;
}
type SourcesChartProps = {
    data: PieSectionDetail[];
}
export default function SourceChart({ data }: SourcesChartProps) {
    const [currentItem, setCurrentItem] = useState<PieSectionDetail>();

    const colors = generateGradientSeries(data.length);

    const appendItemValues = (data: PieSectionDetail[]) => {
        const totalValue = data.reduce((acc, item) => acc + item.value, 0);
        let accumulatedPercentage = 0;
        let gotFocused = false;
        return data.map(item => {
            const percentage = ((item.value / totalValue) * 100);
            accumulatedPercentage += percentage;
            item.color = colors.pop();
            item.id = item.color || (new Date()).getTime().toString();
            item.percent = percentage.toFixed(1) + '%';
            // item.onPress=(item: pieDataItem, index: number) => console.log(item.value.toString() ) ;
            if (!gotFocused && item.value === Math.max(...data.map(item => item.value))) {
                gotFocused = true;
                // item.focused = true;
                if (!currentItem || currentItem.text !== item.text) {
                    setCurrentItem(item);
                }
            }
            return item;
        });
    };

    data.sort((a, b) => b.value - a.value);
    data = appendItemValues(data);
    return (
        <View style={styles.container}>
            <PieChart
                widthAndHeight={275}
                series={data}
                coverFill={'white'}
                coverRadius={0.6}
                onSectionPress={(section) => setCurrentItem(section)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    }
});