import { View, Text, StyleSheet } from 'react-native';
import React, { useState } from 'react'
import { PieChart, pieDataItem } from "react-native-gifted-charts";
import { G, Rect, Text as SvgText } from 'react-native-svg';



export type PieSection = pieDataItem & {
    percent?: string;
    labelLeft?: boolean;
}

type SourcesChartProps = {
    data: PieSection[];
}
export default function SourcesChart({ data }: SourcesChartProps) {
    const [currentItem, setCurrentItem] = useState<PieSection>();

    const colors = [
        '#FF6F61', // Bright Coral
        '#6B5B95', // Deep Lavender
        '#88B04B', // Vivid Green
        '#F7CAC9', // Soft Pink
        '#92A8D1', // Sky Blue
        '#955251', // Rich Red-Brown
        '#B565A7', // Vibrant Orchid
        '#009B77', // Teal
        '#DD4124', // Fiery Orange
        '#45B8AC'  // Aqua Green
    ];

    const appendItemValues = (data: PieSection[]) => {
        const totalValue = data.reduce((acc, item) => acc + item.value, 0);
        let accumulatedPercentage = 0;
        let gotFocused = false;
        return data.map(item => {
            const percentage = ((item.value / totalValue) * 100);
            accumulatedPercentage += percentage;
            item.color = colors.pop() || undefined;
            item.percent = percentage.toFixed(1) + '%';
            item.labelLeft = accumulatedPercentage > 50;
            // not working
            item.onPress=(item: pieDataItem, index: number) => console.log(item.value.toString() ) ;
            item.onLabelPress=(item: pieDataItem, index: number) => console.log(item.value.toString() ) ;
            // *************
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

    data = appendItemValues(data);
    return (
        <View style={styles.container}>
            <PieChart
                data={data}
                showExternalLabels
                paddingHorizontal={10}
                externalLabelComponent={(item) => {
                    const itm = item as PieSection;
                    const shiftX = itm.labelLeft ? 90 : -40;
                    return <G onResponderGrant={(evt) => console.log('evt', evt)}>
                        <Rect
                            x={itm.labelLeft ? shiftX : shiftX - 5}
                            y={-15}
                            width={(item?.text?.length ?? 0) * 8}
                            height={20}
                            fill={'white'}
                        />
                        <SvgText x={shiftX} fontSize={14} fontWeight={'bold'} fontFamily="Arial">
                            {item?.text}
                        </SvgText>
                    </G>
                }}
                extraRadius={150}
                labelLineConfig={{
                    labelComponentWidth: 150,
                    length: 70,
                }}
                donut
                radius={90}
                innerRadius={60}
                // Not working either
                focusOnPress
                onPress={ (item: pieDataItem, index: number) => console.log(item.value.toString() ) }
                onLabelPress={ (item: pieDataItem, index: number) => console.log(item.value.toString() ) }
                // *************                
                centerLabelComponent={() => (
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text
                            style={{ fontSize: 22, fontWeight: 'bold' }}>
                            {currentItem?.percent}
                        </Text>
                        <Text style={{ fontSize: 14, textAlign: 'center' }}>{currentItem?.text}</Text>
                    </View>
                )}
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