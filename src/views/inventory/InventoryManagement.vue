<template>
  <div class="inventory-container">
    <div class="toolbar">
      <el-button type="primary" @click="handleStockIn">入库</el-button>
      <el-button type="warning" @click="handleStockOut">出库</el-button>
      <el-input
        v-model="searchQuery"
        placeholder="请输入产品名称搜索"
        style="width: 200px; margin-left: 10px"
      />
      <el-button type="info" @click="handleInventoryCheck" style="margin-left: 10px">
        库存盘点
      </el-button>
    </div>

    <el-table :data="filteredInventory" style="width: 100%; margin-top: 20px">
      <el-table-column prop="id" label="产品编号" width="120" />
      <el-table-column prop="name" label="产品名称" width="180" />
      <el-table-column prop="category" label="类别" width="120" />
      <el-table-column prop="quantity" label="库存数量" width="120" />
      <el-table-column prop="unit" label="单位" width="80" />
      <el-table-column prop="location" label="库位" width="120" />
      <el-table-column prop="warningLevel" label="预警水平" width="120">
        <template #default="scope">
          <el-tag 
            :type="scope.row.quantity <= scope.row.warningLevel ? 'danger' : 'success'"
          >
            {{ scope.row.warningLevel }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="lastCheckDate" label="最后盘点日期" width="120" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button size="small" @click="handleDetail(scope.row)">详情</el-button>
          <el-button 
            size="small" 
            type="warning" 
            @click="handleAdjust(scope.row)"
          >调整</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 入库/出库表单对话框 -->
    <el-dialog 
      :title="dialogTitle" 
      v-model="dialogVisible"
      width="500px"
    >
      <el-form :model="stockForm" :rules="rules" ref="stockForm" label-width="100px">
        <el-form-item label="产品" prop="productId">
          <el-select v-model="stockForm.productId" filterable>
            <el-option 
              v-for="item in inventory"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input-number v-model="stockForm.quantity" :min="1" />
        </el-form-item>
        <el-form-item label="库位" prop="location">
          <el-input v-model="stockForm.location" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input 
            type="textarea"
            v-model="stockForm.remark"
            rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 添加库存详情对话框 -->
    <el-dialog
      title="库存详情"
      v-model="detailDialogVisible"
      width="800px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="产品编号">{{ currentDetail.id }}</el-descriptions-item>
        <el-descriptions-item label="产品名称">{{ currentDetail.name }}</el-descriptions-item>
        <el-descriptions-item label="当前库存">{{ currentDetail.quantity }} {{ currentDetail.unit }}</el-descriptions-item>
        <el-descriptions-item label="库位">{{ currentDetail.location }}</el-descriptions-item>
        <el-descriptions-item label="最后盘点日期">{{ currentDetail.lastCheckDate }}</el-descriptions-item>
        <el-descriptions-item label="预警水平">{{ currentDetail.warningLevel }} {{ currentDetail.unit }}</el-descriptions-item>
      </el-descriptions>

      <!-- 库存变动记录 -->
      <div class="detail-section">
        <h3>库存变动记录</h3>
        <el-table :data="stockRecords" style="width: 100%">
          <el-table-column prop="date" label="日期" width="150" />
          <el-table-column prop="type" label="类型" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.type === '入库' ? 'success' : 'warning'">
                {{ scope.row.type }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" width="120" />
          <el-table-column prop="operator" label="操作人" width="120" />
          <el-table-column prop="remark" label="备注" />
        </el-table>
      </div>

      <!-- 质量信息 -->
      <div class="detail-section">
        <h3>质量信息</h3>
        <el-form label-width="120px">
          <el-form-item label="保质期">
            {{ currentDetail.shelfLife || '未设置' }}
          </el-form-item>
          <el-form-item label="生产日期">
            {{ currentDetail.productionDate || '未设置' }}
          </el-form-item>
          <el-form-item label="质检状态">
            <el-tag :type="currentDetail.qualityStatus === '合格' ? 'success' : 'danger'">
              {{ currentDetail.qualityStatus || '未检验' }}
            </el-tag>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'InventoryManagement',
  data() {
    return {
      searchQuery: '',
      inventory: [
        {
          id: 'P001',
          name: '七子饼茶',
          category: '成品',
          quantity: 1000,
          unit: '饼',
          location: 'A-01-01',
          warningLevel: 500,
          lastCheckDate: '2024-03-01'
        },
        {
          id: 'P002',
          name: '普洱散茶',
          category: '成品',
          quantity: 2000,
          unit: '公斤',
          location: 'A-01-02',
          warningLevel: 800,
          lastCheckDate: '2024-03-01'
        },
        {
          id: 'P003',
          name: '滇红茶',
          category: '成品',
          quantity: 1500,
          unit: '公斤',
          location: 'A-02-01',
          warningLevel: 600,
          lastCheckDate: '2024-03-01'
        },
        {
          id: 'P004',
          name: '茶叶原料',
          category: '原料',
          quantity: 5000,
          unit: '公斤',
          location: 'B-01-01',
          warningLevel: 2000,
          lastCheckDate: '2024-03-01'
        },
        {
          id: 'P005',
          name: '包装材料',
          category: '辅料',
          quantity: 10000,
          unit: '套',
          location: 'C-01-01',
          warningLevel: 3000,
          lastCheckDate: '2024-03-01'
        }
      ],
      dialogVisible: false,
      dialogTitle: '',
      stockForm: {
        productId: '',
        quantity: 1,
        location: '',
        remark: ''
      },
      rules: {
        productId: [
          { required: true, message: '请选择产品', trigger: 'change' }
        ],
        quantity: [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ],
        location: [
          { required: true, message: '请输入库位', trigger: 'blur' }
        ]
      },
      detailDialogVisible: false,
      currentDetail: {},
      stockRecords: [
        {
          date: '2024-03-01 10:00:00',
          type: '入库',
          quantity: 100,
          operator: '张三',
          remark: '采购入库'
        },
        {
          date: '2024-03-02 14:30:00',
          type: '出库',
          quantity: 50,
          operator: '李四',
          remark: '销售出库'
        }
      ]
    }
  },
  computed: {
    filteredInventory() {
      return this.inventory.filter(item =>
        item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    }
  },
  methods: {
    handleStockIn() {
      this.dialogTitle = '入库'
      this.stockForm = {
        productId: '',
        quantity: 1,
        location: '',
        remark: ''
      }
      this.dialogVisible = true
    },
    handleStockOut() {
      this.dialogTitle = '出库'
      this.stockForm = {
        productId: '',
        quantity: 1,
        location: '',
        remark: ''
      }
      this.dialogVisible = true
    },
    handleInventoryCheck() {
      this.$confirm('确认开始库存盘点?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 实际项目中这里需要调用后端API
        this.inventory.forEach(item => {
          item.lastCheckDate = new Date().toISOString().split('T')[0]
        })
        this.$message.success('盘点完成')
      })
    },
    handleDetail(row) {
      this.currentDetail = {
        ...row,
        shelfLife: '24个月',
        productionDate: '2024-01-01',
        qualityStatus: '合格'
      }
      this.detailDialogVisible = true
      
      // 在实际项目中，这里应该调用API获取详细信息
      // this.loadStockRecords(row.id)
      // this.loadQualityInfo(row.id)
    },
    handleAdjust(row) {
      this.dialogTitle = '库存调整'
      this.stockForm = {
        productId: row.id,
        quantity: row.quantity,
        location: row.location,
        remark: ''
      }
      this.dialogVisible = true
    },
    handleSubmit() {
      this.$refs.stockForm.validate((valid) => {
        if (valid) {
          const product = this.inventory.find(item => item.id === this.stockForm.productId)
          if (this.dialogTitle === '入库') {
            product.quantity += this.stockForm.quantity
          } else if (this.dialogTitle === '出库') {
            if (product.quantity < this.stockForm.quantity) {
              this.$message.error('库存不足')
              return
            }
            product.quantity -= this.stockForm.quantity
          } else if (this.dialogTitle === '库存调整') {
            product.quantity = this.stockForm.quantity
            product.location = this.stockForm.location
          }
          this.dialogVisible = false
          this.$message.success(this.dialogTitle + '成功')
        }
      })
    },
    // 加载库存变动记录
    loadStockRecords(productId) {
      // 调用API获取库存变动记录
      // this.stockRecords = await api.getStockRecords(productId)
    },
    // 加载质量信息
    loadQualityInfo(productId) {
      // 调用API获取质量信息
      // const qualityInfo = await api.getQualityInfo(productId)
      // this.currentDetail = { ...this.currentDetail, ...qualityInfo }
    }
  }
}
</script>

<style scoped>
.inventory-container {
  padding: 20px;
}

.toolbar {
  display: flex;
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

.el-descriptions {
  margin: 20px 0;
}
</style> 