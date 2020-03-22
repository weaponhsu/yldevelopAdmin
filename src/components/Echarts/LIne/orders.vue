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
      // statsOptions: ['未支付', '已支付', '已发货', '确认收货', '已取消'],
      name: 'abc',
      data: {
        orders: [],
        price: [],
        stats: [],
        unpaid: [],
        paid: [],
        canceled: [],
        delivery: [],
        confirm: [],
        date: []
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
        action: 'total_by_date',
        start_created_at: sevenDaysAgoDate,
        end_created_at: todayDate
      }
      if (this.isStoreSupporter === true) {
        param.agent_id = getUserId()
      }
      getStatistics(param).then(response => {
        for (let i = 0; i < response.length; i++) {
          this.data.date.push(response[i].date)
          this.data.orders.push(response[i].total)
        }
        this.setOption(this.data)
      }).catch(() => {
        this.list = []
      })
    },
    setOption({ date, orders } = {}) {
      this.chart.setOption({
        title: {
          text: '近一周订单数量统计'
        },
        xAxis: {
          data: date,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10, 15]
        },
        yAxis: {
          axisTick: {
            show: false
          },
          minInterval: 1
        },
        legend: {
          data: ['订单总数']
        },
        series: [{
          name: '订单总数', itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: orders,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }]
      })
    }
  }
}
</script>
