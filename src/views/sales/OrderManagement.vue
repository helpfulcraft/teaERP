<template>
  <div class="order-container">
    <div class="toolbar">
      <el-button type="primary" @click="handleAdd">新建订单</el-button>
      <el-input
        v-model="searchQuery"
        placeholder="请输入订单号或客户名称搜索"
        style="width: 200px; margin-left: 10px"
      />
      <el-select v-model="statusFilter" placeholder="订单状态" style="margin-left: 10px">
        <el-option label="全部" value="" />
        <el-option label="待确认" value="待确认" />
        <el-option label="已确认" value="已确认" />
        <el-option label="已发货" value="已发货" />
        <el-option label="已完成" value="已完成" />
      </el-select>
    </div>

    <el-table :data="filteredOrders" style="width: 100%; margin-top: 20px">
      <el-table-column prop="id" label="订单编号" width="120" />
      <el-table-column prop="customerName" label="客户名称" width="150" />
      <el-table-column prop="productList" label="订购产品" width="200">
        <template #default="scope">
          <div v-for="item in scope.row.productList" :key="item.id">
            {{ item.name }} x {{ item.quantity }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="totalAmount" label="订单金额" width="120" />
      <el-table-column prop="orderDate" label="下单日期" width="120" />
      <el-table-column prop="deliveryDate" label="预计发货日" width="120" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template #default="scope">
          <el-button 
            size="small" 
            :disabled="scope.row.status === '已完成'"
            @click="handleEdit(scope.row)"
          >编辑</el-button>
          <el-button 
            size="small" 
            type="success"
            v-if="scope.row.status === '已确认'"
            @click="handleShip(scope.row)"
          >发货</el-button>
          <el-button 
            size="small" 
            type="info"
            @click="handleDetail(scope.row)"
          >详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 订单表单对话框 -->
    <el-dialog 
      :title="dialogTitle" 
      v-model="dialogVisible"
      width="700px"
    >
      <el-form :model="orderForm" :rules="rules" ref="orderForm" label-width="100px">
        <el-form-item label="客户名称" prop="customerName">
          <el-select v-model="orderForm.customerName" filterable>
            <el-option 
              v-for="customer in customers"
              :key="customer.id"
              :label="customer.name"
              :value="customer.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="订购产品">
          <div class="product-list">
            <div v-for="(item, index) in orderForm.productList" :key="index" class="product-item">
              <el-select v-model="item.id" placeholder="选择产品" style="width: 200px">
                <el-option 
                  v-for="product in products"
                  :key="product.id"
                  :label="product.name"
                  :value="product.id"
                />
              </el-select>
              <el-input-number v-model="item.quantity" :min="1" style="margin: 0 10px" />
              <el-button type="danger" icon="el-icon-delete" circle @click="removeProduct(index)" />
            </div>
            <el-button type="primary" @click="addProduct">添加产品</el-button>
          </div>
        </el-form-item>
        <el-form-item label="预计发货日" prop="deliveryDate">
          <el-date-picker
            v-model="orderForm.deliveryDate"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input 
            type="textarea"
            v-model="orderForm.remark"
            rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'OrderManagement',
  data() {
    return {
      searchQuery: '',
      statusFilter: '',
      orders: [
        {
          id: 'SO001',
          customerName: '昆明茶叶专营店',
          productList: [
            { id: 'P001', name: '七子饼茶', quantity: 100, price: 200 },
            { id: 'P002', name: '普洱散茶', quantity: 50, price: 180 }
          ],
          totalAmount: 29000,
          orderDate: '2024-03-01',
          deliveryDate: '2024-03-10',
          status: '已确认',
          remark: '春节促销订单'
        },
        {
          id: 'SO002',
          customerName: '上海茶叶批发商',
          productList: [
            { id: 'P003', name: '滇红茶', quantity: 200, price: 150 }
          ],
          totalAmount: 30000,
          orderDate: '2024-03-02',
          deliveryDate: '2024-03-15',
          status: '待确认',
          remark: '新客户首次订单'
        },
        {
          id: 'SO003',
          customerName: '广州茶叶市场',
          productList: [
            { id: 'P001', name: '七子饼茶', quantity: 150, price: 200 },
            { id: 'P003', name: '滇红茶', quantity: 100, price: 150 }
          ],
          totalAmount: 45000,
          orderDate: '2024-03-03',
          deliveryDate: '2024-03-20',
          status: '已发货',
          remark: '常规补货订单'
        }
      ],
      customers: [
        { id: 'C001', name: '昆明茶叶专营店' },
        { id: 'C002', name: '上海茶叶批发商' }
      ],
      products: [
        { id: 'P001', name: '七子饼茶', price: 100 },
        { id: 'P002', name: '普洱茶', price: 80 }
      ],
      dialogVisible: false,
      dialogTitle: '',
      orderForm: {
        customerName: '',
        productList: [{ id: '', quantity: 1 }],
        deliveryDate: '',
        remark: ''
      },
      rules: {
        customerName: [
          { required: true, message: '请选择客户', trigger: 'change' }
        ],
        deliveryDate: [
          { required: true, message: '请选择预计发货日', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    filteredOrders() {
      return this.orders.filter(order => {
        const matchQuery = order.id.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(this.searchQuery.toLowerCase())
        const matchStatus = !this.statusFilter || order.status === this.statusFilter
        return matchQuery && matchStatus
      })
    }
  },
  methods: {
    getStatusType(status) {
      const statusMap = {
        '待确认': 'warning',
        '已确认': 'primary',
        '已发货': 'success',
        '已完成': 'info'
      }
      return statusMap[status]
    },
    handleAdd() {
      this.dialogTitle = '新建订单'
      this.orderForm = {
        customerName: '',
        productList: [{ id: '', quantity: 1 }],
        deliveryDate: '',
        remark: ''
      }
      this.dialogVisible = true
    },
    handleEdit(row) {
      this.dialogTitle = '编辑订单'
      this.orderForm = { ...row }
      this.dialogVisible = true
    },
    handleShip(row) {
      this.$confirm('确认发货?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.orders.findIndex(item => item.id === row.id)
        this.orders[index].status = '已发货'
        this.$message.success('发货成功')
      })
    },
    handleDetail(row) {
      console.log('查看订单详情:', row)
    },
    addProduct() {
      this.orderForm.productList.push({ id: '', quantity: 1 })
    },
    removeProduct(index) {
      this.orderForm.productList.splice(index, 1)
    },
    handleSubmit() {
      this.$refs.orderForm.validate((valid) => {
        if (valid) {
          if (this.dialogTitle === '新建订单') {
            // 计算订单总金额
            const totalAmount = this.orderForm.productList.reduce((sum, item) => {
              const product = this.products.find(p => p.id === item.id)
              return sum + (product ? product.price * item.quantity : 0)
            }, 0)

            this.orders.push({
              id: 'SO' + (this.orders.length + 1).toString().padStart(3, '0'),
              ...this.orderForm,
              totalAmount,
              orderDate: new Date().toISOString().split('T')[0],
              status: '待确认'
            })
          } else {
            const index = this.orders.findIndex(item => item.id === this.orderForm.id)
            this.orders[index] = { ...this.orderForm }
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
.order-container {
  padding: 20px;
}

.toolbar {
  display: flex;
  align-items: center;
}

.product-list {
  .product-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
}
</style> 