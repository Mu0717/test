<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input
        placeholder="请输入SPU名称"
        v-model="SpuParams.spuName"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select placeholder="请选择SPU品牌" v-model="SpuParams.tmId">
        <el-option
          v-for="v in AllTradeMark"
          :label="v.tmName"
          :key="v.id"
          :value="v.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        placeholder="请输入SPU描述"
        type="textarea"
        v-model="SpuParams.description"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU照片">
      <el-upload
        v-model:file-list="imgList"
        action="http://sph-api.atguigu.cn/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        accept="image/*"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img
          w-full
          :src="dialogImageUrl"
          alt="Preview Image"
          style="width: 100%; height: 100%"
        />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <el-select
        v-model="saleAttrIdAndValueName"
        :placeholder="
          unSelectSaleAttr.length
            ? `还未选择${unSelectSaleAttr.length}个`
            : '无'
        "
      >
        <el-option
          v-for="v in unSelectSaleAttr"
          :label="v.name"
          :value="`${v.id}:${v.name}`"
          :key="v.id"
        ></el-option>
      </el-select>
      <el-button
        type="primary"
        icon="Plus"
        style="margin-left: 20px"
        :disabled="!saleAttrIdAndValueName"
        @click="addSaleAttr"
        >添加属性</el-button
      >
      <!-- 展示销售属性值 -->
      <el-table style="margin: 10px 0" border :data="saleAttr">
        <el-table-column
          label="序号"
          type="index"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="属性名"
          width="100px"
          align="center"
          prop="saleAttrName"
        ></el-table-column>
        <el-table-column label="属性值">
          <template #default="{ row }">
            <el-tag
              v-for="(v, i) in row.spuSaleAttrValueList"
              :key="v.id"
              closable
              style="margin-right: 5px"
              @close="row.spuSaleAttrValueList.splice(i, 1)"
            >
              {{ v.saleAttrValueName }}
            </el-tag>
            <el-input
              v-model.trim="row.saleAttrValue"
              v-if="row.flag"
              placeholder="请输入属性值"
              style="width: 100px"
              size="small"
              @blur="toLook(row)"
            ></el-input>
            <el-button
              @click="toEdit(row)"
              v-else
              size="small"
              icon="Plus"
              type="primary"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100px">
          <template #default="{ $index }">
            <el-button
              size="small"
              icon="Delete"
              type="danger"
              title="删除SPU"
              @click="saleAttr.splice($index, 1)"
              circle
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save" :disabled="!saleAttr.length"
        >保存</el-button
      >
      <el-button @click="$emit('update:scene', 0)">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts" name="spuForm">
import type {
  SpuData,
  AllTradMark,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
  Trademark,
  SpuImg,
  SaleAttr,
  HasSaleAttr,
  SaleAttrValue,
} from "@/api/product/spu/type";
import {
  reqAllTradeMark,
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqBaseSaleAttrList,
  spuSaveOrUpdate,
} from "@/api/product/spu";
import { ref, computed } from "vue";
import { ElMessage } from "element-plus";
const props = defineProps(["scene", "pageNo"]);
const $emit = defineEmits(["update:scene", "getHasSpu"]);
// 已有SPU的这些数据
const AllTradeMark = ref<Trademark[]>([]);
// 商品图片
const imgList = ref<SpuImg[]>([]);
// 已有SPU销售属性
const saleAttr = ref<SaleAttr[]>([]);
// 全部销售属性
const allSaleAttr = ref<HasSaleAttr[]>([]);
// 存储已有的SPU对象
const SpuParams = ref<SpuData>({
  category3Id: "", // 三级分类ID
  spuName: "", // SPU名称
  description: "", // SPU描述
  tmId: "", // 品牌ID
  spuSaleAttrList: [],
  spuImageList: [],
});
const dialogVisible = ref<boolean>(false);
const dialogImageUrl = ref<string>("");
// 将来收集还未选择的销售属性的ID和名称
const saleAttrIdAndValueName = ref<string>("");
const initHasSpuData = async (row: SpuData) => {
  SpuParams.value = row;
  // 获取全部品牌数据
  const result: AllTradMark = await reqAllTradeMark();
  // 获取某一个品牌旗下售卖的商品图片
  const result1: SpuHasImg = await reqSpuImageList(row.id as number);
  // 获取已有的SPU销售属性
  const result2: SaleAttrResponseData = await reqSpuHasSaleAttr(
    row.id as number
  );
  // 获取全部销售属性
  const result3: HasSaleAttrResponseData = await reqBaseSaleAttrList();
  // console.log(result, result1, result2, result3);
  AllTradeMark.value = result.data;
  imgList.value = result1.data.map((v) => {
    return {
      name: v.imgName,
      url: v.imgUrl,
    };
  });
  saleAttr.value = result2.data;
  allSaleAttr.value = result3.data;
};
// 照片墙预览函数
const handlePictureCardPreview = (file: any) => {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
};
// 当前SPU还未拥有的销售属性
const unSelectSaleAttr = computed(() => {
  // 全部销售属性:颜色,版本,尺码
  // 已有的销售属性:颜色,版本
  return allSaleAttr.value.filter((v) => {
    return saleAttr.value.every((v1) => {
      return v.name != v1.saleAttrName;
    });
  });
});
// 属性添加
const addSaleAttr = () => {
  console.log(saleAttrIdAndValueName.value, "===saleAttrIdAndValueName");
  const [baseSaleAttrId, saleAttrName] =
    saleAttrIdAndValueName.value.split(":");
  const record: SaleAttr = {
    baseSaleAttrId: baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  };
  // 追加到数组当中
  saleAttr.value.push(record);
  saleAttrIdAndValueName.value = "";
};
// 属性值按钮点击事件
const toEdit = (row: SaleAttr) => {
  row.flag = true;
  row.saleAttrValue = "";
};
// 表单元素失去焦点的事件回调
const toLook = (row: SaleAttr) => {
  // 整理收集的属性的ID与属性值的名字
  const { baseSaleAttrId, saleAttrValue, spuSaleAttrValueList } = row;
  // 判空
  if (!saleAttrValue) {
    ElMessage.error("属性只不能为空");
    return;
  }
  // 判重
  const item = spuSaleAttrValueList.find(
    (v) => v.saleAttrValueName == saleAttrValue
  );
  if (item) {
    ElMessage.error("属性只不能重复");
    return;
  }
  const record: SaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue as string,
  };
  spuSaleAttrValueList.push(record);
  row.flag = false;
};
// spu保存
const save = async () => {
  // 整理参数
  // 1:照片墙的数据
  SpuParams.value.spuImageList = imgList.value.map((v: any) => {
    return {
      imgName: v.name,
      imgUrl: (v.response && v.response.data) || v.url,
    };
  });
  //  2:整理销售属性的数据
  SpuParams.value.spuSaleAttrList = saleAttr.value;
  console.log(SpuParams.value, "===SpuParams");
  // 发送请求:添加SPU|更新已有的SPU
  const result = await spuSaveOrUpdate(SpuParams.value);
  console.log(result, "===result");
  if (result.code == 200) {
    ElMessage.success(SpuParams.value.id ? "更新成功" : "保存成功");
    // 通知父组件切换场景为0
    $emit("update:scene", 0);
    console.log(SpuParams.value.id ? props.pageNo : 1);
    $emit("getHasSpu", SpuParams.value.id ? props.pageNo : 1);
  } else {
    ElMessage.error(SpuParams.value.id ? "更新失败" : "保存失败");
  }
};
// SPU新增
const initAddSpu = async (category3Id: string | number) => {
  // 情况数据
  Object.assign(SpuParams.value, {
    category3Id: "", // 三级分类ID
    spuName: "", // SPU名称
    description: "", // SPU描述
    tmId: "", // 品牌ID
    spuSaleAttrList: [],
    spuImageList: [],
  });
  imgList.value = [];
  saleAttr.value = [];
  saleAttrIdAndValueName.value = "";
  // 绑定三级ID
  SpuParams.value.category3Id = category3Id;
  // 获取全部品牌数据
  const result: AllTradMark = await reqAllTradeMark();
  // 获取全部销售属性
  const result3: HasSaleAttrResponseData = await reqBaseSaleAttrList();
  AllTradeMark.value = result.data;
  allSaleAttr.value = result3.data;
};
// 对外暴露
defineExpose({ initHasSpuData, initAddSpu });
</script>

<style scoped></style>
