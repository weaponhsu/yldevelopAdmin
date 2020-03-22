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
        action: 'total_price_by_stats_date',
        start_created_at: sevenDaysAgoDate,
        end_created_at: todayDate
      }
      if (this.isStoreSupporter === true) {
        param.agent_id = getUserId()
      }
      console.log(param)
      getStatistics(param).then(response => {
        console.log(response)
        for (let i = 0; i < response.length; i++) {
          const idx = this.data.date.indexOf(response[i].date)
          if (idx === -1) {
            this.data.date.push(response[i].date)
            this.data.unpaid.push(response[i].stats === '0' ? parseInt(response[i].price) : 0)
            this.data.paid.push(response[i].stats === '1' ? parseInt(response[i].price) : 0)
            this.data.delivery.push(response[i].stats === '2' ? parseInt(response[i].price) : 0)
            this.data.confirm.push(response[i].stats === '3' ? parseInt(response[i].price) : 0)
            this.data.canceled.push(response[i].stats === '4' ? parseInt(response[i].price) : 0)
          } else {
            if (response[i].stats === '0') {
              this.data.unpaid[idx] += parseInt(response[i].price)
            }
            if (response[i].stats === '1') {
              this.data.paid[idx] += parseInt(response[i].price)
            }
            if (response[i].stats === '2') {
              this.data.delivery[idx] += parseInt(response[i].price)
            }
            if (response[i].stats === '3') {
              this.data.confirm[idx] += parseInt(response[i].price)
            }
            if (response[i].stats === '4') {
              this.data.canceled[idx] += parseInt(response[i].price)
            }
          }
        }
        console.log(this.data)
        this.setOption(this.data)
      }).catch(() => {})
    },
    setOption({ date, unpaid, paid, delivery, confirm, canceled } = {}) {
    // setOption({ date, unpaidMoney, paidMoney } = {}) {
      this.chart.setOption({
        title: {
          text: '近一周每日订单统计'
        },
        xAxis: {
          data: date,
          boundaryGap: true,
          axisTick: {
            alignWithLabel: true
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
            type: 'shadow'
          }
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: this.statsOptions
        },
        series: [{
          name: '未支付',
          type: 'bar',
          barWidth: 15,
          data: unpaid
        }, {
          name: '已支付',
          type: 'bar',
          barWidth: 15,
          data: paid
        }, {
          name: '已发货',
          type: 'bar',
          barWidth: 15,
          data: delivery
        }, {
          name: '确认收货',
          type: 'bar',
          barWidth: 15,
          data: confirm
        }, {
          name: '已取消',
          type: 'bar',
          barWidth: 15,
          data: canceled
        }]
      })
    }
  }
}
</script>
