<template>
  <div class="h-full w-full">
    <ClientOnly>
      <div class="bg-blue-50 px-8 py-12">
        <div class="flex flex-col items-center justify-center">
          <div class="flex w-full flex-row content-start justify-between">
            <div class="m-2 min-h-[768px] w-1/6 rounded-md border-2 border-gray-300 bg-pink-50 p-4">
              <div class="flex h-full flex-col items-center justify-start bg-purple-200 px-2">
                <div class="w-full bg-gray-50">
                  <t-dropdown :options="SiJi" trigger="click">
                    <t-space>
                      <t-button variant="text">
                        系級
                        <template #suffix> <t-icon name="chevron-down" size="16" /></template>
                      </t-button>
                    </t-space>
                  </t-dropdown>
                </div>
                <div class="m-2">顯示圖的選項</div>
                <div></div>
              </div>
            </div>
            <div
              class="m-2 min-h-[768px] w-1/2 rounded-md border-2 border-gray-300 bg-green-50 p-4"
            >
              <div class="text-center">圖表顯示</div>
            </div>
            <div
              class="m-2 min-h-[768px] w-1/3 rounded-md border-2 border-gray-300 bg-yellow-50 p-4"
            >
              <div class="text-center">圖表數據顯示</div>
            </div>
          </div>
          <!-- <div class="m-2 bg-pink-50 min-h-[768px] w-auto rounded-md border-2 border-gray-300 p-4">
                        <t-table>

                        </t-table>
                      </div> -->
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const SiJi = ref([
  { content: '107級', value: '107' },
  { content: '108級', value: '108' },
  { content: '109級', value: '109' },
  { content: '110級', value: '110' },
])
</script>
