<template>
  <div class="dashboard-editor-container">

    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <order-bar-e-charts />
    </el-row>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <order-count-bar-e-charts />
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <order-pie-e-charts />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="16">
        <div class="chart-wrapper">
          <order-line-e-charts />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './PanelGroup'
import OrderBarECharts from './Bar/orders'
import OrderPieECharts from './Pie/orders'
import OrderLineECharts from './LIne/orders'
import OrderCountBarECharts from './Bar/orderCount'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    // eslint-disable-next-line vue/no-unused-components
    OrderBarECharts: OrderBarECharts,
    // eslint-disable-next-line vue/no-unused-components
    OrderPieECharts: OrderPieECharts,
    // eslint-disable-next-line vue/no-unused-components
    OrderLineECharts: OrderLineECharts,
    // eslint-disable-next-line vue/no-unused-components
    OrderCountBarECharts: OrderCountBarECharts
  },
  data() {
    return {}
  },
  methods: {
    handleSetLineChartData(type) {
      console.log('index: ' + type)
      // this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }

  @media (max-width:1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
</style>
