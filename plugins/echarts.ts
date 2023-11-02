import { use, registerMap } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { MapChart, LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
  ToolboxComponent,
  GridComponent,
} from 'echarts/components'
import type { GeoJSON } from 'echarts/types/src/coord/geo/geoTypes'
import taiwanJson from '@/assets/geo/taiwan.json'

export default defineNuxtPlugin(() => {
  use([
    CanvasRenderer,
    LabelLayout,
    MapChart,
    LineChart,
    UniversalTransition,
    GridComponent,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    VisualMapComponent,
    ToolboxComponent,
  ])

  registerMap('taiwan', taiwanJson as GeoJSON)
})
