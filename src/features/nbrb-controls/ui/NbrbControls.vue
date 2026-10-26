<template>
  <section class="section">
    <h2>НБРБ - Управление</h2>
    <div class="buttons">
      <a-button @click="run(syncCurrencies)" :loading="loading">Синхронизировать справочник</a-button>
      <a-button @click="run(() => loadHistory({}))" :loading="loading">Загрузить историю</a-button>
      <a-button @click="run(updateToday)" :loading="loading">Обновить курсы на сегодня</a-button>
      <a-button type="primary" @click="run(reportAndSend)" :loading="loading">Сформировать Excel и отправить</a-button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { syncCurrencies, loadHistory, updateToday, reportAndSend } from '@/entities/rates'
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
