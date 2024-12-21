<template>
  <div class="analysis-container">
    <div class="toolbar">
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :shortcuts="dateShortcuts"
      />
      <el-select v-model="analysisType" style="margin-left: 10px">
        <el-option label="按产品" value="product" />
        <el-option label="按地区" value="region" />
        <el-option label="按客户" value="customer" />
      </el-select>
    </div>

    <el-row :gutter="20" class="data-overview">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>总销售额</span>
              <el-tag type="success">{{ compareWithLastPeriod(totalSales) }}</el-tag>
            </div>
          </template>
          <div class="card-content">
            <h2>¥ {{ formatNumber(totalSales) }}</h2>
            <p>较上期: {{ calculateGrowth(totalSales, lastPeriodSales) }}%</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>订单数量</span>
              <el-tag type="primary">{{ compareWithLastPeriod(totalOrders) }}</el-tag>
            </div>
          </template>
          <div class="card-content">
            <h2>{{ totalOrders }}</h2>
            <p>较上期: {{ calculateGrowth(totalOrders, lastPeriodOrders) }}%</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>客单价</span>
              <el-tag type="warning">{{ compareWithLastPeriod(averageOrderValue) }}</el-tag>
            </div>
          </template>
          <div class="card-content">
            <h2>¥ {{ formatNumber(averageOrderValue) }}</h2>
            <p>较上期: {{ calculateGrowth(averageOrderValue, lastPeriodAOV) }}%</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>新增客户</span>
              <el-tag type="info">{{ compareWithLastPeriod(newCustomers) }}</el-tag>
            </div>
          </template>
          <div class="card-content">
            <h2>{{ newCustomers }}</h2>
            <p>较上期: {{ calculateGrowth(newCustomers, lastPeriodNewCustomers) }}%</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="analysis-content">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>销售趋势分析</span>
              <div class="chart-controls">
                <el-radio-group v-model="trendType" size="small">
                  <el-radio-button label="amount">销售额</el-radio-button>
                  <el-radio-button label="quantity">销量</el-radio-button>
                </el-radio-group>
                <el-select v-model="timeUnit" size="small" style="margin-left: 10px">
                  <el-option label="按日" value="day" />
                  <el-option label="按周" value="week" />
                  <el-option label="按月" value="month" />
                </el-select>
              </div>
            </div>
          </template>
          <div class="chart-container" ref="trendChart"></div>
        </el-card>

        <el-card class="chart-card" style="margin-top: 20px">
          <template #header>
            <div class="card-header">
              <span>销售分布分析</span>
              <el-radio-group v-model="distributionType" size="small">
                <el-radio-button label="product">产品分布</el-radio-button>
                <el-radio-button label="region">地区分布</el-radio-button>
                <el-radio-button label="channel">渠道分布</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container" ref="distributionChart"></div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="ranking-card">
          <template #header>
            <div class="card-header">
              <span>销售排行榜</span>
              <el-tabs v-model="rankingType" class="ranking-tabs">
                <el-tab-pane label="产品排行" name="product"></el-tab-pane>
                <el-tab-pane label="客户排行" name="customer"></el-tab-pane>
                <el-tab-pane label="地区排行" name="region"></el-tab-pane>
              </el-tabs>
            </div>
          </template>
          <div class="ranking-list">
            <div v-for="(item, index) in rankingList" :key="index" class="ranking-item">
              <div class="rank-info">
                <span class="rank-number" :class="{'top-three': index < 3}">{{ index + 1 }}</span>
                <span class="rank-name">{{ item.name }}</span>
              </div>
              <div class="rank-data">
                <span class="rank-value">¥ {{ formatNumber(item.value) }}</span>
                <span class="rank-percent" :class="{'positive': item.growth > 0}">
                  {{ item.growth > 0 ? '+' : '' }}{{ item.growth }}%
                </span>
              </div>
            </div>
          </div>
        </el-card>

        <el-card class="target-card" style="margin-top: 20px">
          <template #header>
            <div class="card-header">
              <span>销售目标完成情况</span>
            </div>
          </template>
          <div class="target-list">
            <div v-for="(target, index) in salesTargets" :key="index" class="target-item">
              <div class="target-info">
                <span class="target-name">{{ target.name }}</span>
                <span class="target-progress">{{ target.actual }}/{{ target.target }}</span>
              </div>
              <el-progress 
                :percentage="calculateProgress(target.actual, target.target)"
                :status="getProgressStatus(target.actual, target.target)"
              />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="detail-card" style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <span>销售明细</span>
          <div class="table-actions">
            <el-button type="primary" size="small" @click="exportData">导出数据</el-button>
            <el-button type="success" size="small" @click="generateReport">生成报表</el-button>
          </div>
        </div>
      </template>
      <el-table :data="salesDetails" style="width: 100%">
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="orderNo" label="订单号" width="150" />
        <el-table-column prop="productName" label="产品名称" width="180" />
        <el-table-column prop="customerName" label="客户名称" width="150" />
        <el-table-column prop="region" label="地区" width="120" />
        <el-table-column prop="quantity" label="数量" width="100" />
        <el-table-column prop="amount" label="金额" width="120">
          <template #default="scope">
            ¥ {{ formatNumber(scope.row.amount) }}
          </template>
        </el-table-column>
        <el-table-column prop="channel" label="销售渠道" width="120" />
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button size="small" @click="viewDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="total, prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { init, use } from 'echarts/core'
import { LineChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  LineChart,
  PieChart,
  CanvasRenderer
])

export default {
  name: 'SalesAnalysis',
  data() {
    return {
      dateRange: [],
      dateShortcuts: [
        {
          text: '最近一周',
          value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            return [start, end]
          }
        },
        {
          text: '最近一月',
          value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            return [start, end]
          }
        }
      ],
      // 销售概览数据
      totalSales: 1500000,
      lastPeriodSales: 1200000,
      totalOrders: 1200,
      lastPeriodOrders: 1000,
      averageOrderValue: 1250,
      lastPeriodAOV: 1200,
      newCustomers: 50,
      lastPeriodNewCustomers: 40,

      // 图表控制
      trendType: 'amount',
      timeUnit: 'day',
      distributionType: 'product',
      rankingType: 'product',
      currentPage: 1,
      pageSize: 10,
      total: 100,

      // 销售目标数据
      salesTargets: [
        { name: '总销售额', actual: 1500000, target: 2000000 },
        { name: '新客户数', actual: 80, target: 100 },
        { name: '复购率', actual: 35, target: 40 },
        { name: '客单价', actual: 1200, target: 1500 }
      ],

      // 销售明细数据
      salesDetails: [
        {
          date: '2024-03-01',
          orderNo: 'SO20240301001',
          productName: '七子饼茶',
          customerName: '昆明茶叶专营店',
          region: '云南',
          quantity: 100,
          amount: 50000,
          channel: '直营店'
        }
        // ... 更多数据
      ]
    }
  },
  mounted() {
    this.initCharts()
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
    this.disposeCharts()
  },
  methods: {
    formatNumber(num) {
      return num.toLocaleString()
    },
    calculateGrowth(current, last) {
      return ((current - last) / last * 100).toFixed(2)
    },
    compareWithLastPeriod(current) {
      return current >= this.lastPeriodSales ? '↑ 上升' : '↓ 下降'
    },
    calculateProgress(actual, target) {
      return Math.min(Math.round((actual / target) * 100), 100)
    },
    
    getProgressStatus(actual, target) {
      const progress = (actual / target) * 100
      if (progress >= 100) return 'success'
      if (progress >= 80) return 'warning'
      return 'exception'
    },

    handlePageChange(page) {
      this.currentPage = page
      // 加载对应页的数据
    },

    exportData() {
      this.$message.success('数据导出成功')
    },

    generateReport() {
      this.$message.success('报表生成成功')
    },

    viewDetail(row) {
      console.log('查看详情:', row)
    },

    initCharts() {
      const trendChart = init(this.$refs.trendChart)
      const distributionChart = init(this.$refs.distributionChart)
      
      trendChart.setOption({
        title: {
          text: '销售趋势分析'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['销售额', '同比']
        },
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '销售额',
            type: 'line',
            data: [150, 230, 224, 218, 135, 147],
            smooth: true
          },
          {
            name: '同比',
            type: 'line',
            data: [120, 200, 210, 190, 120, 130],
            smooth: true
          }
        ]
      })

      distributionChart.setOption({
        title: {
          text: '销售分布分析'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 10,
          data: ['七子饼茶', '普洱茶', '红茶', '绿茶', '其他']
        },
        series: [
          {
            name: '销售分布',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 335, name: '七子饼茶' },
              { value: 310, name: '普洱茶' },
              { value: 234, name: '红茶' },
              { value: 135, name: '绿茶' },
              { value: 148, name: '其他' }
            ]
          }
        ]
      })

      this.charts = {
        trendChart,
        distributionChart
      }
    },
    handleResize() {
      this.charts.trendChart?.resize()
      this.charts.distributionChart?.resize()
    },
    disposeCharts() {
      this.charts.trendChart?.dispose()
      this.charts.distributionChart?.dispose()
    }
  },
  watch: {
    trendType() {
      // 更新销售趋势图数据
    },
    timeUnit() {
      // 更新销售趋势图数据
    },
    distributionType() {
      // 更新销售分布图数据
    },
    rankingType() {
      // 更新排行榜数据
    }
  }
}
</script>

<style scoped>
.analysis-container {
  padding: 20px;
}

.toolbar {
  margin-bottom: 20px;
}

.chart-card {
  margin-bottom: 20px;
}

.chart-container {
  height: 400px;
}

.ranking-card {
  .ranking-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #eee;

    .rank-info {
      display: flex;
      align-items: center;

      .rank-number {
        width: 24px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        background: #f5f7fa;
        border-radius: 50%;
        margin-right: 10px;
        font-weight: bold;

        &.top-three {
          background: #ffd700;
          color: #fff;
        }
      }
    }

    .rank-data {
      text-align: right;

      .rank-value {
        display: block;
        font-weight: bold;
      }

      .rank-percent {
        font-size: 12px;
        color: #999;

        &.positive {
          color: #67c23a;
        }
      }
    }
  }
}

.target-card {
  .target-item {
    margin-bottom: 15px;

    .target-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
    }
  }
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style> 