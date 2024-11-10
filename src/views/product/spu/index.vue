<template>
  <div>
    <!-- 三级分类 -->
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0">
      <div v-show="scene == 0">
        <el-button icon="Plus" type="primary" :disabled="!categoryStore.c3Id" @click="addSpu">
          添加SPU
        </el-button>
        <el-table style="margin: 10px 0" border :data="records">
          <el-table-column label="序号" type="index" align="center" width="80"></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column label="SPU描述" prop="description">
            <template #default="{ row }">
              <el-tooltip class="box-item" effect="dark" :content="row.description" placement="top">
                {{ row.description }}
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button type="success" icon="Plus" size="small" circle title="添加SKU" @click="addSku(row)" />
              <el-button size="small" icon="Edit" type="primary" title="修改SPU" circle @click="edit(row)"></el-button>
              <el-button type="warning" icon="View" circle size="small" title="查看SKU列表" @click="findSku(row)" />
              <el-popconfirm title="确定执行此操作?" @confirm="deleteConfirm(row)">
                <template #reference>
                  <el-button size="small" icon="Delete" type="danger" title="删除SPU" circle></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 10]"
          :background="true" layout="prev, pager, next, jumper, ->,sizes,total" :total="total"
          @current-change="getHasSpu" @size-change="sizeChange"  />
      </div>
      <!-- 添加/编辑 spu组件 -->
      <spuForm v-show="scene == 1" v-model:scene="scene" :pageNo="pageNo" @getHasSpu="getHasSpu" ref="SpuForm">
      </spuForm>
      <!-- 添加/编辑 sku组件 -->
      <skuForm v-show="scene == 2" v-model:scene="scene" ref="SkuForm"></skuForm>
      <!-- sku列表 -->
      <el-dialog title="SKU列表" v-model="show">
        <el-table border :data="skuArr">
          <el-table-column label="sku名称" prop="skuName" align="center"></el-table-column>
          <el-table-column label="sku价格" prop="price" align="center"></el-table-column>
          <el-table-column label="sku重量" prop="weight" align="center"></el-table-column>
          <el-table-column label="sku图片">
            <template #default="{ row }">
              <img :src="row.skuDefaultImg" style="width: 100px;height: 100px;">
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="spu">
import type {
  HasSpuResponseData,
  Records,
  SpuData,
} from "@/api/product/spu/type";
import { ref, watch, onBeforeUnmount } from "vue";
import useCategoryStore from "@/store/modules/category";
import { reqHassSpu, reqSkuList, reqRemoveSpu } from "@/api/product/spu";
import { SkuData } from "@/api/product/spu/type.ts";
import spuForm from "./spuForm.vue";
import skuForm from "./skuForm.vue";
import { ElMessage } from "element-plus";
const categoryStore = useCategoryStore();
// 场景数据
const scene = ref<number>(0); // 0:显示已有的SPU 1:SPU新增/编辑 2:SKU新增/编辑
// 分页器页码
const pageNo = ref<number>(1);
// 分页器页数
const pageSize = ref<number>(10);
// 数据总数
const total = ref<number>(0);
const records = ref<Records>([]);
const SpuForm = ref<any>();
const SkuForm = ref<any>();
// 存储sku数据
const skuArr = ref<SkuData[]>([])
const show = ref<boolean>(false);
/**
 * watch侦听仓库里面的值需要使用箭头函数返回
 * 响应性引用：当你使用箭头函数 (=>) 返回 store 中的状态时，这个函数返回的是一个响应式的引用。watch 函数需要侦听一个响应式的源，这样当源数据变化时，watch 才能捕捉到这些变化并执行回调函数。如果直接传递状态值而不使用函数，watch 将不能正确监测到其变化，因为它没有被包裹在一个响应式的引用中。

延迟求值：使用箭头函数可以延迟对 Pinia store 状态的求值。这意味着只有在 watch 实际需要评估其值时，状态才会被访问。这有助于避免不必要的计算，特别是当侦听的状态是由其他几个状态计算而来的复杂状态时。

模块化和维护：通过使用箭头函数，你可以更明确地指示 watch 函数侦听的是哪个具体的状态。这使得代码更加清晰和模块化，也便于未来的维护和理解。

保持上下文：虽然在这个特定的场景中上下文不是主要问题，但在 JavaScript 中，箭头函数没有自己的 this 上下文，它们会捕获其所在上下文的 this 值。在其他情况下，这有助于保持函数内外上下文的一致性，尽管对于 Pinia store 的状态来说，这一点不太重要，因为状态访问通常不依赖于 this。
 */
watch(
  () => categoryStore.c3Id,
  (newVal) => {
    if (!newVal) return;
    getHasSpu();
  }
);
/**
 * 侦听组件中定义的值不响应加箭头函数
 */
/* watch([pageNo, pageSize], (newValue, oldValue) => {
  if (newValue[1] == oldValue[1]) {
    getHasSpu(newValue[0]);
  } else {
    getHasSpu();
  }
}); */
const getHasSpu = async (pager = 1) => {
  pageNo.value = pager;
  const result: HasSpuResponseData = await reqHassSpu(
    pageNo.value,
    pageSize.value,
    categoryStore.c3Id
  );
  if (result.code != 200) return;
  records.value = result.data.records;
  total.value = result.data.total;
};
/** 分页器下拉菜单发生变化时触发 */
const sizeChange = () => {
  // 当前页数发生变化时将页面改为1
  getHasSpu();
};
const edit = async (row: SpuData) => {
  scene.value = 1;
  SpuForm.value.initHasSpuData(row);
};
// 当组件销毁的时候，把分类数据清空
onBeforeUnmount(() => {
  // 清空分类仓库数据
  categoryStore.$reset();
});
// 添加SPU函数
const addSpu = () => {
  scene.value = 1;
  SpuForm.value.initAddSpu(categoryStore.c3Id);
};
/* 添加SKU按钮回调 */
const addSku = (row: SpuData) => {
  scene.value = 2;
  SkuForm.value.initAddSkuData(categoryStore.c1Id, categoryStore.c2Id, row);
};
// sku列表请求
const findSku = async (row: SpuData) => {
  const result = await reqSkuList(row.id as number)
  console.log(result, '===result');
  skuArr.value = result.data
  show.value = true
}

// spu删除
const deleteConfirm = async (row: SpuData) => {
  const result = await reqRemoveSpu(row.id as number)
  if (result.code == 200) {
    getHasSpu(records.value.length > 1 ? pageNo.value : pageNo.value - 1)
    ElMessage.success('删除成功')
  } else {
    ElMessage.error('删除失败')
  }
}
</script>

<style scoped></style>
