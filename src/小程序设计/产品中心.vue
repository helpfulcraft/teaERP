<template>
    <div class="product-center">
      <!-- 优化轮播图显示 -->
      <el-carousel height="300px" :autoplay="true" indicator-position="outside">
        <el-carousel-item v-for="(item, index) in featuredProducts" :key="index">
          <div class="carousel-item">
            <div class="carousel-overlay">
              <div class="carousel-content">
                <h2>{{ item.name }}</h2>
                <p>{{ item.description }}</p>
              </div>
            </div>
            <!-- 使用背景图方式展示 -->
            <div class="carousel-bg" :style="{ backgroundImage: `url(${item.image})` }"></div>
          </div>
        </el-carousel-item>
      </el-carousel>
  
      <div class="container">
        <!-- 人气专区保持布局,优化图片展示 -->
        <div class="popular-section">
          <div class="section-title">
            <h2>人气专区</h2>
          </div>
          <div class="popular-products">
            <!-- 左侧大图添加遮罩和悬停效果 -->
            <div class="feature-product">
              <div class="image-wrapper">
                <img :src="featuredProducts[0].image" :alt="featuredProducts[0].name">
                <div class="overlay">
                  <h3>{{ featuredProducts[0].name }}</h3>
                  <p>{{ featuredProducts[0].description }}</p>
                </div>
              </div>
            </div>
            <!-- 右侧产品添加遮罩和悬停效果 -->
            <div class="popular-list">
              <div v-for="product in popularProducts" :key="product.id" class="popular-item">
                <div class="product-info">
                  <div class="info-content">
                    <h3>{{ product.name }}</h3>
                    <div class="price">¥{{ product.price }}</div>
                    <el-button class="try-btn" type="primary">立即体验</el-button>
                  </div>
                </div>
                <div class="image-wrapper">
                  <img :src="product.image" :alt="product.name">
                  <div class="hover-overlay">
                    <el-button type="primary" size="small">查看详情</el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- 添加分类导航 -->
        <div class="category-nav">
          <div class="nav-header">
            <h2>茶叶分类</h2>
          </div>
          <div class="nav-content">
            <div 
              v-for="(category, index) in mainCategories" 
              :key="index"
              :class="['nav-item', activeCategory === index ? 'active' : '']"
              @click="activeCategory = index"
            >
              <div class="nav-icon" :style="{ backgroundColor: category.color }">
                <i :class="category.icon"></i>
              </div>
              <div class="nav-text">
                <h3>{{ category.name }}</h3>
                <p>{{ category.description }}</p>
              </div>
            </div>
          </div>
        </div>
  
        <!-- 热推产品部分结构不变,优化图片展示 -->
        <div class="hot-section">
          <!-- 标题和分类部分保持不变 -->
          
          <el-row :gutter="20" class="product-grid">
            <el-col 
              v-for="product in currentProducts" 
              :key="product.id"
              :xs="12" 
              :sm="12" 
              :md="6" 
              :lg="6"
            >
              <el-card class="product-card">
                <div class="image-wrapper">
                  <img :src="product.image" :alt="product.name">
                  <div class="hover-overlay">
                    <el-button type="primary" size="small">查看详情</el-button>
                  </div>
                </div>
                <div class="product-info">
                  <h3>{{ product.name }}</h3>
                  <p>{{ product.description }}</p>
                  <div class="price">¥{{ product.price }}</div>
                </div>
                <div class="product-tags" v-if="product.isNew || product.isHot">
                  <span v-if="product.isNew" class="tag new">新品</span>
                  <span v-if="product.isHot" class="tag hot">热销</span>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </div>
  
      <!-- 产品详情弹窗 -->
      <el-dialog
        v-model="dialogVisible"
        :title="selectedProduct?.name"
        width="90%"
        class="product-detail-dialog"
      >
        <div class="detail-content">
          <div class="detail-image" :style="{ backgroundColor: selectedProduct?.categoryColor }">
            <img v-if="selectedProduct?.image" :src="selectedProduct.image" :alt="selectedProduct.name">
            <div v-else class="detail-placeholder">
              <div class="brewing-steps">
                <div class="step" v-for="(step, index) in brewingSteps" :key="index">
                  <i :class="step.icon"></i>
                  <span>{{ step.text }}</span>
                </div>
              </div>
            </div>
          </div>
  
          <div class="detail-info">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="产地">{{ selectedProduct?.origin }}</el-descriptions-item>
              <el-descriptions-item label="品种">{{ selectedProduct?.variety }}</el-descriptions-item>
              <el-descriptions-item label="规格">{{ selectedProduct?.specification }}</el-descriptions-item>
              <el-descriptions-item label="保质期">{{ selectedProduct?.shelfLife }}</el-descriptions-item>
            </el-descriptions>
            
            <div class="product-description">
              {{ selectedProduct?.fullDescription }}
            </div>
            
            <div class="price-section">
              <span class="price">¥{{ selectedProduct?.price }}</span>
              <el-button type="primary">立即购买</el-button>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ProductCenter',
    data() {
      return {
        activeCategory: 0,
        selectedProduct: null,
        dialogVisible: false,
        categories: [
          { name: '生茶', color: '#8B4513' },
          { name: '熟茶', color: '#B22222' },
          { name: '红茶', color: '#228B22' },
          { name: '绿茶', color: '#DDA0DD' }
        ],
        featuredProducts: [
          {
            name: '布朗印象',
            description: '布朗印象普洱茶饼，一款源自云南布朗茶区，承载着历史茶韵的佳茗!',
            categoryColor: '#8B4513',
            image: 'http://www.limingpuer.com/uploadDir/jpg/20240722/1721631295525.jpg'
          },
          {
            name: '薄荷塘',
            description: '用时间检验品质，用匠心守护其真味',
            categoryColor: '#228B22',
            image: 'http://www.limingpuer.com/uploadDir/jpg/20240626/1719384396337.jpg'
          },
          {
            name: '大成南糯',
            description: '乔木老树，普洱生��，汤色剔透明亮，久泡有余香',
            categoryColor: '#8B4513',
            image: '/uploadDir/png/20200805/1584272156027.png'
          }
        ],
        products: [
          {
            id: 1,
            name: '魅力老寨冰岛',
            description: '翠峦深处隐冰岛，云雾缭绕仙境造。古树参天遮日月，清泉潺潺润茶苗。',
            price:  1999,
            categoryId: 0,
            categoryColor: '#8B4513',
            origin: '云南勐海',
            variety: '普洱生茶',
            specification: '357g/饼',
            shelfLife: '长期保存',
            image: 'http://www.limingpuer.com/uploadDir/jpg/20240814/1723597123500.jpg',
            fullDescription: '采用云南大叶种晒青毛茶为原料,经过传统工艺精制而成。茶汤橙红透亮,香气高锐持久,滋味醇厚回甘,叶底红褐明亮。'
          },
          {
            id: 2,
            name: '易武印象·普洱茶',
            description: '茶味浓郁，易武春芽，历来是制作高品质普洱茶的优质原料。',
            price: 499,
            categoryId: 0,
            categoryColor: '#8B4513',
            origin: '云南布朗山',
            variety: '普洱生茶',
            specification: '357g/饼',
            shelfLife: '长期保存',
            image: 'http://www.limingpuer.com/uploadDir/jpg/20240611/1718099977707.jpg',
            fullDescription: '采用布朗山区优质菁精制而成,具有布朗山特有的茶香。'
          },
          // ���他产品数据...
        ],
        brewingSteps: [
          { icon: 'water-icon', text: '水温95℃' },
          { icon: 'time-icon', text: '冲泡30秒' },
          { icon: 'cup-icon', text: '茶汤橙红' }
        ],
        popularProducts: [
          {
            id: 1,
            name: '国营壹号-熟茶',
            price: 399,
            image: 'http://www.limingpuer.com/uploadDir/jpg/20240626/1719384396337.jpg'
          },
          {
            id: 2,
            name: '国营壹号-生茶',
            price: 399,
            image: 'http://www.limingpuer.com/uploadDir/jpg/20240626/1719383328350.jpg'
          }
        ],
        mainCategories: [
          { 
            name: '生茶', 
            color: '#8B4513',
            icon: 'tea-leaf',
            description: '原料新鲜，滋味清爽'
          },
          { 
            name: '熟茶', 
            color: '#B22222',
            icon: 'tea-cup',
            description: '醇厚回甘，香气持久'
          }
        ],
      }
    },
    computed: {
      currentProducts() {
        return this.products.filter(p => p.categoryId === this.activeCategory)
      }
    },
    methods: {
      showProductDetail(product) {
        this.selectedProduct = product
      }
    }
  }
  </script>
  
  <style scoped>
  /* 整体背景色调整 */
  .product-center {
    min-height: 100vh;
    background: #f5f7f2; /* 淡雅的茶青色背景 */
  }
  
  /* 容器背景 */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .carousel-item {
    position: relative;
    height: 100%;
    overflow: hidden;
  }
  
  .carousel-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    transition: transform 0.3s;
  }
  
  .carousel-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, rgba(92, 60, 36, 0.8), rgba(92, 60, 36, 0.4));
    display: flex;
    align-items: center;
    padding: 0 10%;
    color: #fff;
  }
  
  .carousel-content {
    text-align: center;
    color: white;
    padding: 20px;
  }
  
  .carousel-content h2 {
    margin-bottom: 10px;
    font-size: 24px;
  }
  
  .category-nav {
    display: flex;
    margin: 20px 0;
    background: #fff;
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  }
  
  .category-item {
    flex: 1;
    text-align: center;
    padding: 12px;
    font-size: 16px;
    color: #666;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .category-item.active {
    color: #8B4513;
    font-weight: bold;
    position: relative;
  }
  
  .category-item.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 2px;
    background: #8B4513;
  }
  
  .product-card {
    height: 100%;
    transition: transform 0.3s;
  }
  
  .product-card:hover {
    transform: translateY(-5px);
  }
  
  .product-card .image-wrapper {
    height: 200px;
  }
  
  .product-image {
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .product-info {
    padding: 15px;
  }
  
  .product-name {
    font-size: 16px;
    margin: 0 0 8px;
    color: #333;
  }
  
  .product-desc {
    font-size: 14px;
    color: #666;
    margin: 0 0 12px;
    line-height: 1.4;
  }
  
  .price-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .product-price {
    color: #e4393c;
    font-size: 18px;
    font-weight: bold;
  }
  
  .detail-btn {
    background: #8B4513;
    border-color: #8B4513;
  }
  
  .product-detail-dialog :deep(.el-dialog__body) {
    padding: 0;
  }
  
  .detail-content {
    display: flex;
    gap: 20px;
  }
  
  .detail-image {
    flex: 1;
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .detail-info {
    flex: 1;
    padding: 20px;
  }
  
  .product-description {
    margin: 20px 0;
    line-height: 1.6;
    color: #666;
  }
  
  /* 人气专区样式优化 */
  .popular-section {
    margin: 30px 0;
    background: #fff;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(139, 69, 19, 0.05);
    border: 1px solid rgba(139, 69, 19, 0.1);
  }
  
  .section-title {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .section-title h2 {
    font-size: 20px;
    color: #5c3c24; /* 深茶色 */
    position: relative;
    padding-left: 15px;
  }
  
  .section-title h2::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 20px;
    background: linear-gradient(to bottom, #8B4513, #D2691E); /* 茶色渐变 */
  }
  
  .popular-products {
    display: flex;
    gap: 20px;
  }
  
  .feature-product {
    flex: 1;
    height: 400px;
    overflow: hidden;
  }
  
  .feature-product img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .popular-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .popular-item {
    display: flex;
    height: 190px;
    background: #f9f9f9;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .product-info {
    flex: 1;
    padding: 20px;
    display: flex;
    align-items: center;
  }
  
  .info-content {
    width: 100%;
  }
  
  .info-content h3 {
    font-size: 18px;
    margin-bottom: 10px;
    color: #5c3c24; /* 深茶色 */
  }
  
  .price {
    color: #c1502e !important; /* 红茶色 */
    font-size: 20px;
    font-weight: bold;
    margin: 10px 0;
  }
  
  .try-btn {
    width: 100px;
    background: linear-gradient(135deg, #8B4513, #D2691E) !important;
    border: none !important;
    color: #fff !important;
  }
  
  .try-btn:hover {
    background: linear-gradient(135deg, #D2691E, #8B4513) !important;
    opacity: 0.9;
  }
  
  .product-image {
    width: 190px;
    height: 190px;
  }
  
  .product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  /* 热推产品区域样式优化 */
  .hot-section {
    margin: 30px 0;
    background: #fff;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(139, 69, 19, 0.05);
    border: 1px solid rgba(139, 69, 19, 0.1);
  }
  
  .category-tabs {
    display: flex;
    gap: 20px;
  }
  
  .tab-item {
    padding: 5px 15px;
    cursor: pointer;
    color: #666;
  }
  
  .tab-item.active {
    color: #8B4513;
    font-weight: bold;
  }
  
  .product-grid {
    margin-top: 20px;
  }
  
  .product-tags {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    gap: 5px;
  }
  
  .tag {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    color: #fff;
  }
  
  .tag.new {
    background: linear-gradient(135deg, #e4393c, #ff6b6b);
  }
  
  .tag.hot {
    background: linear-gradient(135deg, #ff9500, #ffb700);
  }
  
  /* 优化图片包装器样式 */
  .image-wrapper {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    height: 100%;
  }
  
  .image-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }
  
  .image-wrapper:hover img {
    transform: scale(1.05);
  }
  
  /* 遮罩层样式优化 */
  .overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px;
    background: linear-gradient(to top, rgba(92, 60, 36, 0.9), rgba(92, 60, 36, 0.2));
    color: #fff;
  }
  
  .hover-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(92, 60, 36, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  .image-wrapper:hover .hover-overlay {
    opacity: 1;
  }
  
  /* 滚动条样式优化 */
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: #f5f7f2;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #8B4513;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #D2691E;
  }
  
  /* 分类导航样式 */
  .category-nav {
    margin: 30px 0;
    background: #fff;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 2px 12px rgba(139, 69, 19, 0.05);
    border: 1px solid rgba(139, 69, 19, 0.1);
  }
  
  .nav-header {
    margin-bottom: 20px;
  }
  
  .nav-header h2 {
    color: #5c3c24;
    font-size: 24px;
    position: relative;
    padding-left: 15px;
  }
  
  .nav-header h2::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 24px;
    background: linear-gradient(to bottom, #8B4513, #D2691E);
  }
  
  .nav-content {
    display: flex;
    gap: 20px;
  }
  
  .nav-item {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 20px;
    background: #fdfbf7;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    border: 1px solid rgba(139, 69, 19, 0.1);
  }
  
  .nav-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 69, 19, 0.1);
  }
  
  .nav-item.active {
    background: linear-gradient(135deg, #8B4513, #D2691E);
  }
  
  .nav-item.active .nav-text h3,
  .nav-item.active .nav-text p {
    color: #fff;
  }
  
  .nav-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
  }
  
  .nav-icon i {
    font-size: 24px;
    color: #fff;
  }
  
  .nav-text {
    flex: 1;
  }
  
  .nav-text h3 {
    font-size: 18px;
    color: #5c3c24;
    margin-bottom: 5px;
  }
  
  .nav-text p {
    font-size: 14px;
    color: #8B4513;
    opacity: 0.8;
  }
  </style> 