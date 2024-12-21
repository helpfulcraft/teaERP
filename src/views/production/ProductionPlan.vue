<template>
  <div class="production-plan">
    <div class="toolbar">
      <el-button type="primary" @click="createPlan">新建生产计划</el-button>
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="margin-left: 10px"
      />
    </div>

    <el-table :data="productionPlans" style="width: 100%; margin-top: 20px">
      <el-table-column prop="id" label="计划编号" width="120" />
      <el-table-column prop="productName" label="产品名称" width="180" />
      <el-table-column prop="quantity" label="计划数量" width="120" />
      <el-table-column prop="startDate" label="开始日期" width="120" />
      <el-table-column prop="endDate" label="结束日期" width="120" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button size="small" @click="editPlan(scope.row)">编辑</el-button>
          <el-button 
            size="small" 
            type="danger" 
            @click="deletePlan(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 生产计划表单对话框 -->
    <el-dialog 
      :title="dialogTitle" 
      v-model="dialogVisible"
      width="500px"
    >
      <el-form :model="planForm" label-width="100px">
        <el-form-item label="产品名称">
          <el-select v-model="planForm.productName">
            <el-option label="七子饼茶" value="七子饼茶" />
            <el-option label="普洱茶" value="普洱茶" />
            <el-option label="红茶" value="红茶" />
          </el-select>
        </el-form-item>
        <el-form-item label="计划数量">
          <el-input-number v-model="planForm.quantity" :min="1" />
        </el-form-item>
        <el-form-item label="生产日期">
          <el-date-picker
            v-model="planForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="planForm.status">
            <el-option label="未开始" value="未开始" />
            <el-option label="进行中" value="进行中" />
            <el-option label="已完成" value="已完成" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitPlan">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ProductionPlan',
  data() {
    return {
      dateRange: [],
      productionPlans: [
        {
          id: 'PP001',
          productName: '七子饼茶',
          quantity: 1000,
          startDate: '2024-03-01',
          endDate: '2024-03-10',
          status: '进行中'
        },
        // 更多生产计划数据...
      ],
      dialogVisible: false,
      dialogTitle: '新建生产计划',
      planForm: {
        productName: '',
        quantity: 1,
        dateRange: [],
        status: '未开始'
      }
    }
  },
  methods: {
    getStatusType(status) {
      const statusMap = {
        '未开始': 'info',
        '进行中': 'warning',
        '已完成': 'success'
      }
      return statusMap[status]
    },
    createPlan() {
      this.dialogTitle = '新建生产计划'
      this.planForm = {
        productName: '',
        quantity: 1,
        dateRange: [],
        status: '未开始'
      }
      this.dialogVisible = true
    },
    editPlan(row) {
      this.dialogTitle = '编辑生产计划'
      this.planForm = {
        ...row,
        dateRange: [row.startDate, row.endDate]
      }
      this.dialogVisible = true
    },
    deletePlan(row) {
      this.$confirm('确认删除该生产计划?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.productionPlans.findIndex(item => item.id === row.id)
        this.productionPlans.splice(index, 1)
        this.$message.success('删除成功')
      })
    },
    submitPlan() {
      if (this.dialogTitle === '新建生产计划') {
        this.productionPlans.push({
          id: 'PP' + (this.productionPlans.length + 1).toString().padStart(3, '0'),
          productName: this.planForm.productName,
          quantity: this.planForm.quantity,
          startDate: this.planForm.dateRange[0],
          endDate: this.planForm.dateRange[1],
          status: this.planForm.status
        })
      } else {
        const index = this.productionPlans.findIndex(item => item.id === this.planForm.id)
        this.productionPlans[index] = {
          ...this.planForm,
          startDate: this.planForm.dateRange[0],
          endDate: this.planForm.dateRange[1]
        }
      }
      this.dialogVisible = false
      this.$message.success(this.dialogTitle + '成功')
    }
  }
}
</script>

<style scoped>
.production-plan {
  padding: 20px;
}

.toolbar {
  display: flex;
  align-items: center;
}
</style> 