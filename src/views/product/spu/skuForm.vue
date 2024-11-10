<template>
  <el-form :label-width="80">
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input placeholder="价格(元)" type="number" v-model="skuParams.price"></el-input>
    </el-form-item>
    <el-form-item label="重量(g)">
      <el-input placeholder="重量(g)" type="number" v-model="skuParams.weight"></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input placeholder="SKU描述" type="textarea" v-model="skuParams.skuDesc"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form inline>
        <el-form-item v-for="(v) in attrArr" :key="v.id" :label="v.attrName">
          <el-select v-model="v.attrIdAndValueId">
            <el-option v-for="val in v.attrValueList" :key="val.id" :label="val.valueName"
              :value="`${v.id}:${val.id}`"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form inline>
        <el-form-item v-for="(v) in saleArr" :key="v.id" :label="v.saleAttrName">
          <el-select v-model="v.saleIdAndValueId">
            <el-option v-for="val in v.spuSaleAttrValueList" :key="val.id" :label="val.saleAttrName"
              :value="`${v.id}:${val.id}`"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border :data="imgArr" ref="table">
        <el-table-column type="selection" width="80" align="center"></el-table-column>
        <el-table-column label="图片">
          <template #default="{ row }">
            <img :src="row.imgUrl" alt="" style="width:100px;height:100px">
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="handler(row)">设置默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="$emit('update:scene', 0)">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts" name="skuForm">
import { reqAttr } from "@/api/product/attr";
import { reqSpuImageList, reqSpuHasSaleAttr, skuSaveOrUpdate } from "@/api/product/spu";
import { ref, reactive } from "vue"
import type { AttrList, AttrResponseData } from "@/api/product/attr/type";
import type { SpuData, SaleAttr, SaleAttrResponseData, SpuImg, SpuHasImg, SkuData } from "@/api/product/spu/type";
import { ElMessage } from "element-plus";
const $emit = defineEmits(["update:scene"]);
defineProps(["scene"]);
// 品牌属性
const attrArr = ref<AttrList>([]);
// 销售属性
const saleArr = ref<SaleAttr[]>([]);
// 照片数据
const imgArr = ref<SpuImg[]>([]);
// 获取表格实例
const table = ref<any>()

// 收集sku的数据
let skuParams = reactive<SkuData>({
  // 父组件传递数据
  category3Id: '',
  spuId: '',
  tmId: '',
  // 表单收集数据
  skuName: '',
  price: '',
  weight: '',
  skuDesc: '',
  skuAttrValueList: [],
  skuDefaultImg: '',
  skuSaleAttrValueList: [],
})
// 当前子组件的方法对外暴露
const initAddSkuData = async (c1Id: number, c2Id: number, spu: SpuData) => {
  // console.log(c1Id, c2Id, spu, "initAddSku");
  // 收集数据
  skuParams.category3Id = spu.category3Id;
  skuParams.spuId = spu.id as number;
  skuParams.tmId = spu.tmId;
  // 获取品牌属性
  const result: AttrResponseData = await reqAttr(c1Id, c2Id, spu.category3Id)
  // 获取对应的销售属性
  const result1: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number)
  // 获取照片墙数据
  const result2: SpuHasImg = await reqSpuImageList(spu.id as number)
  // 品牌属性
  attrArr.value = result.data
  // 销售属性
  saleArr.value = result1.data
  // 图片
  imgArr.value = result2.data
}
// 设置默认图片
const handler = (row: SpuImg) => {
  console.log(table.value, '===table');
  imgArr.value.forEach((v: SpuImg) => {
    table.value.toggleRowSelection(v, false)
  })
  table.value.toggleRowSelection(row, true)
  skuParams.skuDefaultImg = row.imgUrl as string;

}
const save = async () => {
  // 平台属性
  skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
    if (next.attrIdAndValueId) {
      const [attrId, valueId] = next.attrIdAndValueId.split(':')
      prev.push({
        attrId,
        valueId,
      })
    }
    return prev
  }, [])
  // 销售属性
  skuParams.skuSaleAttrValueList = saleArr.value.reduce((prev: any, next: any) => {
    if (next.saleIdAndValueId) {
      const [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':')
      prev.push({
        saleAttrId,
        saleAttrValueId,
      })
    }
    return prev
  }, [])
  const result = await skuSaveOrUpdate(skuParams)
  console.log(result, '===result');
  if (result.code == 200) {
    ElMessage.success('添加成功')
    $emit("update:scene", 0);
    Object.assign(skuParams, {
      // 父组件传递数据
      category3Id: '',
      spuId: '',
      tmId: '',
      // 表单收集数据
      skuName: '',
      price: '',
      weight: '',
      skuDesc: '',
      skuAttrValueList: [],
      skuDefaultImg: '',
      skuSaleAttrValueList: [],
    })
  } else {
    ElMessage.error('添加失败')
  }
  console.log(skuParams, '===skuParams');
};
defineExpose({ initAddSkuData })
</script>

<style scoped></style>
