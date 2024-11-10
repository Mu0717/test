import { defineStore } from "pinia";
export const useLayOutSettingStore = defineStore("SettingStore", {
  state: () => {
    return {
      fold: false, // 页面是否展开
      refsh: false, // 页面刷新
    };
  },
});
