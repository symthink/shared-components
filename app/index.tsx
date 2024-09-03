// app/index.tsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import SourcesChart from '@/components/SourcesChart';
import data1 from '@/data/sources1.json';
import data2 from '@/data/sources2.json';
import data3 from '@/data/sources3.json';

export default function Index() {
    return (
        <ScrollView>
            <SourcesChart data={data1} />
            <SourcesChart data={data2} />
            <SourcesChart data={data3} />
        </ScrollView>
    );
}
