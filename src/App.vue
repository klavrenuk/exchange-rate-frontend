<template>
  <div class="container">
    <header>
      <h1>Exchange Rate Service</h1>
      <p>Управление загрузкой курсов НБРБ и графиков IEA</p>
    </header>

    <div class="grid">
      <div class="card">
        <h2>Валюты</h2>
        <div class="value">{{ overview.currencies }}</div>
        <div class="label">в справочнике</div>
      </div>
      <div class="card">
        <h2>Курсы</h2>
        <div class="value">{{ overview.rates }}</div>
        <div class="label">записей</div>
      </div>
      <div class="card">
        <h2>Графики IEA</h2>
        <div class="value">{{ overview.charts_total }}</div>
        <div class="label">найдено</div>
      </div>
      <div class="card">
        <h2>Отправлено</h2>
        <div class="value">{{ overview.charts_sent }}</div>
        <div class="label">графиков</div>
      </div>
    </div>

    <section class="section">
      <h2>Курсы НБРБ на сегодня</h2>
      <div class="buttons">
        <button class="secondary" @click="loadRates" :disabled="loading">Обновить таблицу</button>
      </div>
      <table v-if="rates.length">
        <thead>
          <tr>
            <th>Код</th>
            <th>Валюта</th>
            <th>Единиц</th>
            <th>Курс (BYN)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rates" :key="r.abbreviation + r.currency_id">
            <td>{{ r.abbreviation }}</td>
            <td>{{ r.name }}</td>
            <td>{{ r.scale }}</td>
            <td>{{ r.rate }}</td>
          </tr>
        </tbody>
      </table>
      <div class="status" v-else>Нет данных по курсам на сегодня. Нажми "Обновить курсы на сегодня" ниже.</div>
    </section>

    <section class="section">
      <h2>НБРБ - Управление</h2>
      <div class="buttons">
        <button @click="run(syncCurrencies)" :disabled="loading">Синхронизировать справочник</button>
        <button @click="run(() => loadHistory({}))" :disabled="loading">Загрузить историю</button>
        <button @click="run(updateTodayAndReload)" :disabled="loading">Обновить курсы на сегодня</button>
        <button @click="run(reportAndSend)" :disabled="loading">Сформировать Excel и отправить</button>
      </div>
      <div class="status" v-if="status">{{ status }}</div>
    </section>

    <section class="section">
      <h2>IEA - Графики</h2>
      <div class="buttons">
        <button @click="run(discoverCharts)" :disabled="loading">Найти графики на первой странице</button>
        <button @click="run(downloadNewCharts)" :disabled="loading">Скачать новые</button>
        <button @click="run(sendNewCharts)" :disabled="loading">Отправить непросланные по одному</button>
      </div>
      <div class="status" v-if="status2">{{ status2 }}</div>
    </section>

    <section class="section">
      <h2>Общие задачи</h2>
      <div class="buttons">
        <button @click="runAllTasks" :disabled="loading">Запустить все задачи</button>
        <button class="secondary" @click="refreshAll" :disabled="loading">Обновить статус</button>
      </div>
      <div class="status" v-if="status3">{{ status3 }}</div>
    </section>

    <section class="section">
      <h2>Последние запуски</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Задача</th>
            <th>Статус</th>
            <th>Начало</th>
            <th>Завершение</th>
            <th>Длительность</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="job in jobs" :key="job.id">
            <td>{{ job.id }}</td>
            <td>{{ job.job_name }}</td>
            <td :class="job.status">{{ job.status }}</td>
            <td>{{ formatDate(job.started_at) }}</td>
            <td>{{ formatDate(job.finished_at) }}</td>
            <td>{{ job.duration_ms ? job.duration_ms + 'ms' : '-' }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getOverview, getJobs } from './api/status'
import { syncCurrencies, loadHistory, updateToday, reportAndSend, getRates } from './api/nbrb'
import { discoverCharts, downloadNewCharts, sendNewCharts } from './api/iea'
import { runAll } from './api/tasks'

const overview = ref({ currencies: 0, rates: 0, charts_total: 0, charts_sent: 0 })
const jobs = ref<any[]>([])
const rates = ref<any[]>([])
const loading = ref(false)
const status = ref('')
const status2 = ref('')
const status3 = ref('')

async function loadRates() {
  try {
    rates.value = await getRates()
  } catch (e: any) {
    status.value = 'Ошибка загрузки курсов: ' + e.message
  }
}

async function refresh() {
  loading.value = true
  try {
    overview.value = await getOverview()
    jobs.value = await getJobs(30)
    await loadRates()
  } catch (e: any) {
    status3.value = 'Ошибка: ' + e.message
  } finally {
    loading.value = false
  }
}

async function refreshAll() {
  await refresh()
}

async function run(fn: any) {
  loading.value = true
  status.value = 'Выполняется...'
  try {
    await fn()
    status.value = 'Готово'
    await refresh()
  } catch (e: any) {
    status.value = 'Ошибка: ' + (e.response?.data?.detail || e.message)
  } finally {
    loading.value = false
  }
}

async function runNBRB(fn: any, target: any) {
  loading.value = true
  target.value = 'Выполняется...'
  try {
    await fn()
    target.value = 'Готово'
    await refresh()
  } catch (e: any) {
    target.value = 'Ошибка: ' + (e.response?.data?.detail || e.message)
  } finally {
    loading.value = false
  }
}

async function updateTodayAndReload() {
  await updateToday()
  await loadRates()
  await refresh()
}

async function runAllTasks() {
  loading.value = true
  status3.value = 'Выполняется...'
  try {
    await runAll()
    status3.value = 'Готово'
    await refresh()
  } catch (e: any) {
    status3.value = 'Ошибка: ' + (e.response?.data?.detail || e.message)
  } finally {
    loading.value = false
  }
}

function formatDate(d: string) {
  if (!d) return '-'
  try {
    return new Date(d).toLocaleString('ru-RU')
  } catch {
    return d
  }
}

onMounted(refresh)
</script>
