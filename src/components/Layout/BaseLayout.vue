<template>
  <el-container class="layout-container">
    <el-aside :width="asideWidth" class="aside">
      <div class="logo">
        <img src="../../assets/logo.svg" alt="logo" />
        <span>云垦茶业ERP</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="side-menu"
        @select="handleSelect"
        background-color="#001529"
        text-color="#fff"
        active-text-color="#1890ff"
      >
        <el-sub-menu index="1">
          <template #title>
            <span>供应链管理</span>
          </template>
          <el-menu-item index="1-1">
            <el-icon><Shop /></el-icon>
            <span>供应商管理</span>
          </el-menu-item>
          <el-menu-item index="1-2">
            <el-icon><ShoppingCart /></el-icon>
            <span>采购管理</span>
          </el-menu-item>
          <el-menu-item index="1-3">
            <el-icon><Box /></el-icon>
            <span>库存管理</span>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="2">
          <template #title>
            <span>生产管理</span>
          </template>
          <el-menu-item index="2-1">生产计划</el-menu-item>
          <el-menu-item index="2-2">工艺管理</el-menu-item>
          <el-menu-item index="2-3">质量控制</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="3">
          <template #title>
            <span>销售管理</span>
          </template>
          <el-menu-item index="3-1">订单管理</el-menu-item>
          <el-menu-item index="3-2">客户管理</el-menu-item>
          <el-menu-item index="3-3">销售分析</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header height="64px" class="header" :style="{ left: asideWidth }">
        <div class="header-left">
          <el-icon class="toggle-icon" @click="toggleSidebar">
            <Fold v-if="!collapsed" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentPath }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-space>
            <el-tooltip content="消息通知" placement="bottom">
              <el-badge :value="3" class="notice-badge">
                <el-icon><Bell /></el-icon>
              </el-badge>
            </el-tooltip>
            <el-divider direction="vertical" />
            <el-dropdown>
              <span class="user-dropdown">
                <el-avatar size="small" src="https://placeholder.com/32x32" />
                <span class="username">管理员</span>
                <el-icon><CaretBottom /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <el-icon><User /></el-icon>个人信息
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-icon><Setting /></el-icon>系统设置
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="handleLogout">
                    <el-icon><SwitchButton /></el-icon>退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-space>
        </div>
      </el-header>

      <el-main class="main" :style="{ marginLeft: mainMarginLeft }">
        <div class="content-wrapper">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {
  Shop,
  ShoppingCart,
  Box,
  Tools,
  SetUp,
  Check,
  Sell,
  User,
  TrendCharts
} from '@element-plus/icons-vue'

export default {
  name: 'BaseLayout',
  data() {
    return {
      activeMenu: '1-1',
      collapsed: false,
      currentPath: '首页'
    }
  },
  computed: {
    asideWidth() {
      return this.collapsed ? '80px' : '220px'
    },
    mainMarginLeft() {
      return this.collapsed ? '80px' : '220px'
    }
  },
  methods: {
    handleSelect(index) {
      this.activeMenu = index
      // 根据菜单索引进行路由跳转
      const routeMap = {
        '1-1': '/supplier',
        '1-2': '/purchase',
        '1-3': '/inventory',
        '2-1': '/production',
        '2-2': '/process',
        '2-3': '/quality',
        '3-1': '/order',
        '3-2': '/customer',
        '3-3': '/sales-analysis'
      }
      this.$router.push(routeMap[index])
    },
    toggleSidebar() {
      this.collapsed = !this.collapsed
    },
    handleLogout() {
      this.$confirm('确认退出登录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        this.$router.push('/login')
        this.$message.success('已退出登录')
      })
    }
  },
  watch: {
    $route(to) {
      // 更新面包屑
      const routeNames = {
        '/supplier': '供应商管理',
        '/purchase': '采购管理',
        '/inventory': '库存管理',
        '/production': '生产计划',
        '/process': '工艺管理',
        '/quality': '质量控制',
        '/order': '订单管理',
        '/customer': '客户管理',
        '/sales-analysis': '销售分析'
      }
      this.currentPath = routeNames[to.path] || '首页'
    }
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
  background-color: #f0f2f5;
}

.aside {
  position: fixed;
  left: 0;
  height: 100vh;
  background-color: #001529;
  transition: width 0.3s;
  z-index: 1000;
  box-shadow: 2px 0 8px rgba(0,0,0,0.15);
}

.logo {
  height: 64px;
  padding: 16px;
  display: flex;
  align-items: center;
  background: #002140;
}

.logo img {
  height: 32px;
  margin-right: 8px;
}

.logo span {
  color: white;
  font-size: 18px;
  font-weight: 600;
}

.header {
  position: fixed;
  top: 0;
  right: 0;
  left: 220px;
  z-index: 999;
  background: white;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0,21,41,0.08);
}

.header-left {
  display: flex;
  align-items: center;
}

.toggle-icon {
  font-size: 20px;
  margin-right: 20px;
  cursor: pointer;
}

.toggle-icon:hover {
  color: #1890ff;
}

.header-right .notice-badge {
  cursor: pointer;
  font-size: 20px;
}

.header-right .notice-badge:hover {
  color: #1890ff;
}

.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin: 0 8px;
}

.main {
  margin-top: 64px;
  padding: 24px;
  min-height: calc(100vh - 64px);
  transition: margin-left 0.3s;
}

.content-wrapper {
  background: white;
  padding: 24px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0,21,41,0.08);
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 