<template>
  <div id="className" :style="{width: width, height: height}" />
</template>
<script>
import { getStatistics } from '../../../api/order'
require('echarts/theme/macarons') // echarts theme
import echarts from 'echarts'
import { getUserId } from '../../../utils/auth'

export default {
  props: {
    className: {
      type: String,
      default: 'order'
    },
    width: {
      type: String,
      default: '95%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      statsOptions: ['未支付', '已支付', '已发货', '确认收货', '已取消'],
      name: 'abc',
      data: {
        unpaid: 0,
        paid: 0,
        canceled: 0,
        delivery: 0,
        confirm: 0
      },
      isAgent: this.$store.state.user.roles.indexOf('agent') !== -1,
      isStoreSupporter: this.$store.state.user.roles.indexOf('storeSupporter') !== -1,
      isAdmin: this.$store.state.user.roles.indexOf('admin') !== -1
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      // this.chart = echarts.init(document.getElementById('orderECharts'))
      this.chart = echarts.init(this.$el, 'macarons')
      this.getData()
    },
    async getData() {
      const today = new Date()
      const todayMon = today.getMonth() + 1
      const todayDay = today.getDate()
      const todayDate = today.getFullYear() + '/' + (todayMon >= 10 ? todayMon : '0' + todayMon) + '/' +
        (todayDay >= 10 ? todayDay : '0' + todayDay)
      const sevenDaysAgo = new Date(today.getTime() - (7 * 86400 * 1000))

      const sevenDaysAgoMonth = sevenDaysAgo.getMonth() + 1
      const sevenDaysAgoDay = sevenDaysAgo.getDate()

      const sevenDaysAgoDate = sevenDaysAgo.getFullYear() + '/' + (sevenDaysAgoMonth >= 10 ? sevenDaysAgoMonth : '0' + sevenDaysAgoMonth) + '/' +
        (sevenDaysAgoDay >= 10 ? sevenDaysAgoDay : '0' + sevenDaysAgoDay)
      const param = {
        action: 'total_money_by_stats',
        start_created_at: sevenDaysAgoDate,
        end_created_at: todayDate
      }
      if (this.isStoreSupporter === true) {
        param.agent_id = getUserId()
      }
      getStatistics(param).then(response => {
        for (let i = 0; i < response.length; i++) {
          if (response[i].stats === '0') {
            this.data.unpaid += parseInt(response[i].total)
          }

          if (response[i].stats === '1') {
            this.data.paid += parseInt(response[i].total)
          }

          if (response[i].stats === '2') {
            this.data.delivery += parseInt(response[i].total)
          }

          if (response[i].stats === '3') {
            this.data.confirm += parseInt(response[i].total)
          }

          if (response[i].stats === '4') {
            this.data.canceled += parseInt(response[i].total)
          }
        }
        this.setOption(this.data.unpaid, this.data.paid, this.data.delivery, this.data.confirm, this.data.canceled)
      }).catch(() => {
        this.list = []
      })
    },
    setOption() {
      this.chart.setOption({
        // title: {
        //   text: '近一周各订单状态统计'
        // },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['未支付', '已支付', '已发货', '确认收货', '已取消']
        },
        series: [
          {
            name: '近一周订单各订单状态',
            type: 'pie',
            roseType: 'radius',
            radius: [50, 95],
            center: ['50%', '38%'],
            data: [
              {
                name: '未支付',
                value: this.data.unpaid
              },
              {
                name: '已支付',
                value: this.data.paid
              },
              {
                name: '已发货',
                value: this.data.delivery
              },
              {
                name: '已确认',
                value: this.data.confirm
              },
              {
                name: '已取消',
                value: this.data.canceled
              }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600,
            avoidLabelOverlap: false
          }
        ]
      })
    }
  }
}
</script>
