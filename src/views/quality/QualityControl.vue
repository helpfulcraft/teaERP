<template>
  <div class="quality-container">
    <div class="toolbar">
      <el-button type="primary" @click="handleAdd">新增质检记录</el-button>
      <el-input
        v-model="searchQuery"
        placeholder="请输入批次号或产品名称搜索"
        style="width: 200px; margin-left: 10px"
      />
      <el-select v-model="resultFilter" placeholder="检验结果" style="margin-left: 10px">
        <el-option label="全部" value="" />
        <el-option label="合格" value="合格" />
        <el-option label="不合格" value="不合格" />
      </el-select>
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="margin-left: 10px"
      />
    </div>

    <!-- 质量概览卡片 -->
    <el-row :gutter="20" class="statistics">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>本月检验批次</span>
            </div>
          </template>
          <div class="card-content">
            <h2>{{ statistics.monthlyBatches }}</h2>
            <p>较上月: {{ statistics.batchesGrowth }}%</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>合格率</span>
            </div>
          </template>
          <div class="card-content">
            <h2>{{ statistics.passRate }}%</h2>
            <p>较上月: {{ statistics.passRateGrowth }}%</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>待处理不合格</span>
            </div>
          </template>
          <div class="card-content">
            <h2>{{ statistics.pendingIssues }}</h2>
            <el-tag type="danger" v-if="statistics.pendingIssues > 0">需要处理</el-tag>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>质检完成率</span>
            </div>
          </template>
          <div class="card-content">
            <h2>{{ statistics.completionRate }}%</h2>
            <el-progress 
              :percentage="statistics.completionRate"
              :color="getProgressColor"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 质检记录表格 -->
    <el-table :data="filteredRecords" style="width: 100%; margin-top: 20px">
      <el-table-column prop="id" label="检验编号" width="120" />
      <el-table-column prop="batchNo" label="生产批次" width="120" />
      <el-table-column prop="productName" label="产品名称" width="150" />
      <el-table-column prop="inspectTime" label="检验时间" width="180" />
      <el-table-column prop="inspector" label="检验人" width="100" />
      <el-table-column prop="result" label="检验结果" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.result === '合格' ? 'success' : 'danger'">
            {{ scope.row.result }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template #default="scope">
          <el-button size="small" @click="viewDetail(scope.row)">详情</el-button>
          <el-button 
            size="small" 
            type="warning"
            v-if="scope.row.result === '不合格'"
            @click="handleIssue(scope.row)"
          >处理</el-button>
          <el-button 
            size="small" 
            type="primary"
            @click="viewReport(scope.row)"
          >报告</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑质检记录对话框 -->
    <el-dialog 
      :title="dialogTitle" 
      v-model="dialogVisible"
      width="800px"
    >
      <el-form :model="qualityForm" :rules="rules" ref="qualityForm" label-width="100px">
        <el-form-item label="生产批次" prop="batchNo">
          <el-select v-model="qualityForm.batchNo" filterable>
            <el-option 
              v-for="batch in productionBatches"
              :key="batch.id"
              :label="batch.batchNo"
              :value="batch.batchNo"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称" prop="productName">
          <el-input v-model="qualityForm.productName" disabled />
        </el-form-item>
        <el-form-item label="检验项目">
          <div v-for="(item, index) in qualityForm.items" :key="index" class="check-item">
            <el-card>
              <template #header>
                <div class="item-header">
                  <span>{{ item.name }}</span>
                  <el-tag :type="item.result === '合格' ? 'success' : 'danger'">
                    {{ item.result }}
                  </el-tag>
                </div>
              </template>
              <el-form-item label="检测值">
                <el-input v-model="item.value" />
              </el-form-item>
              <el-form-item label="标准范围">
                <el-input v-model="item.standard" disabled />
              </el-form-item>
              <el-form-item label="结果">
                <el-radio-group v-model="item.result">
                  <el-radio label="合格">合格</el-radio>
                  <el-radio label="不合格">不合格</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="备注">
                <el-input type="textarea" v-model="item.remark" rows="2" />
              </el-form-item>
            </el-card>
          </div>
        </el-form-item>
        <el-form-item label="检验结论" prop="conclusion">
          <el-input type="textarea" v-model="qualityForm.conclusion" rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 问题处理对话框 -->
    <el-dialog
      title="质量问题处理"
      v-model="issueDialogVisible"
      width="600px"
    >
      <el-form :model="issueForm" label-width="100px">
        <el-form-item label="问题描述">
          <el-input type="textarea" v-model="issueForm.description" rows="3" disabled />
        </el-form-item>
        <el-form-item label="处理方案">
          <el-input type="textarea" v-model="issueForm.solution" rows="3" />
        </el-form-item>
        <el-form-item label="处理人">
          <el-input v-model="issueForm.handler" />
        </el-form-item>
        <el-form-item label="处理时间">
          <el-date-picker
            v-model="issueForm.handleTime"
            type="datetime"
            placeholder="选择日期时间"
          />
        </el-form-item>
        <el-form-item label="处理结果">
          <el-radio-group v-model="issueForm.result">
            <el-radio label="已解决">已解决</el-radio>
            <el-radio label="待观察">待观察</el-radio>
            <el-radio label="无法解决">无法解决</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="issueDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitIssue">确定</el-button>
      </template>
    </el-dialog>

    <!-- 添加质检详情对话框 -->
    <el-dialog
      title="质检详情"
      v-model="detailDialogVisible"
      width="800px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="检验编号">{{ currentDetail.id }}</el-descriptions-item>
        <el-descriptions-item label="生产批次">{{ currentDetail.batchNo }}</el-descriptions-item>
        <el-descriptions-item label="产品名称">{{ currentDetail.productName }}</el-descriptions-item>
        <el-descriptions-item label="检验时间">{{ currentDetail.inspectTime }}</el-descriptions-item>
        <el-descriptions-item label="检验人">{{ currentDetail.inspector }}</el-descriptions-item>
        <el-descriptions-item label="检验结果">
          <el-tag :type="currentDetail.result === '合格' ? 'success' : 'danger'">
            {{ currentDetail.result }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <!-- 检验项目详情 -->
      <div class="detail-section">
        <h3>检验项目</h3>
        <el-table :data="checkItems" style="width: 100%">
          <el-table-column prop="name" label="检验项目" width="150" />
          <el-table-column prop="standard" label="标准要求" width="200" />
          <el-table-column prop="value" label="检测值" width="150" />
          <el-table-column prop="result" label="结果" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.result === '合格' ? 'success' : 'danger'">
                {{ scope.row.result }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" />
        </el-table>
      </div>

      <!-- 附件信息 -->
      <div class="detail-section">
        <h3>检验附件</h3>
        <el-upload
          action="#"
          :file-list="attachments"
          :disabled="true"
        >
          <template #file="{ file }">
            <el-link type="primary" @click="downloadFile(file)">{{ file.name }}</el-link>
          </template>
        </el-upload>
      </div>
    </el-dialog>

    <!-- 添加质检报告对话框 -->
    <el-dialog
      title="质检报告"
      v-model="reportDialogVisible"
      width="800px"
    >
      <div class="report-header">
        <h2>产品质量检验��告</h2>
        <p>报告编号：{{ currentReport.reportNo }}</p>
        <p>检验日期：{{ currentReport.inspectDate }}</p>
      </div>

      <el-divider />

      <!-- 基本信息 -->
      <div class="report-section">
        <h3>基本信息</h3>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="产品名称">{{ currentReport.productName }}</el-descriptions-item>
          <el-descriptions-item label="生产批次">{{ currentReport.batchNo }}</el-descriptions-item>
          <el-descriptions-item label="生产日期">{{ currentReport.productionDate }}</el-descriptions-item>
          <el-descriptions-item label="检验类型">{{ currentReport.inspectType }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 检验结果 -->
      <div class="report-section">
        <h3>检验结果</h3>
        <el-table :data="currentReport.checkItems" border style="width: 100%">
          <el-table-column prop="name" label="检验项目" width="150" />
          <el-table-column prop="standard" label="标准要求" width="200" />
          <el-table-column prop="value" label="检测值" width="150" />
          <el-table-column prop="result" label="结果" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.result === '合格' ? 'success' : 'danger'">
                {{ scope.row.result }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 结论 -->
      <div class="report-section">
        <h3>检验结论</h3>
        <div class="conclusion">
          <p>{{ currentReport.conclusion }}</p>
          <div class="signature">
            <p>检验人：{{ currentReport.inspector }}</p>
            <p>审核人：{{ currentReport.reviewer }}</p>
            <p>日期：{{ currentReport.reportDate }}</p>
          </div>
        </div>
      </div>

      <div class="dialog-footer">
        <el-button type="primary" @click="printReport">打印报告</el-button>
        <el-button type="success" @click="exportPDF">导出PDF</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'QualityControl',
  data() {
    return {
      searchQuery: '',
      resultFilter: '',
      dateRange: [],
      statistics: {
        monthlyBatches: 156,
        batchesGrowth: 5.2,
        passRate: 98.5,
        passRateGrowth: 0.3,
        pendingIssues: 2,
        completionRate: 95
      },
      records: [
        {
          id: 'QC001',
          batchNo: 'B20240301001',
          productName: '七子饼茶',
          inspectTime: '2024-03-01 14:30:00',
          inspector: '张三',
          result: '合格'
        },
        {
          id: 'QC002',
          batchNo: 'B20240301002',
          productName: '普洱散茶',
          inspectTime: '2024-03-01 15:30:00',
          inspector: '李四',
          result: '合格'
        },
        {
          id: 'QC003',
          batchNo: 'B20240302001',
          productName: '滇红茶',
          inspectTime: '2024-03-02 09:30:00',
          inspector: '王五',
          result: '不合格'
        },
        {
          id: 'QC004',
          batchNo: 'B20240302002',
          productName: '七子饼茶',
          inspectTime: '2024-03-02 10:30:00',
          inspector: '赵六',
          result: '合格'
        }
      ],
      productionBatches: [
        { id: 'B001', batchNo: 'B20240301001', productName: '七子饼茶' }
      ],
      dialogVisible: false,
      issueDialogVisible: false,
      dialogTitle: '',
      qualityForm: {
        batchNo: '',
        productName: '',
        items: [
          {
            name: '外观',
            value: '',
            standard: '条索紧结、色泽乌黑',
            result: '合格',
            remark: ''
          }
        ],
        conclusion: ''
      },
      issueForm: {
        description: '',
        solution: '',
        handler: '',
        handleTime: '',
        result: '待观察'
      },
      rules: {
        batchNo: [
          { required: true, message: '请选择生产批次', trigger: 'change' }
        ],
        conclusion: [
          { required: true, message: '请输入检验结论', trigger: 'blur' }
        ]
      },
      detailDialogVisible: false,
      reportDialogVisible: false,
      currentDetail: {},
      currentReport: {},
      checkItems: [
        {
          name: '外观',
          standard: '条索紧结、色泽乌黑',
          value: '符合标准',
          result: '合格',
          remark: ''
        },
        {
          name: '水分',
          standard: '≤6.5%',
          value: '6.2%',
          result: '合格',
          remark: ''
        }
      ],
      attachments: [
        { name: '检验原始记录.pdf', url: '#' },
        { name: '检验照片.zip', url: '#' }
      ]
    }
  },
  computed: {
    filteredRecords() {
      return this.records.filter(record => {
        const matchQuery = record.batchNo.includes(this.searchQuery) ||
                         record.productName.toLowerCase().includes(this.searchQuery.toLowerCase())
        const matchResult = !this.resultFilter || record.result === this.resultFilter
        return matchQuery && matchResult
      })
    },
    getProgressColor() {
      if (this.statistics.completionRate >= 90) return '#67C23A'
      if (this.statistics.completionRate >= 70) return '#E6A23C'
      return '#F56C6C'
    }
  },
  methods: {
    handleAdd() {
      this.dialogTitle = '新增质检记录'
      this.qualityForm = {
        batchNo: '',
        productName: '',
        items: [
          {
            name: '外观',
            value: '',
            standard: '条索紧结、色泽乌黑',
            result: '合格',
            remark: ''
          }
        ],
        conclusion: ''
      }
      this.dialogVisible = true
    },
    viewDetail(row) {
      this.currentDetail = {
        ...row,
        checkItems: this.checkItems
      }
      this.detailDialogVisible = true
    },
    handleIssue(row) {
      this.issueForm = {
        description: `批次${row.batchNo}质量问题`,
        solution: '',
        handler: '',
        handleTime: '',
        result: '待观察'
      }
      this.issueDialogVisible = true
    },
    viewReport(row) {
      this.currentReport = {
        reportNo: 'QR' + row.id,
        productName: row.productName,
        batchNo: row.batchNo,
        productionDate: '2024-01-01',
        inspectType: '成品检验',
        inspectDate: row.inspectTime,
        checkItems: this.checkItems,
        conclusion: '该批次产品经检验各项指标均符合标准要求，判定为合格品。',
        inspector: row.inspector,
        reviewer: '王五',
        reportDate: new Date().toLocaleDateString()
      }
      this.reportDialogVisible = true
    },
    handleSubmit() {
      this.$refs.qualityForm.validate((valid) => {
        if (valid) {
          // 提交质检记录
          this.dialogVisible = false
          this.$message.success('保存成功')
        }
      })
    },
    submitIssue() {
      // 提交问题处理
      this.issueDialogVisible = false
      this.$message.success('问题处理已提交')
    },
    downloadFile(file) {
      this.$message.success('开始下载：' + file.name)
    },
    printReport() {
      window.print()
    },
    exportPDF() {
      this.$message.success('报告已导出为PDF文件')
    }
  }
}
</script>

<style scoped>
.quality-container {
  padding: 20px;
}

.toolbar {
  display: flex;
  align-items: center;
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

.check-item {
  margin-bottom: 20px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-section {
  margin-top: 20px;
  
  h3 {
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
}

.report-header {
  text-align: center;
  margin-bottom: 20px;

  h2 {
    margin-bottom: 10px;
  }

  p {
    margin: 5px 0;
    color: #666;
  }
}

.report-section {
  margin: 20px 0;

  h3 {
    margin-bottom: 15px;
  }
}

.conclusion {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 4px;

  .signature {
    margin-top: 30px;
    text-align: right;

    p {
      margin: 5px 0;
    }
  }
}

.dialog-footer {
  margin-top: 20px;
  text-align: center;
}

@media print {
  .dialog-footer {
    display: none;
  }
}
</style> 