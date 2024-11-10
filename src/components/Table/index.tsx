import { defineComponent, PropType, ref } from "vue";
import { ElTable, ElTableColumn } from "element-plus";
import Pagination from "../Pagination";
// import { GreatHump } from "@/utils/index.ts";
// 提取 ElTable 和 ElTableColumn 的 props 类型
type ElTableProps = {
  [K in keyof typeof ElTable.props]: (typeof ElTable.props)[K] extends PropType<
    infer T
  >
    ? T
    : any;
};
type ElTableColumnProps = {
  [K in keyof typeof ElTableColumn.props]: (typeof ElTableColumn.props)[K] extends PropType<
    infer T
  >
    ? T
    : any;
};

// 定义 Column 类型，从 ElTableColumnProps 中提取实际的类型
type Column = {
  [K in keyof ElTableColumnProps]?: ElTableColumnProps[K];
};

// 定义自定义的 props1 类型
/* type Props1 = {
  columns: Column[];
}; */

/* // 合并 ElTableProps 和 Props1 类型
type CombinedProps = ElTableProps & Props1; */

interface PropValue {
  type: PropType<any>;
  required?: boolean;
}

// 定义 newProps 类型
type NewPropsType = Record<string, PropValue>;
const newProps: NewPropsType = {
  columns: {
    type: Array as PropType<Column[]>,
    required: true,
  },
  loadData: {
    type: Function as PropType<() => void>,
    required: true,
  },
};
// 合并 ElTableProps 和 NewPropsType 类型
type CombinedProps = ElTableProps & NewPropsType;
// 定义 STable 组件
export default defineComponent({
  name: "STable",
  props: Object.assign({}, ElTable.props, newProps),
  setup(props: CombinedProps, { slots, attrs }) {
    /* console.log("[ attrs ] >", attrs);
    console.log("[ ElTable ] >", ElTable, ElTable.emits); */
    const data = ref<Array<any>>([]);
    props.loadData({ page: 1, pageSize: 3 }).then((res: any) => {
      data.value = res.data.records;
    });
    /* const result = await props.loadData({ page: 1, pageSize: 3 });
    data.value = result.data.records; */
    const PaginationChange = async (page: number, pageSize: number) => {
      // console.log("[ PaginationChange ] >", page, pageSize);
      const params = {
        page,
        pageSize,
      };
      const result = await props.loadData(params);
      data.value = result.data.records;
      console.log("[ result ] >", result);
    };
    return () => (
      <div>
        <el-table {...props} v-slots={slots} {...attrs} data={data.value}>
          {props.columns.map((item: Column) => {
            return <el-table-column {...item} v-slots={item.slots || {}} />;
          })}
        </el-table>
        <Pagination onPaginationChange={PaginationChange}></Pagination>
      </div>
    );
  },
});
