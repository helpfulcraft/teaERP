<template>
  <div class="process-container">
    <div class="toolbar">
      <el-button type="primary" @click="handleAdd">新增工艺流程</el-button>
      <el-input
        v-model="searchQuery"
        placeholder="请输入产品名称搜索"
        style="width: 200px; margin-left: 10px"
      />
      <el-select v-model="categoryFilter" placeholder="产品类别" style="margin-left: 10px">
        <el-option label="全部" value="" />
        <el-option label="普洱茶" value="普洱茶" />
        <el-option label="红茶" value="红茶" />
        <el-option label="绿茶" value="绿茶" />
      </el-select>
    </div>

    <el-table :data="filteredProcesses" style="width: 100%; margin-top: 20px">
      <el-table-column prop="id" label="工艺编号" width="120" />
      <el-table-column prop="productName" label="产品名称" width="150" />
      <el-table-column prop="category" label="产品类别" width="120" />
      <el-table-column prop="version" label="版本" width="100" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width="180" />
      <el-table-column label="操作" width="300">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button 
            size="small" 
            type="success"
            @click="viewSteps(scope.row)"
          >工艺步骤</el-button>
          <el-button 
            size="small" 
            type="warning"
            @click="viewQualityStandards(scope.row)"
          >质量标准</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 工艺流程表单对话框 -->
    <el-dialog 
      :title="dialogTitle" 
      v-model="dialogVisible"
      width="800px"
    >
      <el-form :model="processForm" :rules="rules" ref="processForm" label-width="100px">
        <el-form-item label="产品名称" prop="productName">
          <el-input v-model="processForm.productName" />
        </el-form-item>
        <el-form-item label="产品类别" prop="category">
          <el-select v-model="processForm.category">
            <el-option label="普洱茶" value="普洱茶" />
            <el-option label="红茶" value="红茶" />
            <el-option label="绿茶" value="绿茶" />
          </el-select>
        </el-form-item>
        <el-form-item label="工艺步骤">
          <div v-for="(step, index) in processForm.steps" :key="index" class="step-item">
            <el-card>
              <template #header>
                <div class="step-header">
                  <span>步骤 {{ index + 1 }}</span>
                  <el-button 
                    type="danger" 
                    circle 
                    icon="el-icon-delete"
                    @click="removeStep(index)"
                  />
                </div>
              </template>
              <el-form-item label="步骤名称">
                <el-input v-model="step.name" />
              </el-form-item>
              <el-form-item label="操作要求">
                <el-input type="textarea" v-model="step.requirements" rows="3" />
              </el-form-item>
              <el-form-item label="温度要求">
                <el-input-number v-model="step.temperature" :min="0" :max="100" />
                <span class="unit">°C</span>
              </el-form-item>
              <el-form-item label="时间要求">
                <el-input-number v-model="step.duration" :min="0" />
                <span class="unit">分钟</span>
              </el-form-item>
              <el-form-item label="质量检查点">
                <el-checkbox-group v-model="step.qualityChecks">
                  <el-checkbox label="外观">外观</el-checkbox>
                  <el-checkbox label="温度">温度</el-checkbox>
                  <el-checkbox label="湿度">湿度</el-checkbox>
                  <el-checkbox label="口感">口感</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-card>
          </div>
          <el-button type="primary" @click="addStep">添加步骤</el-button>
        </el-form-item>
        <el-form-item label="质量标准">
          <el-table :data="processForm.qualityStandards" border>
            <el-table-column prop="item" label="检查项目" width="150">
              <template #default="scope">
                <el-input v-model="scope.row.item" />
              </template>
            </el-table-column>
            <el-table-column prop="standard" label="标准要求">
              <template #default="scope">
                <el-input v-model="scope.row.standard" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button 
                  type="danger" 
                  circle 
                  icon="el-icon-delete"
                  @click="removeQualityStandard(scope.$index)"
                />
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" @click="addQualityStandard" style="margin-top: 10px">
            添加质量标准
          </el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 工艺步骤查看对话框 -->
    <el-dialog
      title="工艺步骤详情"
      v-model="stepsDialogVisible"
      width="600px"
    >
      <el-steps :active="activeStep" direction="vertical">
        <el-step 
          v-for="(step, index) in currentSteps" 
          :key="index"
          :title="step.name"
        >
          <template #description>
            <div class="step-description">
              <p><strong>操作要求：</strong>{{ step.requirements }}</p>
              <p><strong>温度要求：</strong>{{ step.temperature }}°C</p>
              <p><strong>时间要求：</strong>{{ step.duration }}分钟</p>
              <p><strong>质量检查点：</strong>{{ step.qualityChecks.join('、') }}</p>
            </div>
          </template>
        </el-step>
      </el-steps>
    </el-dialog>

    <!-- 质量标准查看对话框 -->
    <el-dialog
      title="质量标准详情"
      v-model="standardsDialogVisible"
      width="600px"
    >
      <el-table :data="currentStandards" border>
        <el-table-column prop="item" label="检查项目" width="150" />
        <el-table-column prop="standard" label="标准要求" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ProcessManagement',
  data() {
    return {
      searchQuery: '',
      categoryFilter: '',
      processes: [
        {
          id: 'P001',
          productName: '七子饼茶',
          category: '普洱茶',
          version: 'v1.0',
          status: '已发布',
          updateTime: '2024-03-01 10:00:00',
          steps: [
            {
              name: '萎凋',
              requirements: '自然萎凋，控制环境温度和湿度',
              temperature: 25,
              duration: 120,
              qualityChecks: ['外观', '温度', '湿度']
            },
            // 更多步骤...
          ],
          qualityStandards: [
            { item: '外观', standard: '条索紧结、色泽乌黑' },
            { item: '香气', standard: '陈香显露、纯正' }
          ]
        }
      ],
      dialogVisible: false,
      stepsDialogVisible: false,
      standardsDialogVisible: false,
      dialogTitle: '',
      activeStep: 0,
      currentSteps: [],
      currentStandards: [],
      processForm: {
        productName: '',
        category: '',
        steps: [],
        qualityStandards: []
      },
      rules: {
        productName: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择产品类别', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    filteredProcesses() {
      return this.processes.filter(process => {
        const matchQuery = process.productName.toLowerCase().includes(this.searchQuery.toLowerCase())
        const matchCategory = !this.categoryFilter || process.category === this.categoryFilter
        return matchQuery && matchCategory
      })
    }
  },
  methods: {
    getStatusType(status) {
      const statusMap = {
        '草稿': 'info',
        '已发���': 'success',
        '已停用': 'danger'
      }
      return statusMap[status]
    },
    handleAdd() {
      this.dialogTitle = '新增工艺流程'
      this.processForm = {
        productName: '',
        category: '',
        steps: [],
        qualityStandards: []
      }
      this.dialogVisible = true
    },
    handleEdit(row) {
      this.dialogTitle = '编辑工艺流程'
      this.processForm = { ...row }
      this.dialogVisible = true
    },
    viewSteps(row) {
      this.currentSteps = row.steps
      this.stepsDialogVisible = true
    },
    viewQualityStandards(row) {
      this.currentStandards = row.qualityStandards
      this.standardsDialogVisible = true
    },
    addStep() {
      this.processForm.steps.push({
        name: '',
        requirements: '',
        temperature: 25,
        duration: 30,
        qualityChecks: []
      })
    },
    removeStep(index) {
      this.processForm.steps.splice(index, 1)
    },
    addQualityStandard() {
      this.processForm.qualityStandards.push({
        item: '',
        standard: ''
      })
    },
    removeQualityStandard(index) {
      this.processForm.qualityStandards.splice(index, 1)
    },
    handleSubmit() {
      this.$refs.processForm.validate((valid) => {
        if (valid) {
          if (this.dialogTitle === '新增���艺流程') {
            this.processes.push({
              id: 'P' + (this.processes.length + 1).toString().padStart(3, '0'),
              ...this.processForm,
              version: 'v1.0',
              status: '草稿',
              updateTime: new Date().toLocaleString()
            })
          } else {
            const index = this.processes.findIndex(item => item.id === this.processForm.id)
            this.processes[index] = {
              ...this.processForm,
              updateTime: new Date().toLocaleString()
            }
          }
          this.dialogVisible = false
          this.$message.success(this.dialogTitle + '成功')
        }
      })
    }
  }
}
</script>

<style scoped>
.process-container {
  padding: 20px;
}

.toolbar {
  display: flex;
  align-items: center;
}

.step-item {
  margin-bottom: 20px;
}

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.unit {
  margin-left: 10px;
}

.step-description {
  text-align: left;
  padding: 10px;
  
  p {
    margin: 5px 0;
  }
}
</style> 