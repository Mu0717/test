import { defineComponent, PropType, ref } from "vue";
import { ElPagination } from "element-plus";
import { GreatHump } from "@/utils/index.ts";
console.log("[ ElPagination ] >", ElPagination);
const defaultProps = {
  pageSizes: {
    type: Array as PropType<number[]>,
    default: () => [3, 5, 7, 10],
  },
  layout: {
    type: String,
    default: "prev, pager, next, jumper, ->, sizes,total",
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 3,
  },
  total: {
    type: Number,
    default: 50,
  },
  background: {
    type: Boolean,
    default: true,
  },
};
interface emitsType {
  [key: string]: any;
}
export default defineComponent({
  name: "Pagination",
  props: Object.assign({}, ElPagination.props, defaultProps),
  setup(props, { slots, emit, attrs }) {
    const currentPage = ref<number>(props.currentPage);
    const pageSize = ref<number>(props.pageSize);
    const newEmits = () => {
      const emits: emitsType = {};
      for (const key in ElPagination.emits) {
        if (!key.includes("update:")) {
          emits[GreatHump(key)] = () => {
            if (!attrs[GreatHump(key)]) {
              const keys = ["prev-click", "next-click"];
              if (!attrs[GreatHump("current-change")] && !keys.includes(key)) {
                emit("PaginationChange", currentPage.value, pageSize.value);
              }
            }
          };
        }
      }
      return emits;
    };
    return () => (
      <el-pagination
        {...props}
        v-model:currentPage={currentPage.value}
        v-model:pageSize={pageSize.value}
        v-slots={slots}
        {...newEmits()}
      />
    );
  },
});
