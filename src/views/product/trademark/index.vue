<template>
  <el-card class="box-card">
    <!-- 卡片顶部操作按钮 -->
    <el-button type="primary" icon="plus" @click="add">添加品牌</el-button>
    <!-- 表格组件:用于展示数据 
    详细API参考:https://element-plus.org/zh-CN/component/table.html#table-column-%E5%B1%9E%E6%80%A7
    -->
    <el-table
      style="margin: 10px 0"
      :border="true"
      :data="trademarksArr"
      size="small"
      height="100%"
    >
      <el-table-column
        label="序号"
        width="80"
        align="center"
        type="index"
      ></el-table-column>
      <el-table-column
        label="品牌名称"
        align="center"
        prop="tmName"
      ></el-table-column>
      <el-table-column label="品牌LOGO" align="center">
        <template #default="{ row }">
          <img
            :src="row.logoUrl"
            alt=""
            style="width: 50px; height: 50px"
          /> </template
      ></el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <el-button type="primary" icon="Edit" circle @click="edit(row)" />
          <el-popconfirm
            width="220"
            confirm-button-text="确定"
            cancel-button-text="取消"
            icon="Delete"
            icon-color="red"
            title="确定执行?"
            @confirm="trademarkDelete(row.id)"
          >
            <template #reference>
              <el-button type="danger" icon="Delete" circle />
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器组件
    详细API参考:https://element-plus.org/en-US/component/pagination.html#buttons-with-background-color
    layout:可以设置分页器六个子组件布局跳转
     -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="limit"
      :page-sizes="[3, 5, 7, 10]"
      :background="true"
      layout="prev, pager, next, jumper, ->,sizes,total"
      :total="total"
      @current-change="gethasTrademark"
      @size-change="sizeChange" 
    />
  </el-card>
  <!-- 对话框组件 -->
  <!-- 通过v-model控制对话框显示与隐藏 布尔值 -->
  <el-dialog
    v-model="dialogFormVisible"
    :title="trademarkForm.id ? '修改品牌' : '添加品牌'"
  >
    <el-form
      style="width: 80%"
      label-width="100px"
      :model="trademarkForm"
      :rules="rules"
      ref="formRef"
    >
      <el-form-item label="品牌名称" prop="tmName">
        <el-input
          placeholder="请输入品牌名称"
          v-model="trademarkForm.tmName"
        ></el-input>
      </el-form-item>
      <el-form-item label="品牌LOGO" prop="logoUrl">
        <!-- action图片上传路径，必选携带api，请求代码 -->
        <el-upload
          class="avatar-uploader"
          action="/api/admin/product/fileUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img
            v-if="trademarkForm.logoUrl"
            :src="trademarkForm.logoUrl"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <!-- 底部：需要传具名插槽 -->
    <template #footer>
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="trademark">
import { ref, onMounted, reactive, nextTick } from "vue";
import {
  reqHasTrademark,
  reqAddOrUpdateTrademark,
  reqDeleteOrUpdateTrademark,
} from "@/api/product/trademark";
import type {
  Records,
  TradMarkResponseData,
  TradMark,
} from "@/api/product/trademark/type";
import type { UploadProps } from "element-plus";
import { ElMessage } from "element-plus";
/* 页码 */
const pageNo = ref<number>(1);
/* 页数 */
const limit = ref<number>(10);
// 获取品牌总数
const total = ref<number>(0);
// 存储已有品牌数据
const trademarksArr = ref<Records>([]);
// 控制对话框显示与隐藏
const dialogFormVisible = ref<Boolean>(false);
// 定义收集表单数据
const trademarkForm = reactive<TradMark>({
  tmName: "",
  logoUrl: "",
});
// 获取品牌接口函数
const gethasTrademark = async (pager = 1) => {
  pageNo.value = pager;
  const result: TradMarkResponseData = await reqHasTrademark(
    pageNo.value,
    limit.value,
  );
  console.log(result, "===result");
  if (result.code == 200) {
    total.value = result.data.total;
    trademarksArr.value = result.data.records;
  }
};
// 获取表单组件实际
const formRef = ref();
// 组件挂载之后函数
onMounted(() => {
  gethasTrademark();
});
/** 分页器下拉菜单发生变化时触发 */
const sizeChange = () => {
  // 当前页数发生变化时将页面改为1
  gethasTrademark();
};
/** 品牌新增 */
const add = async () => {
  dialogFormVisible.value = true;
  // await nextTick() 这个写法效果和下方写法效果一致
  formRef.value?.resetFields();
  // 清空表单
  trademarkForm.id = 0;
  trademarkForm.tmName = "";
  trademarkForm.logoUrl = "";
};
/** 品牌编辑 */
const edit = async (row: TradMark) => {
  console.log(row, "===row");
  dialogFormVisible.value = true;
  await nextTick();
  formRef.value?.resetFields();
  // reactive定义的变量不能直接赋值会失去双向动态绑定数据效果，可以使用assign赋值
  Object.assign(trademarkForm, row);
};
/**对话框确定按钮 */
const confirm = async () => {
  // 对表单进行校验
  await formRef.value.validate();
  const result = await reqAddOrUpdateTrademark(trademarkForm);
  console.log(result, "===result");
  if (result.code == 200) {
    dialogFormVisible.value = false;
    ElMessage.success(result.message || "添加成功");
    // 刷新表格
    gethasTrademark(trademarkForm.id ? pageNo.value : 1);
  } else {
    ElMessage.error(result.message || "添加失败");
  }
};
// 品牌删除
const trademarkDelete = async (id: number) => {
  const result = await reqDeleteOrUpdateTrademark(id);
  if (result.code == 200) {
    ElMessage.success(result.message || "删除成功");
    gethasTrademark(
      trademarksArr.value.length > 1 ? pageNo.value : pageNo.value - 1,
    );
  } else {
    ElMessage.error(result.message || "删除失败");
  }
};
/** 分页器页面发生改变时触发
 * 会回传当前页码数
 */
// const changePageNo = () => {
//   gethasTrademark()
// }
// /** 分页器下拉菜单发生变化时触发 */
// const sizeChange = () => {
//   // 当前页数发生变化时将页面改为1
//   gethasTrademark()
// }
// /** 分页器点击上一页事件 */
// const prevClick = () => {
//   gethasTrademark()
// }
// /** 分页器点击下一页事件 */
// const nextClick = () => {
//   gethasTrademark()
// }
// 上传图片之前触发
const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  // 文件限制：png|jpg||gif 4M
  console.log(rawFile, "===rawFile");
  if (
    rawFile.type !== "image/jpeg" &&
    rawFile.type !== "image/png" &&
    rawFile.type !== "image/gif"
  ) {
    ElMessage.error("上传图片只能是 JPG/PNG/GIF 格式!");
    return false;
  } else {
    console.log(rawFile.size / 1024 / 1024);
    if (rawFile.size / 1024 / 1024 > 4) {
      ElMessage.error("文件大小不能超过4MB");
      return false;
    }
  }
};
// 图片上传成功的钩子
const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile,
) => {
  // response上传图片成功之后服务器返回的数据
  // 手机上传图片的地址，赋值给表单数据
  trademarkForm.logoUrl = response.data;
  console.log(response, uploadFile);
  formRef.value.validateField("logoUrl");
};

const validatorTmName = (_rule: any, value: any, callback: any) => {
  if (value.trim().length >= 2) {
    callback();
  } else {
    // 校验未通过返回的错误信息
    callback(new Error("品牌名称位数大于或等于两位"));
  }
};
const validatorLogoUrl = (_rule: any, value: any, callback: any) => {
  if (value) {
    callback();
  } else {
    // 校验未通过返回的错误信息
    callback(new Error("请上传品牌Logo"));
  }
};
// 表单校验规则对象
const rules = {
  tmName: [
    {
      required: true,
      trigger: "blur",
      validator: validatorTmName,
    },
  ],
  logoUrl: [
    {
      required: true,
      trigger: "blur",
      validator: validatorLogoUrl,
    },
  ],
};
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
