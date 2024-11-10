<template>
  <el-card>
    <el-table border style="margin: 10px 0;" :data="skuArr">
      <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
      <el-table-column label="名称" show-overflow-tooltip width="150px" prop="skuName"></el-table-column>
      <el-table-column label="描述" show-overflow-tooltip width="150px" prop="skuDesc"></el-table-column>
      <el-table-column label="图片" width="200px">
        <template #default="{ row }">
          <img :src="row.skuDefaultImg" style="width: 100px; height: 100px;">
        </template>
      </el-table-column>
      <el-table-column label="重量" width="200px" prop="weight"></el-table-column>
      <el-table-column label="价格" width="200px" prop="price"></el-table-column>
      <el-table-column label="操作" fixed="right">
        <template #default="{ row }">
          <el-button size="small" :icon="!!row.isSale ? 'Download' : 'Top'" type="primary"
            @click="updateSale(row)"></el-button>
          <el-button size="small" icon="Edit" type="primary" @click="updateSku"></el-button>
          <el-button size="small" icon="InfoFilled" type="primary" @click="infoFilled(row)"></el-button>
          <el-popconfirm title="确认执行此操作?" @confirm="handleDelete(row)">
            <template #reference>
              <el-button size="small" icon="delete" type="primary"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 10]"
      :background="true" layout="prev, pager, next, jumper, ->,sizes,total" :total="total" @current-change="getHasSku"
      @size-change="sizeChange" />
    <el-drawer v-model="drawer" title="查看商品详情" :before-close="() => drawer = false">
      <template #default>
        <el-row style="margin: 10px 0;">
          <el-col :span="6">名称</el-col>
          <el-col :span="18">{{ skuInfoData.skuName }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0;">
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{ skuInfoData.skuDesc }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0;">
          <el-col :span="6">价格</el-col>
          <el-col :span="18">{{ skuInfoData.price }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0;">
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18"><el-tag style="margin: 5px 0;" v-for="v in skuInfoData.skuAttrValueList" :key="v.id">
              {{ v.valueName }}
            </el-tag></el-col>
        </el-row>
        <el-row style="margin: 10px 0;">
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag style="margin: 5px 0;" v-for="v in skuInfoData.skuSaleAttrValueList" :key="v.id">
              {{ v.saleAttrValueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0;">
          <el-col :span="6">商品图片</el-col>
          <el-col :span="24"><el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item v-for="v in skuInfoData.skuImageList" :key="v.id">
                <!-- <h3 text="2xl" justify="center">{{ item }}</h3> -->
                <img :src="v.imgUrl" style="height: 100%;width: 100%;">
              </el-carousel-item>
            </el-carousel></el-col>
        </el-row>
      </template>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts" name="sku">
import { ref, onMounted } from 'vue'
// 引入请求
import { reqSkuList, reqOnSale, reqCancelSale, reqSkuInfo, reqDeleteSku } from '@/api/product/sku'
import type { SkuResponseData, SkuInfoData } from '@/api/product/sku/type.ts'
import type { SkuData } from '@/api/product/spu/type.ts'
import { ElMessage } from 'element-plus'
// 获取已有的sku
const pageNo = ref<number>(1)
const pageSize = ref<number>(5)
const total = ref<number>(0)
const skuArr = ref<SkuData[]>([])
const drawer = ref<boolean>(false)
// const skuInfoData = ref<SkuData>({} as SkuData)
const skuInfoData = ref<any>({})
const getHasSku = async (pager = 1) => {
  pageNo.value = pager
  // 获取已有的sku
  const result: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value)
  if (result.code === 200) {
    total.value = result.data.total
    skuArr.value = result.data.records
  }
}
const sizeChange = (limit: number) => {
  // 切换每页显示条数
  pageSize.value = limit
  getHasSku()
}
// 商品上架与下架操作
const updateSale = async (row: SkuData) => {
  // isSale等于1表示当前是上架状态，与之相反
  if (row.isSale == 1) {
    const result: any = await reqOnSale(row.id as number)
    if (result.code === 200) {
      row.isSale = 0
      ElMessage.success('下架成功')
    } else {
      ElMessage.success('下架失败')
    }
  } else {
    const result: any = await reqCancelSale(row.id as number)
    if (result.code === 200) {
      row.isSale = 1
      ElMessage.success('上架成功')
    } else {
      ElMessage.success('上架失败')
    }
  }
}
// 更新已有sku
const updateSku = () => {
  ElMessage.success('功能正在开发中...')
}
const infoFilled = async (row: SkuData) => {
  const result: SkuInfoData = await reqSkuInfo(row.id as number)
  console.log('[ result ] >', result)
  if (result.code === 200) {
    skuInfoData.value = result.data
    drawer.value = true
  }
}
const handleDelete = async (row: SkuData) => {
  const result = await reqDeleteSku(row.id as number)
  console.log('[ result ] >', result)
  if (result.code === 200) {
    ElMessage.success('删除成功')
    getHasSku(skuArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage.error('删除失败')
  }
}
onMounted(() => {
  getHasSku()
})
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
