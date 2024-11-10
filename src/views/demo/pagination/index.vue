<template>
  <div>
    <Pagination
      @PaginationChange="PaginationChange"
      @nextClick="nextClick"
      @sizeChange="sizeChange"
      @currentChange="currentChange"
      @prevClick="prevClick"
    >
    </Pagination>
  </div>
</template>

<script setup lang="tsx">
import Pagination from "@/components/Pagination";
const sizeChange = () => {
  console.log("[ sizeChange ] >");
};
const PaginationChange = () => {
  console.log("[ PaginationChange ] >");
};
const currentChange = () => {
  console.log("[ currentChange ] >");
};
const prevClick = () => {
  console.log("[ prevClick ] >");
};
const nextClick = () => {
  console.log("[ nextClick ] >");
};
</script>

<style scoped></style>
