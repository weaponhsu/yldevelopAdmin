<template>
  <div class="dashboard-container">
<!--    <div class="dashboard-text">name: {{ name }}</div>-->
<!--    <div class="dashboard-text">roles: <span v-for="role in roles" :key="role">{{ role }}</span></div>-->
<!--    <div class="dashboard-text">{{ orders }} - {{ merchants }} - {{ accounts }} - {{ shops }}</div>-->

    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import OrderECharts from '../../components/Echarts'
// import DashboardAdmin from '../../components/Echarts'

export default {
  name: 'Dashboard',
  // components: { DashboardAdmin },
  // computed: {
  //   ...mapGetters([
  //     'name',
  //     'roles'
  //   ])
  // }
  watch: {
    seriesData(val) {
      this.setOption({ series: val })
    }
  },
  data() {
    console.log(this.$store.state)
    const d = this.$store.state.permission.routes.map(item => {
      return item.path
    })
    return {
      // currentRole: DashboardAdmin,
      name: this.$store.state.user.name,
      roles: this.$store.state.user.roles,
      orders: d.indexOf('/orders') !== -1 ? 1 : 0,
      shops: d.indexOf('/shop') !== -1 ? 1 : 0,
      accounts: d.indexOf('/accounts') !== -1 ? 1 : 0,
      merchants: d.indexOf('/merchant') !== -1 ? 1 : 0
    }
  },
  created() {

  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
