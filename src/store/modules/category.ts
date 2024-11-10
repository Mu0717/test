// 商品分类全局组件小仓库
import { defineStore } from "pinia";
import { reqC1, reqC2, reqC3 } from "@/api/product/attr";
import { CategoryState } from "./types/type";
import type { CategoryResponseData } from "@/api/product/attr/type";
const useCategoryStore = defineStore("Category", {
  state: (): CategoryState => ({
    // 存储一级分类相关数据
    c1Arr: [],
    c1Id: "",
    // 存储二级分类相关数据
    c2Arr: [],
    c2Id: "",
    // 三级分类数据
    c3Arr: [],
    c3Id: "",
  }),
  actions: {
    // 获取一级分类的方法
    async getC1() {
      const result: CategoryResponseData = await reqC1();
      this.c1Arr = result.data;
    },
    // 获取二级分类数据
    async getC2() {
      const result: CategoryResponseData = await reqC2(this.c1Id);
      // console.log(result, '==result');
      this.c2Arr = result.data;
    },
    // 获取二级分类数据
    async getC3() {
      const result: CategoryResponseData = await reqC3(this.c2Id);
      // console.log(result, '==result');
      this.c3Arr = result.data;
    },
  },
});
export default useCategoryStore;
