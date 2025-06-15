<template>
  <div class="rule-container">
    <div class="create-container">
      <el-button type="primary">增加停车计费规则</el-button>
      <el-button @click="exportExcel">导出Excel</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table :data="ruleList" style="width: 100%">
        <el-table-column label="序号" type="index" :index="indexMethod" />
        <el-table-column label="计费规则编号" prop="ruleNumber" />
        <el-table-column label="计费规则名称" prop="ruleName" />
        <el-table-column label="免费时长(分钟)" prop="freeDuration" />
        <el-table-column label="收费上限(元)" prop="chargeCeiling" />
        <el-table-column label="计费方式" prop="chargeType" />
        <el-table-column label="计费规则" prop="ruleNameView" />
        <el-table-column label="操作" fixed="right" width="120">
          <template #default="scope">
            <el-button size="mini" type="text">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 必须的配置项 total page-size 总页数=总条数/页容量 -->
      <!-- 必须配置的事件 @current-change -->
      <div class="pager" style="margin-top: 10px;float: right;">
        <el-pagination
          layout="prev, pager, next"
          :total="total"
          :page-size="listParams.pageSize"
          @current-change="handleChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getRuleListAPI } from '@/api/carrule'
import { utils, writeFileXLSX } from 'xlsx'

export default {
  name: 'Building',
  data() {
    return {
      listParams: {
        page: 1,
        pageSize: 2
      },
      ruleList: [], // 停车计费规则列表
      total: 0
    }
  },
  created() {
    this.getRuleList()
  },
  methods: {
    exportExcel() {
      // 创建一个新的工作簿
      const workbook = utils.book_new()
      // 创建一个工作表 要求一个对象数组格式
      const worksheet = utils.json_to_sheet(
        [
          { name: '张三', age: 18 },
          { name: '李四', age: 28 }
        ]
      )

      // 把工作表添加到工作簿  Data为工作表名称
      utils.book_append_sheet(workbook, worksheet, 'Data')
      // 改写表头
      utils.sheet_add_aoa(worksheet, [['姓名', '年龄']], { origin: 'A1' })
      // 导出方法进行导出
      writeFileXLSX(workbook, 'SheetJSVueAoO.xlsx')
    },
    indexMethod(row) {
      return (this.listParams.page - 1) * this.listParams.pageSize + row + 1
    },
    // 点击不同页码
    handleChange(val) {
      // console.log(val)
      this.listParams.page = val
      this.getRuleList()
    },
    // 获取停车计费规则列表
    async getRuleList() {
      const res = await getRuleListAPI(this.listParams)
      // console.log(res)
      this.ruleList = res.data.rows
      this.total = res.data.total
    }
  }
}
</script>

<style lang="scss" scoped>
.rule-container {
  padding: 20px;
  background-color: #fff;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
  padding-bottom: 20px;

  .search-label {
    width: 100px;
  }

  .search-main {
    width: 220px;
    margin-right: 10px;
  }
}
.create-container{
  margin: 10px 0px;
}
.page-container{
  padding:4px 0px;
  text-align: right;
}
</style>
