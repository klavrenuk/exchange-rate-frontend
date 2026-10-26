<template>
  <div class="container">
    <header>
      <h1>Exchange Rate Service</h1>
      <p>Управление загрузкой курсов НБРБ и графиков IEA</p>
    </header>

    <div v-if="overviewError" class="error-box">
      <span>{{ overviewError }}</span>
      <button class="secondary" :disabled="loading" @click="loadOverview">Повторить</button>
    </div>

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
      <div v-if="ratesError" class="error-box">
        <span>{{ ratesError }}</span>
        <button class="secondary" :disabled="loading" @click="loadRates">Повторить</button>
      </div>
      <table v-else-if="rates.length">
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
      <div class="status" v-else>{{ loading ? 'Загрузка…' : 'Нет данных по курсам на сегодня.' }}</div>
    </section>

    <NbrbControls @changed="refresh" />
    <IeaControls @changed="refresh" />

    <section class="section">
      <h2>IEA - Список графиков</h2>
      <div v-if="chartsError" class="error-box">
        <span>{{ chartsError }}</span>
        <button class="secondary" :disabled="loading" @click="loadCharts">Повторить</button>
      </div>
      <table v-else-if="charts.length">
        <thead>
          <tr>
            <th>Slug</th>
            <th>URL</th>
            <th>Скачан</th>
            <th>Файлы</th>
            <th>Отправлен</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in charts" :key="c.id">
            <td>{{ c.slug }}</td>
            <td><a :href="c.url" target="_blank">{{ c.url }}</a></td>
            <td>{{ c.downloaded_at ? formatDate(c.downloaded_at) : '-' }}</td>
            <td>{{ c.has_files ? 'да' : 'нет' }}</td>
            <td :class="c.sent ? 'success' : ''">{{ c.sent ? 'да' : 'нет' }}</td>
          </tr>
        </tbody>
      </table>
      <div class="status" v-else>{{ loading ? 'Загрузка…' : 'Графики ещё не найдены.' }}</div>
    </section>

    <section class="section">
      <h2>Последние запуски</h2>
      <div v-if="jobsError" class="error-box">
        <span>{{ jobsError }}</span>
        <button class="secondary" :disabled="loading" @click="loadJobs">Повторить</button>
      </div>
      <table v-else-if="jobs.length">
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
            <td :class="job.status">
              {{ job.status }}
              <div v-if="job.error_text" class="job-error" :title="job.error_text">{{ job.error_text }}</div>
            </td>
            <td>{{ formatDate(job.started_at) }}</td>
            <td>{{ formatDate(job.finished_at) }}</td>
            <td>{{ job.duration_ms ? job.duration_ms + 'ms' : '-' }}</td>
          </tr>
        </tbody>
      </table>
      <div class="status" v-else>{{ loading ? 'Загрузка…' : 'Запусков пока не было.' }}</div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getOverview, getJobs } from '@/entities/jobs'
import type { JobItem, Overview } from '@/entities/jobs'
import { getRates } from '@/entities/rates'
import type { RateItem } from '@/entities/rates'
import { getCharts } from '@/entities/charts'
import type { ChartItem } from '@/entities/charts'
import { NbrbControls } from '@/features/nbrb-controls'
import { IeaControls } from '@/features/iea-controls'
import { getErrorMessage } from '@/shared/api'

const overview = ref<Overview>({ currencies: 0, rates: 0, charts_total: 0, charts_sent: 0 })
const jobs = ref<JobItem[]>([])
const rates = ref<RateItem[]>([])
const charts = ref<ChartItem[]>([])
const loading = ref(false)
const overviewError = ref('')
const jobsError = ref('')
const ratesError = ref('')
const chartsError = ref('')

async function loadOverview() {
  overviewError.value = ''
  try {
    overview.value = await getOverview()
  } catch (error) {
    overviewError.value = getErrorMessage(error, 'Не удалось загрузить сводку')
  }
}

async function loadJobs() {
  jobsError.value = ''
  try {
    jobs.value = await getJobs(30)
  } catch (error) {
    jobsError.value = getErrorMessage(error, 'Не удалось загрузить список запусков')
  }
}

async function loadRates() {
  ratesError.value = ''
  try {
    rates.value = await getRates()
  } catch (error) {
    ratesError.value = getErrorMessage(error, 'Не удалось загрузить курсы')
  }
}

async function loadCharts() {
  chartsError.value = ''
  try {
    charts.value = await getCharts()
  } catch (error) {
    chartsError.value = getErrorMessage(error, 'Не удалось загрузить графики')
  }
}

async function refresh() {
  loading.value = true
  try {
    await Promise.all([loadOverview(), loadJobs(), loadRates(), loadCharts()])
  } finally {
    loading.value = false
  }
}

function formatDate(value: string | null) {
  if (!value) return '-'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('ru-RU')
}

onMounted(refresh)
</script>
