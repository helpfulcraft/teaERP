<template>
  <div class="home-page">
    <el-carousel height="400px" :autoplay="true" indicator-position="outside">
      <el-carousel-item v-for="(item, index) in carouselItems" :key="index">
        <div class="carousel-item" :style="{ backgroundImage: `url(${item.imageUrl})` }">
          <div class="carousel-overlay">
            <div class="carousel-content">
              <h2>{{ item.title }}</h2>
              <p>{{ item.description }}</p>
              <!-- <el-button type="primary" @click="navigateTo(item.link)">了解更多</el-button> -->
            </div>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>

    <div class="container">
      <div class="entry-container">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" v-for="(entry, index) in entryItems" :key="index">
            <el-card class="entry-card" @click="$router.push(entry.link)">
              <template #header>
                <div class="card-header">
                  <span>{{ entry.title }}</span>
                  <!-- <el-button type="primary" link @click.stop="$router.push(entry.link)">了解更多</el-button> -->
                </div>
              </template>
              <p>{{ entry.description }}</p>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <div class="news-container">
        <h2>新闻动态</h2>
        <el-timeline>
            <el-timeline-item v-for="item in newsList" :key="item.id" :timestamp="item.date">
                <a :href="item.link" target="_blank">{{ item.title }}</a>
                <p class="news-abstract">{{ item.abstract }}</p>
            </el-timeline-item>
        </el-timeline>
      </div>
    </div>
      <el-footer class="footer">
          <div class="container">
              &copy; 2023 My Tea Company. All rights reserved.
          </div>
      </el-footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const carouselItems = ref([
{ title: '布朗印象', description: '布朗印象普洱茶饼，一款源自云南布朗茶区，承载着历史茶韵的佳茗!', link: '/products/new', imageUrl:'http://www.limingpuer.com/uploadDir/jpg/20240722/1721631314344.jpg'},
  { title: '薄荷塘', description: '用时间检验品质，用匠心守护其真味', link: '/promotion', imageUrl:'http://www.limingpuer.com/uploadDir/jpg/20240819/1724050969487.jpg'},
  { title: '大成南糯', description: '乔木老树，普洱生茶，汤色剔透明亮，久泡有余香', link: '/brand/bajiaoting', imageUrl:'http://www.limingpuer.com/uploadDir/png/20200805/1584272156027.png'},
]);

const entryItems = ref([
  { title: '探索我们的茶叶', description: '精选茶叶，品味生活。', link: '/products' },
  { title: '了解我们的故事', description: '传承文化，品味经典。', link: '/brand' },
]);

const newsList = ref([
  {id:1,date:'2024-01-10', title: "云垦集团荣获茶叶金奖", abstract:"在近日举办的国际茶叶博览会上，云垦集团凭借其卓越的茶叶品质和精湛的制作工艺，荣获了备受瞩目的金奖。", link:"#"},
  {id:2,date:'2023-12-20', title: "探寻嘉木古茶树的千年传奇", abstract:"让我们一同走进云南的原始森林，探寻嘉木古茶树的千年传奇，感受大自然的馈赠与茶文化的底蕴。", link:"#"},
  {id:3,date:'2023-11-15', title: "八角亭茶文化体验活动圆满落幕", abstract:"日前，由云垦集团主办的“品味经典，传承文化”八角亭茶文化体验活动在茶文化博物馆圆满落幕。", link:"#"},
]);

const navigateTo = (link) => {
  router.push(link);
};
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
    overflow-x: hidden; /* 修复可能出现的水平滚动条 */

}
.container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px; /* 添加左右内边距 */
  flex: 1; /* 让container占据剩余空间 */
}
.footer{
    background-color: #f0f0f0;
    padding: 20px 0;
    text-align: center;

}

.carousel-item {
  background-size: cover;
  background-position: center;
  height: 100%;
  position: relative;
  cursor: pointer;
}

.carousel-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4); /* 更深的遮罩 */
  display: flex;
  justify-content: center;
  align-items: center;
}
.carousel-content{
    text-align: center;
    color: white;
    padding: 20px;
}
.carousel-content h2{
    margin-bottom: 10px;
}

.entry-container {
  margin-bottom: 40px; /* 增加底部间距 */
}

.entry-card {
  transition: transform 0.3s, box-shadow 0.3s;
    border-radius: 8px; /* 卡片圆角 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 阴影效果 */
}

.entry-card:hover {
  transform: translateY(-5px); /* 向上 небольшое движение при наведении */
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
    padding: 10px 0; /* 调整header的padding */
}

.news-container {
    margin-top: 20px;
}
.el-timeline{
    padding: 20px;
}
.el-timeline-item__content{
    padding-bottom: 10px;
}

.news-abstract {
  font-size: 14px;
  color: #999;
  margin-top: 5px;
}
</style>