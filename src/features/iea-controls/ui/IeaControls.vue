<template>
  <section class="section">
    <h2>IEA - Графики</h2>
    <div class="buttons">
      <a-button @click="run(discoverCharts)" :loading="loading">Найти графики на первой странице</a-button>
      <a-button @click="run(downloadNewCharts)" :loading="loading">Скачать новые</a-button>
      <a-button @click="run(sendNewCharts)" :loading="loading">Отправить непросланные по одному</a-button>
      <a-button @click="emit('changed')" :loading="loading">Обновить список</a-button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { discoverCharts, downloadNewCharts, sendNewCharts } from '@/entities/charts'
import { getErrorMessage } from '@/shared/api'
import { message } from 'ant-design-vue'

const emit = defineEmits(['changed'])
const loading = ref(false)

async function run(action: () => Promise<unknown>) {
  loading.value = true
  try {
    await action()
    message.success('Готово')
    emit('changed')
  } catch (error) {
    message.error({ content: getErrorMessage(error), duration: 6 })
  } finally {
    loading.value = false
  }
}
</script>
