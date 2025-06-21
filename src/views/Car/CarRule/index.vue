<template>
  <div class="rule-container">
    <div class="create-container">
      <el-button type="primary" @click="addFeeRule">增加停车计费规则</el-button>
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
        <el-table-column label="计费方式" prop="chargeType">
          <template #default="scope">
            {{ formateChargeType(scope.row.chargeType) }}
          </template>
        </el-table-column>
        <el-table-column label="计费规则" prop="ruleNameView" />
        <el-table-column label="操作" fixed="right" width="120">
          <template #default="scope">
            <el-button size="mini" type="text" @click="editRule(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="deleteFeeRule(scope.row.id)">删除</el-button>
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
    <AddRule ref="editFeeRule" :dialog-visible.sync="dialogVisible" @getList="getRuleList" />
  </div>
</template>

<script>
import { getRuleListAPI, deleteFeeRuleAPI } from '@/api/carrule'
import { utils, writeFileXLSX } from 'xlsx'
import AddRule from './components/AddRule.vue'

export default {
  name: 'Building',
  components: {
    AddRule
  },
  data() {
    return {
      listParams: {
        page: 1,
        pageSize: 2
      },
      ruleList: [], // 停车计费规则列表
      total: 0,
      dialogVisible: false // 弹框是否显示
    }
  },
  created() {
    this.getRuleList()
  },
  methods: {
    editRule(id) {
      this.dialogVisible = true
      this.$refs.editFeeRule.getFeeRuleDetail(id)
      this.$refs.editFeeRule.title = '修改规则'
    },
    // 删除计费规则
    deleteFeeRule(id) {
      this.$confirm('您确定要删除该计费规则吗？', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteFeeRuleAPI(id)
        this.$message.success('删除成功')
        if (this.ruleList.length === 1 && this.listParams.page > 1) {
          this.listParams.page -= 1 // 如果删除的是最后一页的唯一数据，则跳转到上一页
        }
        this.getRuleList()
      }).catch(() => {})
    },
    // 打开新增计费规则弹框
    addFeeRule() {
      this.dialogVisible = true
      this.$refs.editFeeRule.title = '新增规则'
    },
    // 格式化计费类型
    formateChargeType(chargeType) {
      const Map = {
        duration: '时长收费',
        turn: '按次收费',
        partition: '分段收费'
      }
      return Map[chargeType]
    },
    // 导出Excel
    async exportExcel() {
      const res = await getRuleListAPI(this.listParams)
      // 要导出的字段名
      const tableHeaderKeys = ['ruleNumber', 'ruleName', 'freeDuration', 'chargeCeiling', 'chargeType', 'ruleNameView']
      const list = res.data.rows.map(item => {
        const obj = {}
        tableHeaderKeys.forEach(key => {
          obj[key] = item[key]
        })
        return obj
      })
      // 要导出的表头
      const tableHeaderValues = ['计费规则编号', '计费规则名称', '免费时长(分钟)', '收费上线(元)', '计费方式', '计费规则']
      // 创建一个新的工作簿
      const workbook = utils.book_new()
      // 创建一个工作表 要求一个对象数组格式
      const worksheet = utils.json_to_sheet(list)
      // 把工作表添加到工作簿  Data为工作表名称
      utils.book_append_sheet(workbook, worksheet, 'Data')
      // 改写表头
      utils.sheet_add_aoa(worksheet, [tableHeaderValues], { origin: 'A1' })
      // 导出方法进行导出
      writeFileXLSX(workbook, '计费规则表.xlsx')
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
