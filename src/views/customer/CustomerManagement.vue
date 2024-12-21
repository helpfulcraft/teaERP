<template>
  <div class="customer-container">
    <div class="toolbar">
      <el-button type="primary" @click="handleAdd">新增客户</el-button>
      <el-input
        v-model="searchQuery"
        placeholder="请输入客户名称或联系人搜索"
        style="width: 200px; margin-left: 10px"
      />
      <el-select v-model="levelFilter" placeholder="客户等级" style="margin-left: 10px">
        <el-option label="全部" value="" />
        <el-option label="普通" value="普通" />
        <el-option label="VIP" value="VIP" />
        <el-option label="战略" value="战略" />
      </el-select>
    </div>

    <el-table :data="filteredCustomers" style="width: 100%; margin-top: 20px">
      <el-table-column prop="id" label="客户编号" width="120" />
      <el-table-column prop="name" label="客户名称" width="180" />
      <el-table-column prop="contact" label="联系人" width="120" />
      <el-table-column prop="phone" label="联系电话" width="150" />
      <el-table-column prop="email" label="电子邮箱" width="180" />
      <el-table-column prop="level" label="客户等级" width="100">
        <template #default="scope">
          <el-tag :type="getLevelType(scope.row.level)">
            {{ scope.row.level }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="totalAmount" label="累计交易额" width="120" />
      <el-table-column label="操作" width="250">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button 
            size="small" 
            type="primary"
            @click="viewOrders(scope.row)"
          >订单记录</el-button>
          <el-button 
            size="small" 
            type="danger" 
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 客户表单对话框 -->
    <el-dialog 
      :title="dialogTitle" 
      v-model="dialogVisible"
      width="600px"
    >
      <el-form :model="customerForm" :rules="rules" ref="customerForm" label-width="100px">
        <el-form-item label="客户名称" prop="name">
          <el-input v-model="customerForm.name" />
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="customerForm.contact" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="customerForm.phone" />
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="customerForm.email" />
        </el-form-item>
        <el-form-item label="客户等级" prop="level">
          <el-select v-model="customerForm.level">
            <el-option label="普通" value="普通" />
            <el-option label="VIP" value="VIP" />
            <el-option label="战略" value="战略" />
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input 
            type="textarea"
            v-model="customerForm.address"
            rows="3"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input 
            type="textarea"
            v-model="customerForm.remark"
            rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 订单记录对话框 -->
    <el-dialog
      title="订单记录"
      v-model="orderDialogVisible"
      width="800px"
    >
      <el-table :data="customerOrders" style="width: 100%">
        <el-table-column prop="id" label="订单编号" width="120" />
        <el-table-column prop="orderDate" label="下单日期" width="120" />
        <el-table-column prop="productList" label="订购产品" width="200">
          <template #default="scope">
            <div v-for="item in scope.row.productList" :key="item.id">
              {{ item.name }} x {{ item.quantity }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="totalAmount" label="订单金额" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getOrderStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'CustomerManagement',
  data() {
    return {
      searchQuery: '',
      levelFilter: '',
      customers: [
        {
          id: 'C001',
          name: '昆明茶��专营店',
          contact: '张三',
          phone: '13800138000',
          email: 'zhangsan@example.com',
          level: 'VIP',
          totalAmount: 150000,
          address: '云南省昆明市五华区xxx路123号',
          remark: '重要客户'
        },
        {
          id: 'C002',
          name: '上海茶叶批发商',
          contact: '李四',
          phone: '13900139000',
          email: 'lisi@example.com',
          level: '战略',
          totalAmount: 280000,
          address: '上海市黄浦区xxx路456号',
          remark: '战略合作伙伴'
        },
        {
          id: 'C003',
          name: '广州茶叶市场',
          contact: '王五',
          phone: '13700137000',
          email: 'wangwu@example.com',
          level: 'VIP',
          totalAmount: 180000,
          address: '广东省广州市越秀区xxx路789号',
          remark: ''
        }
      ],
      customerOrders: [], // 当前查看的客户订单记录
      dialogVisible: false,
      orderDialogVisible: false,
      dialogTitle: '',
      customerForm: {
        name: '',
        contact: '',
        phone: '',
        email: '',
        level: '普通',
        address: '',
        remark: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入客户名称', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入电子邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '请选择客户等级', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    filteredCustomers() {
      return this.customers.filter(customer => {
        const matchQuery = customer.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                         customer.contact.toLowerCase().includes(this.searchQuery.toLowerCase())
        const matchLevel = !this.levelFilter || customer.level === this.levelFilter
        return matchQuery && matchLevel
      })
    }
  },
  methods: {
    getLevelType(level) {
      const levelMap = {
        '普通': 'info',
        'VIP': 'success',
        '战略': 'warning'
      }
      return levelMap[level]
    },
    getOrderStatusType(status) {
      const statusMap = {
        '待确认': 'warning',
        '已确认': 'primary',
        '已发货': 'success',
        '已完成': 'info'
      }
      return statusMap[status]
    },
    handleAdd() {
      this.dialogTitle = '新增客户'
      this.customerForm = {
        name: '',
        contact: '',
        phone: '',
        email: '',
        level: '普通',
        address: '',
        remark: ''
      }
      this.dialogVisible = true
    },
    handleEdit(row) {
      this.dialogTitle = '编辑客户'
      this.customerForm = { ...row }
      this.dialogVisible = true
    },
    handleDelete(row) {
      this.$confirm('确认删除该客户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.customers.findIndex(item => item.id === row.id)
        this.customers.splice(index, 1)
        this.$message.success('删除成功')
      })
    },
    viewOrders(row) {
      // 模拟获取客户订单记录
      this.customerOrders = [
        {
          id: 'SO001',
          orderDate: '2024-03-01',
          productList: [
            { id: 'P001', name: '七子饼茶', quantity: 100 }
          ],
          totalAmount: 10000,
          status: '已完成'
        }
      ]
      this.orderDialogVisible = true
    },
    handleSubmit() {
      this.$refs.customerForm.validate((valid) => {
        if (valid) {
          if (this.dialogTitle === '新增客户') {
            this.customers.push({
              id: 'C' + (this.customers.length + 1).toString().padStart(3, '0'),
              ...this.customerForm,
              totalAmount: 0
            })
          } else {
            const index = this.customers.findIndex(item => item.id === this.customerForm.id)
            this.customers[index] = { ...this.customerForm }
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
.customer-container {
  padding: 20px;
}

.toolbar {
  display: flex;
  align-items: center;
}
</style> 