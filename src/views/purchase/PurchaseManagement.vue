<template>
  <div class="purchase-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="title">采购管理</div>
      <div class="description">管理采购订单和供应商交付情况</div>
    </div>

    <!-- 数据概览 -->
    <el-row :gutter="20" class="data-overview">
      <el-col :span="6">
        <el-card shadow="hover" class="overview-card">
          <div class="card-icon money">
            <el-icon><Money /></el-icon>
          </div>
          <div class="card-title">本月采购额</div>
          <div class="card-value">¥ {{ formatNumber(520000) }}</div>
          <div class="card-footer">
            <span>较上月</span>
            <span class="trend-up">
              <el-icon><CaretTop /></el-icon>
              12.5%
            </span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="overview-card">
          <div class="card-icon warning">
            <el-icon><Warning /></el-icon>
          </div>
          <div class="card-title">待审核订单</div>
          <div class="card-value">{{ purchases.filter(p => p.status === '待审核').length }}</div>
          <div class="card-footer">
            <el-tag size="small" type="warning" effect="dark">需要处理</el-tag>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="overview-card">
          <div class="card-title">进行中订单</div>
          <div class="card-value">{{ purchases.filter(p => p.status === '已审核').length }}</div>
          <div class="card-footer">
            <span>按时交付率</span>
            <span class="trend-up">98.5%</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="overview-card">
          <div class="card-title">本月完成</div>
          <div class="card-value">{{ purchases.filter(p => p.status === '已完成').length }}</div>
          <div class="card-footer">
            <span>较上月</span>
            <span class="trend-up">+3</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 数据分析区域 -->
    <el-row :gutter="20" class="analysis-section">
      <el-col :span="16">
        <el-card shadow="never" class="chart-card">
          <template #header>
            <div class="card-header">
              <span>采购趋势分析</span>
              <div class="chart-controls">
                <el-radio-group v-model="chartType" size="small">
                  <el-radio-button label="amount">采购金额</el-radio-button>
                  <el-radio-button label="count">采购数量</el-radio-button>
                </el-radio-group>
                <el-select v-model="timeRange" size="small" style="margin-left: 10px">
                  <el-option label="近7天" value="7" />
                  <el-option label="近30天" value="30" />
                  <el-option label="近90天" value="90" />
                </el-select>
              </div>
            </div>
          </template>
          <div class="chart-container" ref="trendChart"></div>
        </el-card>

        <el-card shadow="never" class="chart-card" style="margin-top: 20px">
          <template #header>
            <div class="card-header">
              <span>采购分布分析</span>
              <el-radio-group v-model="distributionType" size="small">
                <el-radio-button label="supplier">供应商分布</el-radio-button>
                <el-radio-button label="category">品类分布</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container" ref="distributionChart"></div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="never" class="ranking-card">
          <template #header>
            <div class="card-header">
              <span>采购排行</span>
              <el-tabs v-model="rankingType" class="ranking-tabs">
                <el-tab-pane label="供应商排行" name="supplier"></el-tab-pane>
                <el-tab-pane label="产品排行" name="product"></el-tab-pane>
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

        <el-card shadow="never" class="target-card" style="margin-top: 20px">
          <template #header>
            <div class="card-header">
              <span>采购目标完成情况</span>
            </div>
          </template>
          <div class="target-list">
            <div v-for="(target, index) in purchaseTargets" :key="index" class="target-item">
              <div class="target-info">
                <span class="target-name">{{ target.name }}</span>
                <span class="target-progress">{{ formatNumber(target.actual) }}/{{ formatNumber(target.target) }}</span>
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

    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="left">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>新建采购单
        </el-button>
        <el-input
          v-model="searchQuery"
          placeholder="请输入采购单号搜索"
          prefix-icon="Search"
          style="width: 250px"
        />
        <el-select v-model="statusFilter" placeholder="状态筛选" style="width: 120px">
          <el-option label="全部" value="" />
          <el-option label="待审核" value="待审核" />
          <el-option label="已审核" value="已审核" />
          <el-option label="已完成" value="已完成" />
        </el-select>
      </div>
      <div class="right">
        <el-button type="success">
          <el-icon><Download /></el-icon>导出数据
        </el-button>
        <el-button>
          <el-icon><RefreshRight /></el-icon>刷新
        </el-button>
      </div>
    </div>

    <!-- 采购单表格 -->
    <el-card shadow="never" class="table-card">
      <el-table 
        :data="filteredPurchases" 
        style="width: 100%"
        border
        stripe
        highlight-current-row
      >
        <el-table-column prop="id" label="采购单号" width="120" />
        <el-table-column prop="supplierName" label="供应商" width="180" />
        <el-table-column prop="productName" label="采购产品" width="150" />
        <el-table-column label="数量/单价" width="150">
          <template #default="scope">
            {{ scope.row.quantity }} {{ scope.row.unit }} / ¥{{ scope.row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="totalAmount" label="总金额" width="120">
          <template #default="scope">
            ¥ {{ formatNumber(scope.row.totalAmount) }}
          </template>
        </el-table-column>
        <el-table-column prop="orderDate" label="下单日期" width="120" />
        <el-table-column prop="expectedDate" label="预计到货" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="scope">
            <el-button 
              link
              type="primary" 
              @click="handleEdit(scope.row)"
              :disabled="scope.row.status === '已完成'"
            >编辑</el-button>
            <el-button 
              link
              type="primary" 
              @click="viewDetails(scope.row)"
            >详情</el-button>
            <el-button 
              link
              type="success"
              v-if="scope.row.status === '待审核'"
              @click="handleApprove(scope.row)"
            >审核</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :total="filteredPurchases.length"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 50, 100]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 采购单表单对话框 -->
    <el-dialog 
      :title="dialogTitle" 
      v-model="dialogVisible"
      width="700px"
      destroy-on-close
    >
      <el-form 
        :model="purchaseForm" 
        :rules="rules" 
        ref="purchaseForm" 
        label-width="100px"
        class="purchase-form"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="供应商" prop="supplierName">
              <el-select v-model="purchaseForm.supplierName" style="width: 100%">
                <el-option 
                  v-for="supplier in suppliers"
                  :key="supplier.id"
                  :label="supplier.name"
                  :value="supplier.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购产品" prop="productName">
              <el-input v-model="purchaseForm.productName" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="数量" prop="quantity">
              <el-input-number 
                v-model="purchaseForm.quantity" 
                :min="1"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单位" prop="unit">
              <el-select v-model="purchaseForm.unit" style="width: 100%">
                <el-option label="公斤" value="公斤" />
                <el-option label="套" value="套" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单价" prop="price">
              <el-input-number 
                v-model="purchaseForm.price" 
                :precision="2" 
                :step="0.1" 
                :min="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="预计到货日" prop="expectedDate">
          <el-date-picker
            v-model="purchaseForm.expectedDate"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input 
            type="textarea"
            v-model="purchaseForm.remark"
            rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 采购单详情对话框 -->
    <el-dialog
      title="采购单详情"
      v-model="detailDialogVisible"
      width="800px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="采购单号">{{ currentDetail.id }}</el-descriptions-item>
        <el-descriptions-item label="供应商">{{ currentDetail.supplierName }}</el-descriptions-item>
        <el-descriptions-item label="采购产品">{{ currentDetail.productName }}</el-descriptions-item>
        <el-descriptions-item label="数量/单价">
          {{ currentDetail.quantity }} {{ currentDetail.unit }} / ¥{{ currentDetail.price }}
        </el-descriptions-item>
        <el-descriptions-item label="总金额">¥ {{ formatNumber(currentDetail.totalAmount) }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(currentDetail.status)">
            {{ currentDetail.status }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="下单日期">{{ currentDetail.orderDate }}</el-descriptions-item>
        <el-descriptions-item label="预计到货">{{ currentDetail.expectedDate }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ currentDetail.remark || '无' }}</el-descriptions-item>
      </el-descriptions>

      <div class="detail-section">
        <h3>审核记录</h3>
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in auditLogs"
            :key="index"
            :type="activity.type"
            :timestamp="activity.timestamp"
          >
            {{ activity.content }}
            <div class="timeline-extra">
              操作人：{{ activity.operator }}
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { 
  Plus, 
  Search, 
  Download, 
  RefreshRight,
  Money,
  Document,
  Van,
  Check,
  Timer,
  Warning,
  CaretTop
} from '@element-plus/icons-vue'

// 引入 echarts
import * as echarts from 'echarts'

export default {
  name: 'PurchaseManagement',
  components: {
    Plus,
    Search,
    Download,
    RefreshRight,
    Money,
    Document,
    Van,
    Check,
    Timer,
    Warning,
    CaretTop
  },
  data() {
    return {
      searchQuery: '',
      statusFilter: '',
      purchases: [
        {
          id: 'PO001',
          supplierName: '云南茶叶供应商A',
          productName: '春茶鲜叶',
          quantity: 1000,
          unit: '公斤',
          price: 80,
          totalAmount: 80000,
          orderDate: '2024-03-01',
          expectedDate: '2024-03-10',
          status: '已审核',
          remark: '春茶第一批次采购'
        },
        {
          id: 'PO002',
          supplierName: '普洱茶叶专业合作社',
          productName: '普洱茶原料',
          quantity: 2000,
          unit: '公斤',
          price: 120,
          totalAmount: 240000,
          orderDate: '2024-03-02',
          expectedDate: '2024-03-15',
          status: '待审核',
          remark: '特级原料采购'
        },
        {
          id: 'PO003',
          supplierName: '勐海茶厂',
          productName: '包装材料',
          quantity: 5000,
          unit: '套',
          price: 10,
          totalAmount: 50000,
          orderDate: '2024-03-03',
          expectedDate: '2024-03-20',
          status: '已完成',
          remark: '礼盒包装材料'
        },
        {
          id: 'PO004',
          supplierName: '临沧茶叶基地',
          productName: '红茶原料',
          quantity: 1500,
          unit: '公斤',
          price: 100,
          totalAmount: 150000,
          orderDate: '2024-03-04',
          expectedDate: '2024-03-25',
          status: '待审核',
          remark: '滇红茶原料采购'
        }
      ],
      suppliers: [
        { id: 'SP001', name: '云南茶叶供应商A' },
        { id: 'SP002', name: '云南茶叶供应商B' }
      ],
      dialogVisible: false,
      dialogTitle: '新建采购单',
      purchaseForm: {
        supplierName: '',
        productName: '',
        quantity: 1,
        price: 0,
        expectedDate: '',
        remark: ''
      },
      rules: {
        supplierName: [
          { required: true, message: '请选择供应商', trigger: 'change' }
        ],
        productName: [
          { required: true, message: '请选择采购产品', trigger: 'change' }
        ],
        quantity: [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入单价', trigger: 'blur' }
        ],
        expectedDate: [
          { required: true, message: '请选择预计到货日', trigger: 'change' }
        ]
      },
      currentPage: 1,
      pageSize: 10,
      detailDialogVisible: false,
      currentDetail: {},
      auditLogs: [
        {
          type: 'primary',
          timestamp: '2024-03-01 10:00:00',
          content: '创建采购单',
          operator: '张三'
        },
        {
          type: 'success',
          timestamp: '2024-03-01 14:30:00',
          content: '审核通过',
          operator: '李四'
        }
      ],
      // 添加图表相关数据
      chartType: 'amount',
      timeRange: '30',
      distributionType: 'supplier',
      rankingType: 'supplier',
      charts: {},
      
      // 添加排行榜数据
      rankingList: [
        { name: '云南茶叶供应商A', value: 320000, growth: 12.5 },
        { name: '普洱茶叶专业合作社', value: 240000, growth: 8.3 },
        { name: '勐海茶厂', value: 180000, growth: -5.2 },
        { name: '临沧茶叶基地', value: 150000, growth: 15.8 },
        { name: '大理茶叶合作社', value: 120000, growth: 6.7 }
      ],

      // 添加目标完成数据
      purchaseTargets: [
        { name: '月度采购额', actual: 520000, target: 600000 },
        { name: '供应商开发', actual: 8, target: 10 },
        { name: '成本节约率', actual: 85, target: 90 },
        { name: '按时交付率', actual: 95, target: 98 }
      ]
    }
  },
  computed: {
    filteredPurchases() {
      return this.purchases.filter(purchase => {
        const matchQuery = purchase.id.toLowerCase().includes(this.searchQuery.toLowerCase())
        const matchStatus = !this.statusFilter || purchase.status === this.statusFilter
        return matchQuery && matchStatus
      })
    }
  },
  methods: {
    getStatusType(status) {
      const statusMap = {
        '待审核': 'warning',
        '已审核': 'primary',
        '已完成': 'success'
      }
      return statusMap[status]
    },
    handleAdd() {
      this.dialogTitle = '新建采购单'
      this.purchaseForm = {
        supplierName: '',
        productName: '',
        quantity: 1,
        price: 0,
        expectedDate: '',
        remark: ''
      }
      this.dialogVisible = true
    },
    handleEdit(row) {
      this.dialogTitle = '编辑采购单'
      this.purchaseForm = { ...row }
      this.dialogVisible = true
    },
    handleApprove(row) {
      this.$confirm('确认审核通过该采购单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.purchases.findIndex(item => item.id === row.id)
        this.purchases[index].status = '已审核'
        this.$message.success('审核成功')
      })
    },
    handleSubmit() {
      this.$refs.purchaseForm.validate((valid) => {
        if (valid) {
          if (this.dialogTitle === '新建采购单') {
            this.purchases.push({
              id: 'PO' + (this.purchases.length + 1).toString().padStart(3, '0'),
              ...this.purchaseForm,
              totalAmount: this.purchaseForm.quantity * this.purchaseForm.price,
              orderDate: new Date().toISOString().split('T')[0],
              status: '待审核'
            })
          } else {
            const index = this.purchases.findIndex(item => item.id === this.purchaseForm.id)
            this.purchases[index] = {
              ...this.purchaseForm,
              totalAmount: this.purchaseForm.quantity * this.purchaseForm.price
            }
          }
          this.dialogVisible = false
          this.$message.success(this.dialogTitle + '成功')
        }
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    viewDetails(row) {
      this.currentDetail = { ...row }
      this.detailDialogVisible = true
    },
    formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    // 添加图表初始化方法
    initCharts() {
      // 销售趋势图
      const trendChart = echarts.init(this.$refs.trendChart)
      trendChart.setOption({
        title: {
          text: '采购趋势分析'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['本期', '同比']
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
            name: '本期',
            type: 'line',
            smooth: true,
            data: [150000, 230000, 224000, 218000, 135000, 147000]
          },
          {
            name: '同比',
            type: 'line',
            smooth: true,
            data: [120000, 200000, 210000, 190000, 120000, 130000]
          }
        ]
      })

      // 分布分析图
      const distributionChart = echarts.init(this.$refs.distributionChart)
      distributionChart.setOption({
        title: {
          text: '采购分布分析'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 10,
          data: ['茶叶原料', '包装材料', '生产设备', '其他']
        },
        series: [
          {
            name: '采购分布',
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
              { value: 735, name: '茶叶原料' },
              { value: 310, name: '包装材料' },
              { value: 234, name: '生产设备' },
              { value: 135, name: '其他' }
            ]
          }
        ]
      })

      this.charts = {
        trendChart,
        distributionChart
      }
    },

    // 计算目标完成进度
    calculateProgress(actual, target) {
      return Math.min(Math.round((actual / target) * 100), 100)
    },

    // 获取进度状态
    getProgressStatus(actual, target) {
      const progress = (actual / target) * 100
      if (progress >= 100) return 'success'
      if (progress >= 80) return ''
      return 'exception'
    }
  },
  mounted() {
    this.initCharts()
  },
  beforeUnmount() {
    // 销毁图表实例
    Object.values(this.charts).forEach(chart => chart?.dispose())
  }
}
</script>

<style scoped lang="scss">
.purchase-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 24px;
  
  .title {
    font-size: 20px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
  }
  
  .description {
    margin-top: 8px;
    color: rgba(0, 0, 0, 0.45);
  }
}

.data-overview {
  margin-bottom: 24px;
  
  .overview-card {
    height: 100%;
    
    .card-title {
      color: rgba(0, 0, 0, 0.45);
      font-size: 14px;
    }
    
    .card-value {
      margin-top: 4px;
      font-size: 24px;
      font-weight: 500;
    }
    
    .card-footer {
      margin-top: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: rgba(0, 0, 0, 0.45);
    }
  }
}

.toolbar {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .left {
    display: flex;
    gap: 8px;
  }
  
  .right {
    display: flex;
    gap: 8px;
  }
}

.trend-up {
  color: #52c41a;
}

.trend-down {
  color: #f5222d;
}

.table-card {
  margin-top: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.purchase-form {
  padding: 20px;
}

.detail-section {
  margin-top: 24px;

  h3 {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f0f0f0;
  }
}

.timeline-extra {
  font-size: 13px;
  color: #999;
  margin-top: 4px;
}

.dialog-footer {
  padding-top: 20px;
  text-align: right;
  border-top: 1px solid #f0f0f0;
}

// 添加图表相关样式
.analysis-section {
  margin: 20px 0;
}

.chart-card {
  .chart-container {
    height: 300px;
  }

  .chart-controls {
    display: flex;
    align-items: center;
  }
}

.ranking-card {
  .ranking-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .rank-info {
      display: flex;
      align-items: center;

      .rank-number {
        width: 24px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        background: #f5f5f5;
        border-radius: 12px;
        margin-right: 12px;
        font-size: 14px;

        &.top-three {
          color: #fff;
          background: linear-gradient(135deg, #ffd700 0%, #ffb000 100%);
        }
      }

      .rank-name {
        color: rgba(0, 0, 0, 0.85);
      }
    }

    .rank-data {
      text-align: right;

      .rank-value {
        display: block;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
      }

      .rank-percent {
        font-size: 12px;
        color: #f5222d;

        &.positive {
          color: #52c41a;
        }
      }
    }
  }
}

.target-card {
  .target-item {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }

    .target-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;

      .target-name {
        color: rgba(0, 0, 0, 0.85);
      }

      .target-progress {
        color: rgba(0, 0, 0, 0.45);
      }
    }
  }
}
</style> 