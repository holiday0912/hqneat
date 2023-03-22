<template>
  <el-row :gutter="gutter" :type="type" :justify="justify">
    <el-col :span="span">
       <slot name="left"></slot>
    </el-col>
    <el-col :span="span">
       <slot name="right"></slot>
    </el-col>
  </el-row>
</template>

<script>
export default {
    props:{
        gutter:{
            type:Number,
            default:22,
        },
        span:{
            type:Number,
            default:11,
        },
        type:{
            type:String,
            default:'flex'
        },
        justify:{
            type:String,
            default:'center'
        },
    }
};
</script>

<style>
</style>
