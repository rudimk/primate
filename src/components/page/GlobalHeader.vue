<template>
  <a-layout-header v-if="!headerBarFixed" :class="[fixedHeader && 'ant-header-fixedHeader', sidebarOpened ? 'ant-header-side-opened' : 'ant-header-side-closed', theme ]" :style="{ padding: '0' }">
    <div v-if="mode === 'sidemenu'" class="header">
      <a-icon
        v-if="device==='mobile'"
        class="trigger"
        :type="collapsed ? 'menu-fold' : 'menu-unfold'"
        @click="toggle"></a-icon>
      <a-icon
        v-else
        class="trigger"
        :type="collapsed ? 'menu-unfold' : 'menu-fold'"
        @click="toggle"/>

      <a-breadcrumb class="breadcrumb" v-if="device === 'desktop'">
        <a-breadcrumb-item v-for="(item, index) in breadList" :key="index">
          <router-link
            v-if="item.name"
            :to="{ path: item.path === '' ? '/' : item.path }"
          >
            <a-icon v-if="index == 0" :type="item.meta.icon" />
            {{ $t(item.meta.title) }}
          </router-link>
          <span v-else-if="$route.params.id">
            {{ $route.params.id }}
            <a-button shape="circle" type="dashed" size="small" v-clipboard:copy="$route.params.id">
              <a-icon type="copy" style="margin-left: 0px"/>
            </a-button>
          </span>
          <span v-else>{{ $t(tem.meta.title) }}</span>
        </a-breadcrumb-item>
      </a-breadcrumb>

      <user-menu></user-menu>
    </div>
    <div v-else :class="['top-nav-header-index', theme]">
      <div class="header-index-wide">
        <div class="header-index-left">
          <logo class="top-nav-header" :show-title="device !== 'mobile'" />
          <s-menu
            v-if="device !== 'mobile'"
            mode="horizontal"
            :menu="menus"
            :theme="theme"
          ></s-menu>
          <a-icon
            v-else
            class="trigger"
            :type="collapsed ? 'menu-fold' : 'menu-unfold'"
            @click="toggle"></a-icon>
        </div>
        <a-breadcrumb class="breadcrumb" v-if="device !== 'mobile'">
          <a-breadcrumb-item v-for="(item, index) in breadList" :key="index">
            <router-link
              v-if="item.name"
              :to="{ path: item.path === '' ? '/' : item.path }"
            >
              <a-icon v-if="index == 0" :type="item.meta.icon" />
              {{ item.meta.title }}
            </router-link>
            <span v-else-if="$route.params.id">{{ $route.params.id }}</span>
            <span v-else>{{ item.meta.title }}</span>
          </a-breadcrumb-item>
        </a-breadcrumb>
        <user-menu class="header-index-right"></user-menu>
      </div>
    </div>

  </a-layout-header>
</template>

<script>
import UserMenu from '../tools/UserMenu'
import SMenu from '../menu/'
import Logo from '../tools/Logo'

import { mixin } from '@/utils/mixin.js'

export default {
  name: 'GlobalHeader',
  components: {
    SMenu,
    Logo,
    UserMenu
  },
  mixins: [mixin],
  props: {
    mode: {
      type: String,
      // sidemenu, topmenu
      default: 'sidemenu'
    },
    menus: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    device: {
      type: String,
      required: false,
      default: 'desktop'
    }
  },
  data () {
    return {
      headerBarFixed: false,
      breadList: []
    }
  },
  created () {
    this.getBreadcrumb()
  },
  watch: {
    $route () {
      this.getBreadcrumb()
    }
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    getBreadcrumb () {
      this.breadList = []
      this.name = this.$route.name
      this.$route.matched.forEach((item) => {
        this.breadList.push(item)
      })
    },
    handleScroll () {
      if (this.autoHideHeader) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        if (scrollTop > 100) {
          this.headerBarFixed = true
        } else {
          this.headerBarFixed = false
        }
      } else {
        this.headerBarFixed = false
      }
    },
    toggle () {
      this.$emit('toggle')
    }
  }
}
</script>

<style lang="less" scoped>
.ant-layout-header {
  .anticon-menu-fold {
    font-size: 18px;
    line-height: 1;
  }

  .ant-breadcrumb {
    display: inline;
    vertical-align: text-bottom;
  }

  .ant-breadcrumb .anticon {
    margin-top: -3px;
    margin-left: 12px;
  }

  .anticon-home {
    font-size: 14px;
  }

  .anticon {
    vertical-align: middle;
  }
}
</style>
