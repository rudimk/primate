<template>
  <a-popover
    v-model="visible"
    trigger="click"
    placement="bottom"
    :autoAdjustOverflow="true"
    :arrowPointAtCenter="true"
    overlayClassName="header-notice-popover">
    <template slot="content">
      <a-spin :spinning="loading">
        <a-list>
          <a-list-item>
            <a-list-item-meta title="Notifications">
              <a-avatar :style="{backgroundColor: '#6887d0', verticalAlign: 'middle'}" icon="notification" slot="avatar"/>
              <a-button size="small" slot="description" @click="clearJobs">Clear All</a-button>
            </a-list-item-meta>
          </a-list-item>
          <a-list-item v-for="(job, index) in jobs" :key="index">
            <a-list-item-meta :title="job.title" :description="job.description">
              <a-avatar :style="notificationAvatar[job.status].style" :icon="notificationAvatar[job.status].icon" slot="avatar"/>
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </a-spin>
    </template>
    <span @click="showNotifications" class="header-notice-opener">
      <a-badge :count="jobs.length">
        <a-icon class="header-notice-icon" type="bell" />
      </a-badge>
    </span>
  </a-popover>
</template>

<script>
import { api } from '@/api'
import store from '@/store'

export default {
  name: 'HeaderNotice',
  data () {
    return {
      loading: false,
      visible: false,
      jobs: [],
      poller: null,
      notificationAvatar: {
        'done': { 'icon': 'check-circle', 'style': 'backgroundColor:#87d068' },
        'progress': { 'icon': 'loading', 'style': 'backgroundColor:#ffbf00' },
        'failed': { 'icon': 'close-circle', 'style': 'backgroundColor:#f56a00' }
      }
    }
  },
  methods: {
    showNotifications () {
      this.visible = !this.visible
    },
    clearJobs () {
      this.visible = false
      this.jobs = []
      this.$store.commit('SET_ASYNC_JOB_IDS', [])
    },
    startPolling () {
      this.poller = setInterval(() => {
        this.pollJobs()
      }, 2500)
    },
    async pollJobs () {
      var hasUpdated = false
      for (var i in this.jobs) {
        if (this.jobs[i].status === 'progress') {
          await api('queryAsyncJobResult', { 'jobid': this.jobs[i].jobid }).then(json => {
            var result = json.queryasyncjobresultresponse
            if (result.jobstatus === 1 && this.jobs[i].status !== 'done') {
              hasUpdated = true
              this.$notification['success']({
                message: this.jobs[i].title,
                description: this.jobs[i].description
              })
              this.jobs[i].status = 'done'
            } else if (result.jobstatus === 2 && this.jobs[i].status !== 'failed') {
              hasUpdated = true
              this.jobs[i].status = 'failed'
              if (result.jobresult.errortext !== null) {
                this.jobs[i].description = '(' + this.jobs[i].description + ') ' + result.jobresult.errortext
              }
              this.$notification['error']({
                message: this.jobs[i].title,
                description: this.jobs[i].description
              })
            }
          }).catch(function (e) {
            console.log('Error encountered while fetching async job result' + e)
          })
        }
      }
      if (hasUpdated) {
        this.$store.commit('SET_ASYNC_JOB_IDS', this.jobs.reverse())
      }
    }
  },
  beforeDestroy () {
    clearInterval(this.poller)
  },
  created () {
    this.startPolling()
  },
  mounted () {
    this.jobs = store.getters.asyncJobIds.reverse()
    this.$store.watch(
      (state, getters) => getters.asyncJobIds,
      (newValue, oldValue) => {
        if (oldValue !== newValue && newValue !== undefined) {
          this.jobs = newValue.reverse()
        }
      }
    )
  }
}
</script>

<style lang="less" scoped>
  .header-notice {
    display: inline-block;
    transition: all 0.3s;

    &-popover {
      top: 50px !important;
      width: 300px;
      top: 50px;
    }

    &-opener {
      display: inline-block;
      transition: all 0.3s;
      vertical-align: initial;
    }

    &-icon {
      font-size: 18px;
      padding: 4px;
    }
  }
</style>
