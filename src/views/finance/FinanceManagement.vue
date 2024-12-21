<template>
  <div class="finance-container">
    <div class="toolbar">
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :shortcuts="dateShortcuts"
      />
      <el-select v-model="accountType" placeholder="账户类型" style="margin-left: 10px">
        <el-option label="全部" value="" />
        <el-option label="收入" value="收入" />
        <el-option label="支出" value="支出" />
      </el-select>
    </div>

    <!-- 财务概览 -->
    <el-row :gutter="20" class="statistics">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>本月收入</span>
              <el-tag type="success">{{ compareWithLastMonth(statistics.monthlyIncome) }}</el-tag>
            </div>
          </template>
          <div class="card-content">
            <h2>¥ {{ formatNumber(statistics.monthlyIncome) }}</h2>
            <p>较上月: {{ calculateGrowth(statistics.monthlyIncome, statistics.lastMonthIncome) }}%</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>本月支出</span>
              <el-tag type="danger">{{ compareWithLastMonth(statistics.monthlyExpense) }}</el-tag>
            </div>
          </template>
          <div class="card-content">
            <h2>¥ {{ formatNumber(statistics.monthlyExpense) }}</h2>
            <p>较上月: {{ calculateGrowth(statistics.monthlyExpense, statistics.lastMonthExpense) }}%</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>利润率</span>
              <el-tag type="warning">{{ statistics.profitRate }}%</el-tag>
            </div>
          </template>
          <div class="card-content">
            <h2>{{ statistics.profitRate }}%</h2>
            <p>较上月: {{ calculateGrowth(statistics.profitRate, statistics.lastMonthProfitRate) }}%</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>待处理账单</span>
            </div>
          </template>
          <div class="card-content">
            <h2>{{ statistics.pendingBills }}</h2>
            <el-tag type="info">需要审核</el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 财务报表 -->
    <el-tabs v-model="activeTab" class="finance-tabs">
      <el-tab-pane label="收支明细" name="transactions">
        <div class="table-actions">
          <el-button type="primary" @click="handleAddTransaction">新增记录</el-button>
          <el-button type="success" @click="exportData">导出Excel</el-button>
        </div>
        <el-table :data="filteredTransactions" style="width: 100%">
          <el-table-column prop="date" label="日期" width="120" />
          <el-table-column prop="type" label="类型" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.type === '收入' ? 'success' : 'danger'">
                {{ scope.row.type }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="category" label="类别" width="120" />
          <el-table-column prop="amount" label="金额" width="120">
            <template #default="scope">
              {{ formatNumber(scope.row.amount) }}
            </template>
          </el-table-column>
          <el-table-column prop="description" label="说明" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button 
                size="small" 
                @click="handleEdit(scope.row)"
                :disabled="scope.row.status === '已审核'"
              >编辑</el-button>
              <el-button 
                size="small" 
                type="success"
                v-if="scope.row.status === '待审核'"
                @click="handleApprove(scope.row)"
              >审核</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      
      <el-tab-pane label="成本分析" name="cost">
        <div class="chart-container">
          <div ref="costChart" class="chart"></div>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="预算管理" name="budget">
        <div class="budget-section">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-card>
                <template #header>
                  <div class="card-header">
                    <span>部门预算执行情况</span>
                  </div>
                </template>
                <el-table :data="departmentBudgets">
                  <el-table-column prop="department" label="部门" />
                  <el-table-column prop="budget" label="预算" />
                  <el-table-column prop="actual" label="实际支出" />
                  <el-table-column prop="execution" label="执行率">
                    <template #default="scope">
                      <el-progress 
                        :percentage="scope.row.execution"
                        :status="getExecutionStatus(scope.row.execution)"
                      />
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card>
                <template #header>
                  <div class="card-header">
                    <span>预算设置</span>
                  </div>
                </template>
                <el-form :model="budgetForm" label-width="100px">
                  <el-form-item label="部门">
                    <el-select v-model="budgetForm.department">
                      <el-option label="生产部" value="生产部" />
                      <el-option label="销售部" value="销售部" />
                      <el-option label="采购部" value="采购部" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="预算金额">
                    <el-input-number v-model="budgetForm.amount" :min="0" />
                  </el-form-item>
                  <el-form-item label="预算周期">
                    <el-date-picker
                      v-model="budgetForm.period"
                      type="monthrange"
                      range-separator="至"
                      start-placeholder="开始月份"
                      end-placeholder="结束月份"
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="saveBudget">保存预算</el-button>
                  </el-form-item>
                </el-form>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 新增/编辑记录对话框 -->
    <el-dialog 
      :title="dialogTitle" 
      v-model="dialogVisible"
      width="500px"
    >
      <el-form :model="transactionForm" :rules="rules" ref="transactionForm" label-width="100px">
        <el-form-item label="类型" prop="type">
          <el-select v-model="transactionForm.type">
            <el-option label="收入" value="收入" />
            <el-option label="支出" value="支出" />
          </el-select>
        </el-form-item>
        <el-form-item label="类别" prop="category">
          <el-select v-model="transactionForm.category">
            <el-option 
              v-for="category in categories[transactionForm.type]"
              :key="category"
              :label="category"
              :value="category"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="amount">
          <el-input-number v-model="transactionForm.amount" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="日期" prop="date">
          <el-date-picker
            v-model="transactionForm.date"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="说���" prop="description">
          <el-input type="textarea" v-model="transactionForm.description" rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitTransaction">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'FinanceManagement',
  data() {
    return {
      dateRange: [],
      accountType: '',
      activeTab: 'transactions',
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
      statistics: {
        monthlyIncome: 2500000,
        lastMonthIncome: 2300000,
        monthlyExpense: 1800000,
        lastMonthExpense: 1700000,
        profitRate: 28,
        lastMonthProfitRate: 26,
        pendingBills: 5
      },
      transactions: [
        {
          date: '2024-03-01',
          type: '收入',
          category: '销售收入',
          amount: 50000,
          description: '茶叶销售',
          status: '已审核'
        }
      ],
      departmentBudgets: [
        {
          department: '生产部',
          budget: 1000000,
          actual: 800000,
          execution: 80
        }
      ],
      dialogVisible: false,
      dialogTitle: '',
      transactionForm: {
        type: '收入',
        category: '',
        amount: 0,
        date: '',
        description: ''
      },
      budgetForm: {
        department: '',
        amount: 0,
        period: []
      },
      categories: {
        收入: ['销售收入', '其他收入'],
        支出: ['原料采购', '人工费用', '运营费用', '其他支出']
      },
      rules: {
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        category: [
          { required: true, message: '请选择类别', trigger: 'change' }
        ],
        amount: [
          { required: true, message: '请输入金额', trigger: 'blur' }
        ],
        date: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ]
      },
      costChart: null
    }
  },
  computed: {
    filteredTransactions() {
      return this.transactions.filter(transaction => {
        const matchType = !this.accountType || transaction.type === this.accountType
        return matchType
      })
    }
  },
  mounted() {
    this.initCostChart()
  },
  beforeUnmount() {
    if (this.costChart) {
      this.costChart.dispose()
    }
  },
  methods: {
    formatNumber(num) {
      return num.toLocaleString()
    },
    calculateGrowth(current, last) {
      return ((current - last) / last * 100).toFixed(2)
    },
    compareWithLastMonth(current) {
      return current >= this.statistics.lastMonthIncome ? '↑ 上升' : '↓ 下降'
    },
    getStatusType(status) {
      const statusMap = {
        '待审核': 'warning',
        '已审核': 'success',
        '已拒绝': 'danger'
      }
      return statusMap[status]
    },
    getExecutionStatus(execution) {
      if (execution > 100) return 'exception'
      if (execution >= 80) return 'success'
      return ''
    },
    handleAddTransaction() {
      this.dialogTitle = '新增记录'
      this.transactionForm = {
        type: '收入',
        category: '',
        amount: 0,
        date: new Date(),
        description: ''
      }
      this.dialogVisible = true
    },
    handleEdit(row) {
      this.dialogTitle = '编辑记录'
      this.transactionForm = { ...row }
      this.dialogVisible = true
    },
    handleApprove(row) {
      this.$confirm('确认审核通过该记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.transactions.findIndex(item => item === row)
        this.transactions[index].status = '已审核'
        this.$message.success('审核成功')
      })
    },
    submitTransaction() {
      this.$refs.transactionForm.validate((valid) => {
        if (valid) {
          if (this.dialogTitle === '新增记录') {
            this.transactions.push({
              ...this.transactionForm,
              status: '待审核'
            })
          } else {
            const index = this.transactions.findIndex(item => item.date === this.transactionForm.date)
            this.transactions[index] = { ...this.transactionForm }
          }
          this.dialogVisible = false
          this.$message.success(this.dialogTitle + '成功')
        }
      })
    },
    saveBudget() {
      this.$message.success('预算设置已保存')
    },
    exportData() {
      this.$message.success('数据导出成功')
    },
    initCostChart() {
      this.costChart = echarts.init(this.$refs.costChart)
      this.costChart.setOption({
        title: {
          text: '成本构成分析'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 10,
          data: ['原料成本', '人工成本', '制造费用', '管理费用', '销售费用']
        },
        series: [
          {
            name: '成本构成',
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
              { value: 335, name: '原料成本' },
              { value: 310, name: '人工成本' },
              { value: 234, name: '制造费用' },
              { value: 135, name: '管理费用' },
              { value: 1548, name: '销售费用' }
            ]
          }
        ]
      })
    }
  }
}
</script>

<style scoped>
.finance-container {
  padding: 20px;
}

.toolbar {
  margin-bottom: 20px;
}

.statistics {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content {
  text-align: center;
  
  h2 {
    margin: 10px 0;
    font-size: 24px;
  }
  
  p {
    color: #666;
    margin: 0;
  }
}

.finance-tabs {
  margin-top: 20px;
}

.table-actions {
  margin-bottom: 20px;
}

.chart-container {
  height: 400px;
  
  .chart {
    width: 100%;
    height: 100%;
  }
}

.budget-section {
  margin-top: 20px;
}
</style> 