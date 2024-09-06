import { StyleProp, ViewStyle } from 'react-native'
import { Svg, G, Path } from 'react-native-svg'
import * as d3 from 'd3-shape'
import { useState } from 'react';

export type PieSection = {
  id?: string; // use for onPress if exists
  value: number;
  color?: string;
  text?: string;
  percent?: string;
}

export type PieChartProps = {
  widthAndHeight: number
  series: PieSection[]
  coverFill?: string | null
  coverRadius?: number
  onSectionPress?: (section: PieSection) => void
  style?: StyleProp<ViewStyle>
}

const PieChart = ({
  widthAndHeight,
  series,
  coverFill = null,
  coverRadius,
  onSectionPress,
  style = {},
}: PieChartProps): JSX.Element => {
  const [selectedSection, setSelectedSection] = useState<PieSection>();

  // Validating props
  series.forEach((s) => {
    if (typeof s.value !== 'number') {
      throw Error(`Invalid series: 'value' property should be a number. Found ${s.value}`)
    }
    if (s.value < 0) {
      throw Error(`Invalid series: all numbers should be positive. Found ${s.value}`)
    }
    if (!s.color) {
      throw Error(`Invalid series: 'color' property should exist for each item in the series. ID: ${s.id}: color='${s.color}'`)
    }
    if (!s.id) {
      throw Error(`Invalid series: 'id' property should exist for each item in the series.`)
    }
  })

  const sum = series.reduce((previous, current) => previous + current.value, 0)
  if (sum <= 0) {
    throw Error('Invalid series: sum of series is zero')
  }

  if (coverRadius && (coverRadius < 0 || coverRadius > 1)) {
    throw Error(`Invalid "coverRadius": It should be between zero and one. But it's ${coverRadius}`)
  }

  const max = Math.max(...series.map((s) => s.value))
  const maxItem = series.find((s) => s.value === max)
  if (!maxItem) {
    throw Error('Invalid series: maxItem not found')
  }
  if (!selectedSection) {
    setSelectedSection(maxItem);
  }
  const radius = widthAndHeight / 2
  const pieGenerator = d3.pie().sort(null)
  const arcs = pieGenerator(series.map((s) => s.value))
  const extraBerth = 20;
  const svgWH = widthAndHeight + extraBerth;
  const tranWH = (svgWH / 2);
  const onSectionPressHandler = (section: PieSection) => {
    setSelectedSection(section)
    if (onSectionPress) {
      onSectionPress(section)
    }
  }
  return (
    <Svg style={style} width={svgWH} height={svgWH}
      viewBox={`0 0 ${svgWH} ${svgWH}`}>
      <G transform={`translate(${tranWH}, ${tranWH})`}>
        {arcs.map((arc: any, i: number) => {
          const pieSection = series[i];
          const outerRadius = selectedSection?.id === pieSection.id ? radius + 10 : radius;
          let arcGenerator = d3.arc().outerRadius(outerRadius).startAngle(arc.startAngle).endAngle(arc.endAngle)

          // When 'coverFill' is also provided, instead of setting the
          // 'innerRadius', we draw a circle in the middle. See the 'Path'
          // after the 'map'.
          if (!coverRadius) {
            arcGenerator = arcGenerator.innerRadius(0)
          } else {
            arcGenerator = arcGenerator.innerRadius(coverRadius * radius)
          }

          // TODO: Pad: "stroke": "black, "stroke-width": "2px"
          //       OR: use padAngle
          return <Path key={arc.index} onPress={() => onSectionPressHandler(pieSection)}
            fill={pieSection.color}
            d={arcGenerator(arc) as string} />
        })}

        {coverRadius && coverRadius > 0 && coverFill && (
          <>
            <Path
              key='cover'
              fill={coverFill}
              stroke={selectedSection?.color}
              strokeWidth={5}
              d={d3
                .arc<any, any>() // Add the type arguments for the `d` and `i` parameters
                .outerRadius(coverRadius * radius)
                .innerRadius(0)
                .startAngle(0)
                .endAngle(360)(null, 0) as string} // Pass `null` as the first argument and `0` as the second argument
            />
            <text x="0" y="0" font-size="20" fontFamily='sans-serif' text-anchor="middle" dominant-baseline="middle" fill="black">
              {selectedSection?.text}
            </text>
            <text x="0" y="40" font-size="20" fontFamily='sans-serif' text-anchor="middle" dominant-baseline="middle" fill="black">
              {selectedSection?.percent}
            </text>
          </>
        )}
      </G>
    </Svg>
  )
}

export default PieChart
