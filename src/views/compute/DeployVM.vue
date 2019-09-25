<template>
  <div>
    <a-form
      :form="form"
      @submit="handleSubmit"
      layout="vertical"
    >
      <a-form-item
        v-for="(field, fieldIndex) in filteredInputs"
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
    </a-form>
  </div>
</template>

<script>
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
        'rootdisksize'
      ]
    }
  },
  computed: {
    filteredInputs () {
      return this.visibleParams.map((fieldName) => {
        return this.params.find((param) => fieldName === param.name)
      })
    }
  },
  watch: {
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  created () {
    this.params = store.getters.apis[this.$route.name]['params']
    this.params.forEach((param) => {
      this.fetchOptions(param)
    })
  },
  methods: {
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

<style scoped>

</style>
