<template>
  <div>
    <a-row :gutter="12">
      <a-col :md="24" :lg="16">
        <a-card :bordered="true" :title="this.$t('instance')">
          <a-form
            :form="form"
            @submit="handleSubmit"
            layout="vertical"
          >
            <a-form-item
              v-for="(field, fieldIndex) in filteredParams"
              :key="fieldIndex"
              :label="$t(field.name)"
              :v-bind="field.name"
            >
              <a-switch
                v-if="field.type==='boolean'"
                v-decorator="[field.name, {
                  rules: [{ required: field.required, message: 'Please provide input' }]
                }]"
                :placeholder="field.description"
              />
              <a-select
                v-else-if="field.type==='uuid' || field.name==='account'"
                :loading="field.loading"
                v-decorator="[field.name, {
                  rules: [{ required: field.required, message: 'Please select option' }]
                }]"
                :placeholder="field.description"
              >
                <a-select-option v-for="(opt, optIndex) in field.opts" :key="optIndex">
                  {{ opt.name }}
                </a-select-option>
              </a-select>
              <a-input-number
                v-else-if="field.type==='long'"
                v-decorator="[field.name, {
                  rules: [{ required: field.required, message: 'Please enter a number' }]
                }]"
                :placeholder="field.description"
              />
              <a-input
                v-else
                v-decorator="[field.name, {
                  rules: [{ required: field.required, message: 'Please enter input' }]
                }]"
                :placeholder="field.description"
              />
            </a-form-item>
            <div class="card-footer">
              <!-- ToDo extract as component -->
              <a-button @click="() => this.$router.back()">{{ this.$t('cancel') }}</a-button>
              <a-button type="primary" @click="handleSubmit">{{ this.$t('submit') }}</a-button>
            </div>
          </a-form>
        </a-card>
      </a-col>
      <a-col :md="24" :lg="8">
        <a-card :bordered="true" :title="this.$t('yourInstance')">
          <a-list
            itemLayout="horizontal"
            :dataSource="instanceConfigListData"
          >
            <a-list-item slot="renderItem" slot-scope="item">
              <!-- ToDo extract as component -->
              <div class="list-item">
                <span class="list-item__icon" v-if="item.icon">
                  <font-awesome-icon :icon="item.icon"/>
                </span>
                <span class="list-item__title">
                  {{ item.title || '-' }}
                </span>
              </div>
            </a-list-item>
          </a-list>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Vue from 'vue'
import { api } from '@/api'
import store from '@/store'
import _ from 'lodash'

export default {
  name: 'Wizard',
  props: {
    visible: {
      type: Boolean
    }
  },
  data () {
    return {
      loading: false,
      params: [],
      visibleParams: [
        'name',
        'zoneid',
        'templateid',
        'serviceofferingid',
        'diskofferingid',
        'rootdisksize'
      ],
      instanceConfig: []
    }
  },
  computed: {
    filteredParams () {
      return this.visibleParams.map((fieldName) => {
        return this.params.find((param) => fieldName === param.name)
      })
    },
    instanceConfigListData () {
      return _.map(this.instanceConfig, this.getConfig, [])
    }
  },
  watch: {
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, {
      onValuesChange: (props, fields) => {
        this.instanceConfig = { ...this.form.getFieldsValue(), ...fields }
      }
    })
  },
  created () {
    this.params = store.getters.apis[this.$route.name]['params']
    this.filteredParams.forEach((param) => {
      this.fetchOptions(param)
    })
    Vue.nextTick().then(() => {
      this.instanceConfig = this.form.getFieldsValue() // ToDo: maybe initialize with some other defaults
    })
  },
  methods: {
    getConfig (value, name) {
      const icon = ['fas', 'memory']
      const param = _.filter(this.params, (param) => param.name === name)
      const opts = _.get(param, '0.opts', [])
      if (opts.length > 0) {
        value = _.get(opts, `${value}.displaytext`)
        // icon = ['fab', 'ubuntu'] // ToDo: find icon
      }
      return {
        title: value,
        icon: icon
      }
    },
    handleSubmit () {
      console.log('wizard submit')
    },
    fetchOptions (param) {
      const paramName = param.name
      const possibleName = `list${paramName.replace('id', '').toLowerCase()}s`
      let possibleApi
      if (paramName === 'id') {
        possibleApi = this.apiName
      } else {
        possibleApi = _.filter(Object.keys(store.getters.apis), (api) => {
          return api.toLowerCase().startsWith(possibleName)
        })[0]
      }

      if (!possibleApi) {
        return
      }

      param.loading = true
      param.opts = []
      const params = {}
      params.listall = true
      if (possibleApi === 'listTemplates') {
        params.templatefilter = 'executable'
      }
      api(possibleApi, params).then((response) => {
        param.loading = false
        _.map(response, (responseItem, responseKey) => {
          if (!responseKey.includes('response')) {
            return
          }
          _.map(responseItem, (response, key) => {
            if (key === 'count') {
              return
            }
            param.opts = response
            this.$forceUpdate()
          })
        })
      }).catch(function (error) {
        console.log(error.stack)
        param.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .card-footer {
    text-align: right;

    button + button {
      margin-left: 8px;
    }
  }

  .list-item {
    &__icon {
      vertical-align: middle;
      padding-right: 0.5rem;
    }

    &__title {
      vertical-align: middle;
    }
  }
</style>
