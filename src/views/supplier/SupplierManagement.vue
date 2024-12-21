<template>
  <div class="supplier-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="title">供应商管理</div>
      <div class="description">管理和维护茶叶供应商信息</div>
    </div>

    <!-- 数据概览 -->
    <el-row :gutter="20" class="data-overview">
      <el-col :span="6">
        <el-card shadow="hover" class="overview-card">
          <div class="card-title">供应商总数</div>
          <div class="card-value">{{ suppliers.length }}</div>
          <div class="card-footer">
            <span>较上月</span>
            <span class="trend-up">+2.5%</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="overview-card">
          <div class="card-title">活跃供应商</div>
          <div class="card-value">{{ suppliers.filter(s => s.status === '正常').length }}</div>
          <div class="card-footer">
            <span>占比</span>
            <span>{{ ((suppliers.filter(s => s.status === '正常').length / suppliers.length) * 100).toFixed(1) }}%</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="overview-card">
          <div class="card-title">本月新增</div>
          <div class="card-value">3</div>
          <div class="card-footer">
            <span>较上月</span>
            <span class="trend-up">+1</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="overview-card">
          <div class="card-title">待审核</div>
          <div class="card-value">2</div>
          <div class="card-footer">
            <el-tag size="small" type="warning">需要处理</el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="left">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>新增供应商
        </el-button>
        <el-input
          v-model="searchQuery"
          placeholder="请输入供应商名称搜索"
          prefix-icon="Search"
          style="width: 250px"
        />
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

    <!-- 供应商表格 -->
    <el-card shadow="never" class="table-card">
      <el-table 
        :data="filteredSuppliers" 
        style="width: 100%"
        border
        stripe
        highlight-current-row
      >
        <el-table-column prop="id" label="供应商编号" width="120" />
        <el-table-column prop="name" label="供应商名称" width="180" />
        <el-table-column prop="contact" label="联系人" width="120" />
        <el-table-column prop="phone" label="联系电话" width="150" />
        <el-table-column prop="email" label="电子邮箱" width="180" />
        <el-table-column prop="address" label="地址" min-width="200" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === '正常' ? 'success' : 'danger'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button 
              link
              type="primary" 
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button 
              link
              type="primary" 
              @click="viewDetails(scope.row)"
            >详情</el-button>
            <el-button 
              link
              type="danger" 
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :total="filteredSuppliers.length"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 50, 100]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 供应商表单对话框 -->
    <el-dialog 
      :title="dialogTitle" 
      v-model="dialogVisible"
      width="650px"
      destroy-on-close
    >
      <el-form 
        :model="supplierForm" 
        :rules="rules" 
        ref="supplierForm" 
        label-width="100px"
        class="supplier-form"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="供应商名称" prop="name">
              <el-input v-model="supplierForm.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="contact">
              <el-input v-model="supplierForm.contact" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="supplierForm.phone" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="supplierForm.email" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="supplierForm.address" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="supplierForm.status" style="width: 100%">
            <el-option label="正常" value="正常" />
            <el-option label="禁用" value="禁用" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input 
            type="textarea"
            v-model="supplierForm.remark"
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

    <!-- 供应商详情对话框 -->
    <el-dialog
      title="供应商详情"
      v-model="detailDialogVisible"
      width="800px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="供应商编号">{{ currentDetail.id }}</el-descriptions-item>
        <el-descriptions-item label="供应商名称">{{ currentDetail.name }}</el-descriptions-item>
        <el-descriptions-item label="联系人">{{ currentDetail.contact }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ currentDetail.phone }}</el-descriptions-item>
        <el-descriptions-item label="电子邮箱">{{ currentDetail.email }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="currentDetail.status === '正常' ? 'success' : 'danger'">
            {{ currentDetail.status }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="详细地址" :span="2">{{ currentDetail.address }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ currentDetail.remark || '无' }}</el-descriptions-item>
      </el-descriptions>

      <div class="detail-section">
        <h3>采购记录</h3>
        <el-table :data="purchaseRecords" style="width: 100%">
          <el-table-column prop="date" label="采购日期" width="120" />
          <el-table-column prop="product" label="采购产品" width="150" />
          <el-table-column prop="quantity" label="数量" width="100" />
          <el-table-column prop="amount" label="金额" width="120" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === '已完成' ? 'success' : 'warning'">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SupplierManagement',
  data() {
    return {
      searchQuery: '',
      suppliers: [
        {
          id: 'SP001',
          name: '云南茶叶供应商A',
          contact: '张三',
          phone: '13800138000',
          email: 'zhangsan@example.com',
          address: '云南省昆明市五华区xxx路123号',
          status: '正常'
        },
        {
          id: 'SP002',
          name: '普洱茶叶专业合作社',
          contact: '李四',
          phone: '13900139000',
          email: 'lisi@example.com',
          address: '云南省普洱市思茅区xxx镇456号',
          status: '正常'
        },
        {
          id: 'SP003',
          name: '勐海茶厂',
          contact: '王五',
          phone: '13700137000',
          email: 'wangwu@example.com',
          address: '云南省西双版纳州勐海县xxx路789号',
          status: '正常'
        },
        {
          id: 'SP004',
          name: '临沧茶叶基地',
          contact: '赵六',
          phone: '13600136000',
          email: 'zhaoliu@example.com',
          address: '云南省临沧市临翔区xxx镇321号',
          status: '禁用'
        },
        {
          id: 'SP005',
          name: '大理茶叶合作社',
          contact: '孙七',
          phone: '13500135000',
          email: 'sunqi@example.com',
          address: '云南省大理白族自治州大理市xxx路654号',
          status: '正常'
        }
      ],
      dialogVisible: false,
      dialogTitle: '新增供应商',
      supplierForm: {
        name: '',
        contact: '',
        phone: '',
        address: '',
        status: '正常'
      },
      detailDialogVisible: false,
      currentDetail: {},
      purchaseRecords: []
    }
  },
  computed: {
    filteredSuppliers() {
      return this.suppliers.filter(supplier => 
        supplier.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    }
  },
  methods: {
    handleAdd() {
      this.dialogTitle = '新增供应商'
      this.supplierForm = {
        name: '',
        contact: '',
        phone: '',
        address: '',
        status: '正常'
      }
      this.dialogVisible = true
    },
    handleEdit(row) {
      this.dialogTitle = '编辑供应商'
      this.supplierForm = { ...row }
      this.dialogVisible = true
    },
    handleDelete(row) {
      this.$confirm('确认删除该供应商?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 实际项目中这里需要调用后端API
        const index = this.suppliers.findIndex(item => item.id === row.id)
        this.suppliers.splice(index, 1)
        this.$message.success('删除成功')
      })
    },
    handleSubmit() {
      // 实际项目中这里需要调用后端API
      if (this.dialogTitle === '新增供应商') {
        this.suppliers.push({
          id: 'SP' + (this.suppliers.length + 1).toString().padStart(3, '0'),
          ...this.supplierForm
        })
      } else {
        const index = this.suppliers.findIndex(item => item.id === this.supplierForm.id)
        this.suppliers[index] = { ...this.supplierForm }
      }
      this.dialogVisible = false
      this.$message.success(this.dialogTitle + '成功')
    },
    viewDetails(row) {
      this.currentDetail = { ...row }
      this.detailDialogVisible = true
    }
  }
}
</script>

<style scoped>
.supplier-container {
  padding: 20px;
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

.supplier-form {
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

.dialog-footer {
  padding-top: 20px;
  text-align: right;
  border-top: 1px solid #f0f0f0;
}
</style> 