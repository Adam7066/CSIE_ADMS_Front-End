import { use, registerMap } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LabelLayout } from 'echarts/features'
import { MapChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
  ToolboxComponent,
} from 'echarts/components'
import type { GeoJSON } from 'echarts/types/src/coord/geo/geoTypes'
import taiwanJson from '@/assets/geo/taiwan.json'

export default defineNuxtPlugin(() => {
  use([
    CanvasRenderer,
    LabelLayout,
    MapChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    VisualMapComponent,
    ToolboxComponent,
  ])

  registerMap('taiwan', taiwanJson as GeoJSON)
})
