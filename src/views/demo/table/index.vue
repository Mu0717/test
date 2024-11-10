<template>
  <div>
    <Table
      :stripe="true"
      :columns="columns"
      border
      @selection-change="selectChang"
      :loadData="loadData"
    >
    </Table>
  </div>
</template>

<script setup lang="tsx">
import Table from "@/components/Table";
import { ElTableColumn } from "element-plus";
import { reqHasTrademark } from "@/api/product/trademark";
// 创建一个 Column 类型，利用 Partial 来使所有属性变为可选
const columns: Array<typeof ElTableColumn.props> = [
  {
    type: "selection",
  },
  {
    type: "index",
    label: "序号",
    width: 60,
  },
  {
    label: "品牌名称",
    prop: "tmName",
  },
  {
    label: "品牌LOGO",
    prop: "name",
    slots: {
      default: (item: any) => {
        const { row } = item;
        return (
          <img src={row.logoUrl} alt="" style="width: 50px; height: 50px" />
        );
      },
    },
  },
  {
    label: "操作",
    prop: "action",
    width: 180,
    slots: {
      default: (item: any) => {
        const { row } = item;
        return (
          <div>
            <el-popconfirm
              title="确认执行此操作?"
              onConfirm={() => handleDelete(row)}
            >
              {{
                reference: () => (
                  <el-button
                    size="small"
                    icon="delete"
                    type="danger"
                  ></el-button>
                ),
              }}
            </el-popconfirm>
          </div>
        );
      },
      /* header: (item: any) => {
        console.log("[ item ] >", item);
        return <div style={{ color: "red" }}>测试</div>;
      }, */
    },
  },
];
const handleDelete = (item: any) => {
  console.log("[ item ] >", item);
};
const selectChang = (selectIds: any) => {
  console.log("[ selectChang ] >", selectIds);
};
const loadData = (params: any) => {
  console.log("[ loadData ] >", params);
  return reqHasTrademark(params.page, params.pageSize);
};
</script>

<style scoped></style>
