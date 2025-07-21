<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">楼宇名称：</div>
      <el-input v-model="params.name" placeholder="请输入内容" class="search-main" clearable @clear="doSearch" />
      <el-button type="primary" @click="doSearch">查询</el-button>
    </div>
    <!-- 添加楼宇弹框 -->
    <div class="create-container">
      <el-dialog
        :title="title"
        :visible="dialogVisible"
        width="580px"
        @close="closeDialog"
      >
        <!-- 表单接口 -->
        <div class="form-container">
          <el-form ref="addForm" :model="addForm" :rules="addFormRules">
            <el-form-item label="楼宇名称" prop="name">
              <el-input v-model="addForm.name" />
            </el-form-item>
            <el-form-item label="楼宇层数" prop="floors">
              <el-input v-model="addForm.floors" />
            </el-form-item>
            <el-form-item label="在管面积" prop="area">
              <el-input v-model="addForm.area" />
            </el-form-item>
            <el-form-item label="物业费" prop="propertyFeePrice">
              <el-input v-model="addForm.propertyFeePrice" />
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <el-button size="mini" @click="closeDialog">取 消</el-button>
          <el-button type="primary" size="mini" @click="confirmAdd">确 定</el-button>
        </template>
      </el-dialog>
      <el-button type="primary" @click="addBuilding">添加楼宇</el-button>
      <el-button @click="exportExcel">导出Excel</el-button>
    </div>

    <!-- 表格区域 -->
    <div class="table">
      <el-table
        style="width: 100%"
        :data="buildingList"
      >
        <el-table-column
          type="index"
          label="序号"
          :index="indexMethod"
        />
        <el-table-column
          label="楼宇名称"
          width="180"
          prop="name"
        />
        <el-table-column
          label="层数"
          prop="floors"
        />
        <el-table-column
          label="在管面积(m²)"
          width="120"
          prop="area"
        />
        <el-table-column
          label="物业费(元/m²)"
          width="120"
          prop="propertyFeePrice"
        />
        <el-table-column
          label="状态"
          prop="status"
        >
          <template #default="scope">{{ formatStatus(scope.row.status) }}</template>
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template #default="scope">
            <el-button
              size="mini"
              type="text"
              @click="editBuilding(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="text"
              @click="delBuildingList(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页区域 -->
    <div class="page-container">
      <el-pagination
        layout="total, prev, pager, next"
        :total="total"
        @current-change="pageChange"
      />
    </div>
  </div>
</template>

<script>
import { getBuildingListAPI, createBuildingListAPI, delBuildingListAPI, editBuildingListAPI } from '@/api/building'
import { utils, writeFileXLSX } from 'xlsx'

export default {
  name: 'Building',
  data() {
    return {
      addForm: {
        name: '',
        floors: null,
        area: null,
        propertyFeePrice: null
      },
      addFormRules: {
        name: [{ required: true, message: '请输入楼宇名称', trigger: 'blur' }],
        floors: [{ required: true, message: '请输入楼宇层数', trigger: 'blur' }],
        area: [{ required: true, message: '请输入楼宇面积', trigger: 'blur' }],
        propertyFeePrice: [{ required: true, message: '请输入物业费', trigger: 'blur' }]
      },
      buildingList: [], // 楼宇列表
      params: {
        page: 1,
        pageSize: 10,
        name: '' // 楼宇名称搜索参数
      },
      total: 0,
      dialogVisible: false, // 控制弹框显示
      title: '添加楼宇' // 弹框标题
    }
  },
  created() {
    this.getBuildingList()
  },
  methods: {
    // 导出Excel
    async exportExcel() {
      const res = await getBuildingListAPI(this.params)
      const tableHeaderKeys = ['name', 'floors', 'area', 'propertyFeePrice', 'status']
      const statusMap = {
        0: '租赁中',
        1: '空置中'
      }
      // 处理数据
      const sheetData = res.data.rows.map(item => {
        const obj = {}
        tableHeaderKeys.forEach(key => {
          if (key === 'status') {
            obj[key] = statusMap[item[key]]
          } else {
            obj[key] = item[key]
          }
        })
        return obj
      })
      // 要导出的表头
      const tableHeaderValues = ['楼宇名称', '层数', '在管面积(m²)', '物业费(元/m²)', '状态']
      // 创建一个工作表
      const worksheet = utils.json_to_sheet(sheetData)
      // 创建一个新的工作簿
      const workbook = utils.book_new()
      // 将工作表添加到工作簿
      utils.book_append_sheet(workbook, worksheet, 'Data')
      // 改写表头
      utils.sheet_add_aoa(worksheet, [tableHeaderValues], { origin: 'A1' })
      writeFileXLSX(workbook, '楼宇管理.xlsx')
    },
    // 编辑楼宇，回显数据
    editBuilding(row) {
      // 1.打开弹框
      this.dialogVisible = true
      this.title = '编辑楼宇'
      // 2.解构数据
      // console.log('row:', row)
      Object.assign(this.addForm, row)
      // console.log('addForm:', this.addForm)
    },
    delBuildingList(id) {
      this.$confirm('确认删除当前楼宇吗？', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await delBuildingListAPI(id)
        // 如果删除的是最后一条数据，获取列表时，应该让 page--
        if (this.buildingList.length === 1 && this.params.page > 1) {
          this.params.page--
        }
        this.getBuildingList()
        this.$message.success('删除成功')
      }).catch(() => {})
    },
    confirmAdd() {
      this.$refs.addForm.validate(async(valid) => {
        if (valid) {
          // console.log('valid:', valid)
          if (this.addForm.id) {
            // 编辑操作
            // console.log('this.addForm:', this.addForm)
            delete this.addForm.status
            await editBuildingListAPI(this.addForm)
            this.$message.success('编辑成功')
          } else {
            await createBuildingListAPI(this.addForm)
            this.$message.success('添加成功')
          }
          this.getBuildingList()
          this.closeDialog() // 关闭弹框
        }
      })
    },
    addBuilding() {
      this.dialogVisible = true // 显示添加楼宇弹框
      this.title = '添加楼宇'
    },
    closeDialog() {
      this.dialogVisible = false // 关闭弹框
      this.$refs.addForm.resetFields() // 重置表单
      Object.assign(this.addForm, {
        name: '',
        floors: null,
        area: null,
        propertyFeePrice: null
      })
    },
    // 查询搜索
    doSearch() {
      this.params.page = 1 // 重置页码为1
      this.getBuildingList()
    },
    // 分页切换
    pageChange(val) {
      // console.log('当前页:', val)
      this.params.page = val
      this.getBuildingList()
    },
    // 格式化状态
    formatStatus(status) {
      const statusMap = {
        0: '租赁中',
        1: '空置中'
      }
      return statusMap[status]
    },
    // 获取楼宇列表
    async getBuildingList() {
      const res = await getBuildingListAPI(this.params)
      // console.log(res)
      this.buildingList = res.data.rows
      this.total = res.data.total // 存储总条数
    },
    indexMethod(index) {
      return (this.params.page - 1) * this.params.pageSize + index + 1
    }
  }
}
</script>

<style lang="scss" scoped>
.form-container {
  padding: 0px 80px;
}
.create-container{
  margin: 10px 0px;
}
.page-container{
    padding:4px 0px;
    text-align: right;
  }
.department-container{
  padding:10px;
}
.search-container{
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237,237,237,.9);;
  padding-bottom: 20px;
  .search-label{
    width:100px;
  }
  .search-main{
    width: 220px;
    margin-right: 10px;
  }
}
</style>
