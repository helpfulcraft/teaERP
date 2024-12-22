<template>
    <div class="brand-culture">
      <!-- 顶部导航栏 -->
      <div class="nav-bar">
        <div class="nav-title">品牌文化</div>
        <div class="back-btn" @click="$router.back()">
          <i class="el-icon-arrow-left"></i>
        </div>
      </div>
  
      <!-- 分类导航 -->
      <div class="category-nav">
        <div class="nav-item" 
          v-for="(item, index) in navItems" 
          :key="index"
          :class="{ active: currentTab === index }"
          @click="currentTab = index"
        >
          <i :class="item.icon"></i>
          {{ item.name }}
        </div>
      </div>
  
      <!-- 内容区域 -->
      <div class="content">
        <!-- 公司简介板块 -->
        <div v-show="currentTab === 0" class="section">
          <div class="section-title">
            <i class="el-icon-office-building"></i>
            公司简介
          </div>
          <div class="company-content">
            <!-- 修改公司logo部分 -->
            <div class="company-logo">
              <img src="@/assets/images/company/logo.png" alt="公司logo" class="logo-image">
            </div>
            <div class="company-desc">
              云垦茶业集团是云南农垦集团旗下全资产业集团公司，于1995年12月07日成立。法定代表人陈胜军，公司经营范围包括：对茶叶及茶叶产品、糖、农副产品、茶叶机械的投资开发，房屋出租业务等。2017年，按照"集团公司—产业集团—专业公司"的模式，云垦茶业集团应运而生，致力于"云茶"产业打造。
            </div>
            <!-- 添加数据展示卡片 -->
            <div class="data-cards">
              <div class="data-card">
                <div class="data-icon"><i class="el-icon-money"></i></div>
                <div class="data-info">
                  <div class="data-value">2亿元</div>
                  <div class="data-label">年营收</div>
                </div>
              </div>
              <div class="data-card">
                <div class="data-icon"><i class="el-icon-shopping-cart-full"></i></div>
                <div class="data-info">
                  <div class="data-value">1000+</div>
                  <div class="data-label">产品数量</div>
                </div>
              </div>
              <div class="data-card">
                <div class="data-icon"><i class="el-icon-coordinate"></i></div>
                <div class="data-info">
                  <div class="data-value">10万亩</div>
                  <div class="data-label">茶园面积</div>
                </div>
              </div>
            </div>
            <div class="company-features">
              <!-- 为每个feature添加图标 -->
              <div class="feature-item">
                <div class="feature-icon">
                  <i class="el-icon-s-cooperation"></i>
                </div>
                <div class="feature-title">产业一体化</div>
                <div class="feature-desc">集种植栽培、生产加工、销售和文化推广为一体的大型茶业企业</div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <i class="el-icon-money"></i>
                </div>
                <div class="feature-title">经营规模</div>
                <div class="feature-desc">连续三年主营业务收入近2亿元，利润总额超过2000万元</div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <i class="el-icon-trophy"></i>
                </div>
                <div class="feature-title">品牌实力</div>
                <div class="feature-desc">拥有"八角亭"和"嘉木"两大知名品牌，自主研发产品超1000款</div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <i class="el-icon-coordinate"></i>
                </div>
                <div class="feature-title">资源优势</div>
                <div class="feature-desc">在普洱、临沧和西双版纳等地区拥有合作茶园超过10万亩</div>
              </div>
            </div>
            <!-- 添加发展目标 -->
            <div class="goals-section">
              <div class="section-subtitle">
                <i class="el-icon-aim"></i>
                发展目标
              </div>
              <div class="goals-grid">
                <div class="goal-item">
                  <div class="goal-icon">
                    <i class="el-icon-office-building"></i>
                  </div>
                  <div class="goal-value">15亿</div>
                  <div class="goal-label">固定资产</div>
                </div>
                <div class="goal-item">
                  <div class="goal-icon">
                    <i class="el-icon-money"></i>
                  </div>
                  <div class="goal-value">30亿</div>
                  <div class="goal-label">营收目标</div>
                </div>
                <div class="goal-item">
                  <div class="goal-icon">
                    <i class="el-icon-data-line"></i>
                  </div>
                  <div class="goal-value">2亿</div>
                  <div class="goal-label">利润目标</div>
                </div>
              </div>
            </div>
            <!-- 在公司简介板块添加企业文化部分 -->
            <div class="cultural-values-section">
              <div class="section-subtitle">
                <i class="el-icon-collection-tag"></i>
                企业文化
              </div>
              <div class="values-cards">
                <div class="value-card" v-for="(item, index) in culturalValues" :key="index">
                  <div class="value-header">{{item.title}}</div>
                  <div class="value-content">{{item.content}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- 品牌故事板块 -->
        <div v-show="currentTab === 1" class="section">
          <div class="section-title">
            <i class="el-icon-collection"></i>
            品牌故事
          </div>
          
          <!-- 添加品牌介绍卡片 -->
          <div class="brand-intro">
            <div class="intro-header">
              <div class="intro-icon">
                <i class="el-icon-reading"></i>
              </div>
              <div class="intro-title">品牌历程</div>
            </div>
            <div class="intro-text">
              云南云垦茶业集团有限责任公司，从1955年的国营农场起步，历经数十载发展，现已成为云南省茶产业的领军企业。公司始终秉持"天然源×自然味"的品牌理念，致力于打造优质茶叶产品。
            </div>
          </div>
  
          <!-- 先展示旗下品牌 -->
          <div class="brands-section">
            <div class="section-subtitle">
              <i class="el-icon-goods"></i>
              <span>旗下品牌</span>
            </div>
            <div class="brand-cards">
              <!-- 八角亭品牌卡片 -->
              <div class="brand-card">
                <div class="brand-header">
                  <div class="brand-logo">
                    <img src="@/assets/images/company/BaJiaoTing.png" alt="八角亭logo">
                  </div>
                  <div class="brand-title">八角亭</div>
                </div>
                <div class="brand-content">
                  <div class="brand-desc">
                    <p>云南省著名商标，专注普洱茶生产</p>
                    <ul class="brand-points">
                      <li>年设计生产量达3000余吨</li>
                      <li>云南省农业产业化龙头企业</li>
                      <li>通过ISO9001与ISO22000认证</li>
                    </ul>
                  </div>
                  <div class="brand-features">
                    <div class="feature-tag"><i class="el-icon-medal"></i>省级龙头</div>
                    <div class="feature-tag"><i class="el-icon-check"></i>有机认证</div>
                    <div class="feature-tag"><i class="el-icon-star-on"></i>名牌产品</div>
                  </div>
                </div>
              </div>
              <!-- 嘉木品牌卡片 -->
              <div class="brand-card">
                <div class="brand-header">
                  <div class="brand-logo">
                    <img src="@/assets/images/company/JiaMu.png" alt="嘉木logo">
                  </div>
                  <div class="brand-title">嘉木</div>
                </div>
                <div class="brand-content">
                  <div class="brand-desc">
                    <p>专业茶企品牌，集红茶、绿茶、花茶生产销售为一���</p>
                    <ul class="brand-points">
                      <li>在双柏、曼昔等茶区建有茶叶基地</li>
                      <li>通过有机认证和地理标识认证</li>
                      <li>严格的质量控制体系保障</li>
                    </ul>
                  </div>
                  <div class="brand-features">
                    <div class="feature-tag"><i class="el-icon-location"></i>优质基地</div>
                    <div class="feature-tag"><i class="el-icon-collection"></i>多品类</div>
                    <div class="feature-tag"><i class="el-icon-picture"></i>地理标识</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- 再展示发展历程 -->
          <div class="timeline-wrapper">
            <div class="timeline-header">
              <i class="el-icon-time"></i>
              <span>发展历程</span>
            </div>
            <div class="timeline-content">
              <div class="milestone-list">
                <div class="milestone-item" v-for="(milestone, index) in milestones" :key="index">
                  <div class="milestone-date">
                    <span class="year">{{milestone.year}}</span>
                    <span class="highlight">{{milestone.highlight}}</span>
                  </div>
                  <div class="milestone-line">
                    <div class="line-dot"></div>
                  </div>
                  <div class="milestone-card">
                    <div class="milestone-icon">
                      <i :class="milestone.icon"></i>
                    </div>
                    <div class="milestone-info">
                      <h4>{{milestone.title}}</h4>
                      <p>{{milestone.desc}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- 茶文化板块优化 -->
        <div v-show="currentTab === 2" class="section">
          <div class="section-title">
            <i class="el-icon-cup"></i>
            茶文化传承
          </div>
          
          <!-- 茶道精神部分 -->
          <div class="tea-spirit-section">
            <div class="section-subtitle">
              <i class="el-icon-magic-stick"></i>
              茶道精神
            </div>
            <div class="spirit-grid">
              <div class="spirit-item">
                <div class="spirit-icon">和</div>
                <div class="spirit-content">
                  <div class="spirit-title">和谐共处</div>
                  <div class="spirit-desc">以茶会友，促进人与人之间的和谐</div>
                </div>
              </div>
              <div class="spirit-item">
                <div class="spirit-icon">敬</div>
                <div class="spirit-content">
                  <div class="spirit-title">礼敬天地</div>
                  <div class="spirit-desc">敬茶敬人，感恩自然馈赠</div>
                </div>
              </div>
              <div class="spirit-item">
                <div class="spirit-icon">清</div>
                <div class="spirit-content">
                  <div class="spirit-title">清心寡欲</div>
                  <div class="spirit-desc">品茗清心，返璞归真</div>
                </div>
              </div>
              <div class="spirit-item">
                <div class="spirit-icon">寂</div>
                <div class="spirit-content">
                  <div class="spirit-title">静心品茗</div>
                  <div class="spirit-desc">在宁静中感悟人生真谛</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 制茶工艺部分 -->
          <div class="tea-craft-section">
            <div class="section-subtitle">
              <i class="el-icon-set-up"></i>
              制茶工艺
            </div>
            <div class="craft-cards">
              <div class="craft-card">
                <div class="craft-icon">采</div>
                <div class="craft-content">
                  <h4>采摘</h4>
                  <p>严选优质茶园，采摘一芽两叶</p>
                </div>
              </div>
              <div class="craft-card">
                <div class="craft-icon">晒</div>
                <div class="craft-content">
                  <h4>晾晒</h4>
                  <p>传统日光晾晒，保持茶叶活性</p>
                </div>
              </div>
              <div class="craft-card">
                <div class="craft-icon">制</div>
                <div class="craft-content">
                  <h4>加工</h4>
                  <p>传统工艺结合现代科技</p>
                </div>
              </div>
              <div class="craft-card">
                <div class="craft-icon">储</div>
                <div class="craft-content">
                  <h4>存储</h4>
                  <p>恒温恒湿仓储，确保品质</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 品质保证部分 -->
          <div class="quality-section">
            <div class="section-subtitle">
              <i class="el-icon-medal"></i>
              品质保证
            </div>
            <div class="quality-cards">
              <div class="quality-card">
                <div class="quality-icon">证</div>
                <div class="quality-title">认证体系</div>
                <div class="quality-list">
                  <span>ISO9001</span>
                  <span>HACCP</span>
                  <span>有机认证</span>
                </div>
              </div>
              <div class="quality-card">
                <div class="quality-icon">控</div>
                <div class="quality-title">质量监控</div>
                <div class="quality-list">
                  <span>原料溯源</span>
                  <span>全程监控</span>
                  <span>标准化生产</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'BrandCulture',
    data() {
      return {
        currentTab: 0,
        navItems: [
          { name: '公司简介', icon: 'el-icon-office-building' },
          { name: '品牌故事', icon: 'el-icon-collection' },
          { name: '茶文化', icon: 'el-icon-cup' }
        ],
        // 添加企业优势数据
        advantages: [
          { title: '科技创新', desc: '与多家科研机构合作，推动技术创新' },
          { title: '质量保证', desc: '多重认证体系，确保产品品质' },
          { title: '市场网络', desc: '拥有500余家合作商，覆盖全国' },
          { title: '文化传承', desc: '传承茶文化精髓，弘扬品牌价值' }
        ],
        // 扩充发展历程数据
        milestones: [
          { 
            year: '1955', 
            title: '创立之初', 
            desc: '中国人民解放军第二野战军第四兵团第13师的复原专业官兵在云南西双版纳勐遮坝成立国营农场',
            icon: 'el-icon-house',
            highlight: '开创云南茶业发展新篇章'
          },
          { 
            year: '1995', 
            title: '公司成立', 
            desc: '云垦茶业集团正式成立，开始专注于茶叶产业发展',
            icon: 'el-icon-office-building',
            highlight: '正式进军茶产业'
          },
          { 
            year: '2010', 
            title: '品牌升级', 
            desc: '"八角亭"品牌获得云南省著名商标认证，成为云南省农业产业化重点龙头企业',
            icon: 'el-icon-trophy',
            highlight: '品牌价值显著提升'
          },
          { 
            year: '2017', 
            title: '转型发展', 
            desc: '按照"集团公司—产业集团—专业公司"的模式发展，致力于"云茶"产业打造',
            icon: 'el-icon-refresh',
            highlight: '开启战略转型新征程'
          },
          { 
            year: '2020', 
            title: '科技创新', 
            desc: '与中国农业科学院茶叶研究所建立战略合作，推进茶叶科研和技术创新',
            icon: 'el-icon-data-analysis',
            highlight: '科技赋能产业升级'
          },
          { 
            year: '2023', 
            title: '创新突破', 
            desc: '年产值突破2亿元，实现跨越式发展，产品销海内外',
            icon: 'el-icon-star-off',
            highlight: '迈入高质量发展新阶段'
          }
        ],
        // 添加品质保证数据
        qualityItems: [
          { icon: 'el-icon-first-aid-kit', title: '品质管控', desc: '严格的质量控制体系' },
          { icon: 'el-icon-box', title: '原料精选', desc: '优质茶园基地供应' },
          { icon: 'el-icon-medal-1', title: '多重认证', desc: '国际标准认证保障' }
        ],
        // 修改企业文化数据，删除企业愿景
        culturalValues: [
          { title: '企业使命', content: '致力于"云茶"产业发展，打造农业"小巨人"' },
          { title: '核心价值观', content: '诚信、创新、共赢、发展' }
        ]
      }
    }
  }
  </script>
  
  <style scoped>
  .brand-culture {
    min-height: 100vh;
    background-color: #f7f8fa;
  }
  
  .nav-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 44px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    z-index: 100;
  }
  
  .back-btn {
    position: absolute;
    left: 16px;
    font-size: 20px;
    color: #333;
  }
  
  .nav-title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
  }
  
  .category-nav {
    position: fixed;
    top: 44px;
    left: 0;
    right: 0;
    height: 40px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-around;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    z-index: 99;
  }
  
  .nav-item {
    padding: 8px 16px;
    font-size: 14px;
    color: #666;
    position: relative;
    cursor: pointer;
  }
  
  .nav-item.active {
    color: #8B4513;
    font-weight: 500;
  }
  
  .nav-item.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 2px;
    background: #8B4513;
    border-radius: 1px;
  }
  
  .content {
    padding: 94px 12px 12px;
  }
  
  .section {
    background: #fff;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;
  }
  
  .section-title {
    font-size: 15px;
    font-weight: 500;
    color: #333;
    margin-bottom: 12px;
    padding-left: 8px;
    border-left: 3px solid #8B4513;
  }
  
  .story-text {
    font-size: 14px;
    color: #666;
    line-height: 1.6;
  }
  
  .concept-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .concept-item {
    background: #f8f8f8;
    border-radius: 8px;
    padding: 12px;
  }
  
  .concept-label {
    font-size: 13px;
    color: #666;
    margin-bottom: 4px;
  }
  
  .concept-value {
    font-size: 14px;
    color: #333;
    font-weight: 500;
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .feature-item {
    background: #f8f8f8;
    border-radius: 8px;
    padding: 12px;
  }
  
  .feature-title {
    font-size: 14px;
    color: #333;
    font-weight: 500;
    margin-bottom: 4px;
  }
  
  .feature-desc {
    font-size: 12px;
    color: #666;
    line-height: 1.5;
  }
  
  .culture-content,
  .story-content,
  .company-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .culture-item,
  .value-item {
    background: #f8f8f8;
    border-radius: 8px;
    padding: 16px;
  }
  
  .item-title,
  .value-label {
    font-size: 14px;
    color: #333;
    font-weight: 500;
    margin-bottom: 8px;
  }
  
  .item-text,
  .value-text {
    font-size: 13px;
    color: #666;
    line-height: 1.6;
  }
  
  .company-desc {
    font-size: 14px;
    color: #666;
    line-height: 1.6;
    margin-bottom: 16px;
  }
  
  .company-features {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  /* 修改logo样式 */
  .company-logo {
    width: 120px;
    height: 120px;
    margin: 0 auto 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 2px 12px rgba(139, 69, 19, 0.1);
    overflow: hidden;
  }
  
  .logo-image {
    width: 80%;
    height: 80%;
    object-fit: contain;
  }
  
  /* 数据卡片样式 */
  .data-cards {
    display: flex;
    justify-content: space-between;
    margin: 20px 0;
  }
  
  .data-card {
    flex: 1;
    display: flex;
    align-items: center;
    background: #f8f8f8;
    padding: 12px;
    border-radius: 8px;
    margin: 0 6px;
  }
  
  .data-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #8B4513;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
  }
  
  .data-icon i {
    font-size: 20px;
    color: #fff;
  }
  
  .data-value {
    font-size: 16px;
    font-weight: 500;
    color: #333;
  }
  
  .data-label {
    font-size: 12px;
    color: #666;
  }
  
  /* 品牌卡片样式 */
  .brand-cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    margin-top: 20px;
  }
  
  .brand-card {
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 12px rgba(139, 69, 19, 0.1);
    transition: all 0.3s ease;
    height: 100%;
  }
  
  .brand-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 20px rgba(139, 69, 19, 0.15);
  }
  
  .brand-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }
  
  .brand-logo {
    width: 64px;
    height: 64px;
    border-radius: 8px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(139, 69, 19, 0.1);
    overflow: hidden;
    padding: 8px;
  }
  
  .brand-logo img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  .brand-title {
    font-size: 18px;
    font-weight: 500;
    color: #333;
  }
  
  .brand-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .brand-desc {
    font-size: 14px;
    color: #666;
    line-height: 1.4;
  }
  
  .brand-features {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .feature-tag {
    background: #f8f8f8;
    color: #8B4513;
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 12px;
  }
  
  /* 茶文化卡片样式 */
  .culture-cards {
    display: flex;
    gap: 16px;
    margin-bottom: 20px;
  }
  
  .culture-card {
    flex: 1;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  .card-image {
    height: 120px;
    background-size: cover;
    background-position: center;
  }
  
  .tea-process {
    background-image: linear-gradient(135deg, #8B4513, #D2691E);
  }
  
  .tea-ceremony {
    background-image: linear-gradient(135deg, #D2691E, #8B4513);
  }
  
  .card-content {
    padding: 12px;
  }
  
  /* 认证列表样式 */
  .certification-list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .cert-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: #f8f8f8;
    border-radius: 20px;
    font-size: 13px;
  }
  
  .cert-item i {
    color: #8B4513;
  }
  
  /* 小标题样式 */
  .section-subtitle {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    font-weight: 500;
    color: #333;
    margin: 20px 0 12px;
  }
  
  .section-subtitle i {
    color: #8B4513;
  }
  
  /* 发展目标样式 */
  .goals-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  
  .goal-item {
    background: linear-gradient(135deg, #8B4513, #D2691E);
    padding: 16px;
    border-radius: 8px;
    text-align: center;
    color: #fff;
  }
  
  .goal-icon {
    font-size: 24px;
    margin-bottom: 8px;
  }
  
  .goal-value {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 4px;
  }
  
  .goal-label {
    font-size: 12px;
    opacity: 0.9;
  }
  
  /* 品牌荣誉样式 */
  .honors-list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .honor-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(139, 69, 19, 0.1);
  }
  
  .honor-item i {
    color: #D2691E;
    font-size: 20px;
  }
  
  /* 茶道精神样式 */
  .spirit-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .spirit-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(139, 69, 19, 0.1);
  }
  
  .spirit-icon {
    width: 40px;
    height: 40px;
    background: #8B4513;
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: bold;
  }
  
  .spirit-desc {
    font-size: 14px;
    color: #666;
    line-height: 1.4;
  }
  
  /* 导航项图标样式 */
  .nav-item i {
    margin-right: 4px;
    font-size: 16px;
  }
  
  /* 企业优势样式 */
  .advantages-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-top: 16px;
  }
  
  .advantage-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(139, 69, 19, 0.1);
  }
  
  .advantage-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #8B4513, #D2691E);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 20px;
  }
  
  .advantage-content {
    flex: 1;
  }
  
  .advantage-title {
    font-size: 14px;
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
  }
  
  .advantage-desc {
    font-size: 12px;
    color: #666;
    line-height: 1.4;
  }
  
  /* 品质保证卡片样式 */
  .quality-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 16px;
  }
  
  .quality-card {
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(139, 69, 19, 0.1);
  }
  
  .quality-icon {
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #8B4513, #D2691E);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 12px;
  }
  
  .quality-icon i {
    font-size: 24px;
    color: #fff;
  }
  
  .quality-title {
    font-size: 15px;
    font-weight: 500;
    color: #333;
    margin-bottom: 8px;
  }
  
  .quality-desc {
    font-size: 13px;
    color: #666;
    line-height: 1.4;
  }
  
  /* 优化时间轴样式 */
  .timeline-content {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    background: #fff;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(139, 69, 19, 0.1);
  }
  
  .milestone-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #8B4513, #D2691E);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 20px;
    flex-shrink: 0;
  }
  
  .milestone-info {
    flex: 1;
  }
  
  .milestone-info h4 {
    color: #8B4513;
    margin-bottom: 8px;
    font-size: 16px;
  }
  
  .milestone-info p {
    color: #666;
    font-size: 14px;
    line-height: 1.4;
  }
  
  /* 茶叶知识卡片样式 */
  .knowledge-cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-top: 16px;
  }
  
  .knowledge-card {
    background: #fff;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(139, 69, 19, 0.1);
  }
  
  .knowledge-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #8B4513, #D2691E);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
  }
  
  .knowledge-icon i {
    font-size: 20px;
    color: #fff;
  }
  
  .knowledge-title {
    font-size: 15px;
    font-weight: 500;
    color: #333;
    margin-bottom: 12px;
  }
  
  .knowledge-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
  
  .knowledge-item {
    background: #f8f8f8;
    padding: 8px;
    border-radius: 4px;
    text-align: center;
    font-size: 13px;
    color: #666;
  }
  
  .knowledge-steps {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .step {
    background: #f8f8f8;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 13px;
    color: #666;
    position: relative;
    padding-left: 24px;
  }
  
  .step::before {
    content: '';
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #8B4513;
  }
  
  /* 优化现有样式 */
  .spirit-grid {
    margin-bottom: 24px;
  }
  
  .spirit-item {
    transition: transform 0.3s ease;
  }
  
  .spirit-item:hover {
    transform: translateY(-2px);
  }
  
  .spirit-icon {
    transition: background-color 0.3s ease;
  }
  
  .spirit-item:hover .spirit-icon {
    background: #D2691E;
  }
  
  /* 添加响应式布局 */
  @media screen and (max-width: 480px) {
    .knowledge-cards {
      grid-template-columns: 1fr;
    }
    
    .spirit-grid {
      grid-template-columns: 1fr;
    }
  }
  
  /* 添加新样式 */
  
  /* 企业文化卡片样式 */
  .values-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 16px;
  }
  
  .value-card {
    background: linear-gradient(135deg, #8B4513, #D2691E);
    border-radius: 8px;
    padding: 16px;
    color: #fff;
    text-align: center;
    box-shadow: 0 2px 8px rgba(139, 69, 19, 0.2);
    transition: transform 0.3s ease;
  }
  
  .value-card:hover {
    transform: translateY(-2px);
  }
  
  .value-header {
    font-size: 15px;
    font-weight: 500;
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .value-content {
    font-size: 13px;
    line-height: 1.4;
    opacity: 0.9;
  }
  
  /* 品质保证网格样式 */
  .quality-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 16px;
  }
  
  .quality-item {
    background: #fff;
    border-radius: 8px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 2px 8px rgba(139, 69, 19, 0.1);
    transition: all 0.3s ease;
  }
  
  .quality-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 69, 19, 0.15);
  }
  
  .quality-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #8B4513, #D2691E);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .quality-icon i {
    font-size: 20px;
    color: #fff;
  }
  
  .quality-info {
    flex: 1;
  }
  
  .quality-title {
    font-size: 14px;
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
  }
  
  .quality-desc {
    font-size: 12px;
    color: #666;
    line-height: 1.4;
  }
  
  /* 响应式优化 */
  @media screen and (max-width: 768px) {
    .values-cards,
    .quality-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media screen and (max-width: 480px) {
    .values-cards,
    .quality-grid {
      grid-template-columns: 1fr;
    }
  }
  
  /* 品牌故事板块的新增样式 */
  
  /* 品牌介��卡片样式 */
  .brand-intro {
    background: linear-gradient(135deg, #8B4513, #D2691E);
    border-radius: 12px;
    padding: 20px;
    color: #fff;
    margin-bottom: 24px;
  }
  
  .intro-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }
  
  .intro-icon {
    width: 48px;
    height: 48px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }
  
  .intro-title {
    font-size: 18px;
    font-weight: 500;
  }
  
  .intro-text {
    font-size: 14px;
    line-height: 1.6;
    opacity: 0.9;
  }
  
  /* 时间轴包装器样式 */
  .timeline-wrapper {
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    margin: 20px 0;
    box-shadow: 0 2px 12px rgba(139, 69, 19, 0.1);
  }
  
  .timeline-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 500;
    color: #8B4513;
    margin-bottom: 16px;
  }
  
  /* 优化发展历程样式 */
  .timeline-content {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    background: #fff;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(139, 69, 19, 0.1);
  }
  
  .milestone-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #8B4513, #D2691E);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 20px;
    flex-shrink: 0;
  }
  
  .milestone-info {
    flex: 1;
  }
  
  .milestone-info h4 {
    color: #8B4513;
    margin-bottom: 8px;
    font-size: 16px;
  }
  
  .milestone-info p {
    color: #666;
    font-size: 14px;
    line-height: 1.4;
  }
  
  /* 优化品牌卡片样式 */
  .brand-points {
    list-style: none;
    padding: 0;
    margin: 12px 0;
  }
  
  .brand-points li {
    position: relative;
    padding-left: 20px;
    margin-bottom: 8px;
    font-size: 13px;
    color: #666;
  }
  
  .brand-points li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 8px;
    width: 6px;
    height: 6px;
    background: #8B4513;
    border-radius: 50%;
  }
  
  .feature-tag {
    display: flex;
    align-items: center;
    gap: 4px;
    background: #f8f8f8;
    color: #8B4513;
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 12px;
    transition: all 0.3s ease;
  }
  
  .feature-tag:hover {
    background: #8B4513;
    color: #fff;
  }
  
  .feature-tag i {
    font-size: 14px;
  }
  
  /* 响应式优化 */
  @media screen and (max-width: 480px) {
    .timeline-content {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    
    .brand-points li {
      padding-left: 16px;
    }
  }
  
  /* 优化发展历程样式 */
  .timeline-wrapper {
    padding: 24px;
    background: #fff;
    border-radius: 12px;
    margin: 20px 0;
  }
  
  .timeline-header {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 18px;
    font-weight: 500;
    color: #8B4513;
    margin-bottom: 32px;
    padding-bottom: 12px;
    border-bottom: 2px solid rgba(139, 69, 19, 0.1);
  }
  
  .milestone-list {
    position: relative;
    padding-left: 20px;
  }
  
  .milestone-list::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, #8B4513 50%, transparent 50%);
    background-size: 100% 12px;
  }
  
  .milestone-item {
    position: relative;
    padding: 32px 0;
    padding-left: 40px;
  }
  
  .milestone-date {
    position: absolute;
    left: -80px;
    top: 28px;
    text-align: right;
  }
  
  .year {
    display: block;
    font-size: 24px;
    font-weight: 600;
    color: #8B4513;
    margin-bottom: 4px;
  }
  
  .highlight {
    display: block;
    font-size: 12px;
    color: #D2691E;
    font-weight: 500;
  }
  
  .milestone-line {
    position: absolute;
    left: -20px;
    top: 40px;
    width: 40px;
    height: 2px;
    background: #8B4513;
  }
  
  .line-dot {
    position: absolute;
    left: -4px;
    top: -4px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #8B4513;
    box-shadow: 0 0 0 4px rgba(139, 69, 19, 0.1);
  }
  
  .milestone-card {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    align-items: flex-start;
    gap: 20px;
    box-shadow: 0 2px 12px rgba(139, 69, 19, 0.1);
    transition: all 0.3s ease;
  }
  
  .milestone-card:hover {
    transform: translateX(8px);
    box-shadow: 0 4px 20px rgba(139, 69, 19, 0.15);
    background: linear-gradient(to right, #fff, #fff8f0);
  }
  
  .milestone-icon {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #8B4513, #D2691E);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 28px;
    flex-shrink: 0;
  }
  
  /* 响应式优化 */
  @media screen and (max-width: 768px) {
    .milestone-date {
      position: relative;
      left: 0;
      top: 0;
      text-align: left;
      margin-bottom: 12px;
    }
    
    .year {
      display: inline;
      margin-right: 8px;
    }
    
    .highlight {
      display: inline;
    }
  }
  
  /* 调整品牌部分的间距 */
  .brands-section {
    margin: 24px 0;
  }
  
  .brand-cards {
    margin-top: 16px;
  }
  
  /* 调整时间轴部分的间距 */
  .timeline-wrapper {
    margin-top: 32px;
  }
  
  /* 茶文化板块样式优化 */
  .spirit-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-top: 16px;
  }
  
  .spirit-item {
    background: #fff;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: 0 2px 12px rgba(139, 69, 19, 0.1);
    transition: all 0.3s ease;
  }
  
  .spirit-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 20px rgba(139, 69, 19, 0.15);
  }
  
  .spirit-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #8B4513, #D2691E);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 24px;
    font-weight: bold;
  }
  
  .spirit-content {
    flex: 1;
  }
  
  .spirit-title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
  }
  
  .spirit-desc {
    font-size: 13px;
    color: #666;
    line-height: 1.4;
  }
  
  /* 制茶工艺样式 */
  .craft-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-top: 16px;
  }
  
  .craft-card {
    background: #fff;
    border-radius: 12px;
    padding: 16px;
    text-align: center;
    box-shadow: 0 2px 12px rgba(139, 69, 19, 0.1);
    transition: all 0.3s ease;
  }
  
  .craft-card:hover {
    transform: translateY(-4px);
    background: linear-gradient(to bottom, #fff, #fff8f0);
  }
  
  .craft-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #8B4513, #D2691E);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 12px;
    color: #fff;
    font-size: 24px;
  }
  
  /* 品质保证样式 */
  .quality-cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-top: 16px;
  }
  
  .quality-card {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 2px 12px rgba(139, 69, 19, 0.1);
  }
  
  .quality-icon {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #8B4513, #D2691E);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 12px;
    color: #fff;
    font-size: 28px;
  }
  
  .quality-title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    margin-bottom: 12px;
  }
  
  .quality-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
  }
  
  .quality-list span {
    background: #f8f8f8;
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 13px;
    color: #8B4513;
  }
  
  /* 响应式优化 */
  @media screen and (max-width: 768px) {
    .spirit-grid,
    .craft-cards,
    .quality-cards {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media screen and (max-width: 480px) {
    .spirit-grid,
    .craft-cards,
    .quality-cards {
      grid-template-columns: 1fr;
    }
  }
  </style> 