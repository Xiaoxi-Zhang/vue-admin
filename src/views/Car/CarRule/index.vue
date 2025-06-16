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
    <!-- 弹框 -->
    <el-dialog :visible="dialogVisible" width="680px" title="新增规则" :close-on-click-modal="false" @close="closeDialog">
      <!-- 表单接口 -->
      <div class="form-container">
        <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-position="top">
          <el-form-item label="计费规则编号" prop="ruleNumber">
            <el-input v-model="addForm.ruleNumber" />
          </el-form-item>
          <el-form-item label="计费规则名称" prop="ruleName">
            <el-input v-model="addForm.ruleName" />
          </el-form-item>
          <el-form-item label="计费方式" prop="chargeType">
            <el-radio-group v-model="addForm.chargeType" size="small">
              <el-radio label="duration" border>时长收费</el-radio>
              <el-radio label="turn" border>按次收费</el-radio>
              <el-radio label="partition" border>分段收费</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="flex-container" style="display:flex;justify-content:space-between">
            <el-form-item label="免费时长">
              <el-input v-model="addForm.freeDuration" />
            </el-form-item>
            <el-form-item label="收费上限">
              <el-input v-model="addForm.chargeCeiling" />
            </el-form-item>
          </div>
          <el-form-item label="计费规则">
            <!-- 按时长收费区域 -->
            <div class="duration" style="display:flex">
              每 <el-input v-model="addForm.durationTime" class="input-box" />
              小时
              <el-input v-model="addForm.durationPrice" class="input-box" /> 元
            </div>
            <!-- 按次收费区域 -->
            <div class="turn" style="display:flex">
              每次<el-input v-model="addForm.turnPrice" class="input-box" style="width:150px" /> 元
            </div>
            <!-- 按分段收费区域 -->
            <div class="partition">
              <div class="item" style="display:flex">
                <el-input v-model="addForm.partitionFrameTime" class="input-box" style="width:100px" />
                小时内,每小时收费
                <el-input v-model="addForm.partitionFramePrice" class="input-box" style="width:100px" />
                元
              </div>
              <div class="item" style="display:flex;margin:30px auto 0">
                每增加
                <el-input v-model="addForm.partitionIncreaseTime" class="input-box" style="width:120px;" />
                小时,增加
                <el-input v-model="addForm.partitionIncreasePrice" class="input-box" style="width:120px;" />
                元
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button size="mini" @click="closeDialog">取 消</el-button>
        <el-button size="mini" type="primary">确 定</el-button>
      </template>
    </el-dialog>
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
      total: 0,
      dialogVisible: false, // 弹框是否显示
      addForm: {
        ruleNumber: '', // 计费规则编号
        ruleName: '', // 计费规则名称
        chargeType: 'duration', // 计费规则类型 duration / turn / partition
        chargeCeiling: null,
        freeDuration: null,
        // 时长计费独有字段
        durationTime: null, // 时长计费单位时间
        durationPrice: null, // 时长计费单位价格
        durationType: 'hour',
        // 按次收费独有字段
        turnPrice: null,
        // 分段计费独有字段
        partitionFrameTime: null, // 段内时间
        partitionFramePrice: null, // 段内费用
        partitionIncreaseTime: null, // 超出时间
        partitionIncreasePrice: null // 超出费为收费价钱
      },
      addFormRules: {
        ruleNumber: [{ required: true, message: '请输入规则编号', trigger: 'blur' }],
        ruleName: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
        chargeType: [{ required: true, message: '请选择收费类型', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getRuleList()
  },
  methods: {
    // 打开新增计费规则弹框
    addFeeRule() {
      this.dialogVisible = true
    },
    closeDialog() {
      this.dialogVisible = false
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
