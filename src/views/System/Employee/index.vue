<template>
  <div class="employee-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">员工姓名：</div>
      <el-input v-model="params.name" clearable placeholder="请输入内容" class="search-main" @clear="doSearch" />
      <el-button type="primary" @click="doSearch">查询</el-button>
    </div>
    <div class="create-container">
      <el-button type="primary" @click="addEmployee">添加员工</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="employeeList">
        <el-table-column type="index" label="序号" :index="indexMethod" />
        <el-table-column label="员工姓名" width="180" prop="name" />
        <el-table-column label="登录账号" width="180" prop="userName" />
        <el-table-column label="联系方式" width="120" prop="phonenumber" />
        <el-table-column label="角色" width="120" prop="roleName" />
        <el-table-column label="状态">
          <template #default="scope">
            {{ formatStatus(scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column label="添加时间" prop="createTime" />
        <el-table-column label="操作" fixed="right" width="120">
          <template #default="scope">
            <el-button size="mini" type="text" @click="editEmployee(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="delEmployee(scope.row.id)">删除</el-button>
            <el-button size="mini" type="text">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        background
        layout="total, prev, pager, next"
        :page-size="params.pageSize"
        :total="total"
        @current-change="pageChange"
      />
    </div>
    <div>
      <!-- 添加员工 -->
      <el-dialog
        :title="title"
        width="480px"
        :visible="dialogVisible"
        :close-on-click-modal="false"
        @close="closeDialog"
        @open="openDialog"
      >
        <!-- 表单接口 -->
        <div class="form-container">
          <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-width="80px">
            <el-form-item label="员工姓名" prop="name">
              <el-input v-model="addForm.name" />
            </el-form-item>
            <el-form-item label="登录账号" prop="userName">
              <el-input v-model="addForm.userName" />
            </el-form-item>
            <el-form-item label="联系方式" prop="phonenumber">
              <el-input v-model="addForm.phonenumber" />
            </el-form-item>
            <el-form-item label="分配角色" prop="roleId">
              <el-select v-model="addForm.roleId" placeholder="请选择角色">
                <el-option
                  v-for="item in roleList"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="员工状态" prop="status">
              <el-radio-group v-model="addForm.status">
                <el-radio :label="0">禁用</el-radio>
                <el-radio :label="1">启用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <el-button size="mini" @click="closeDialog">取 消</el-button>
          <el-button size="mini" type="primary" @click="confirmAdd">确 定</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getEmployeeListAPI, addEmployeeAPI, delEmployeeAPI, updateEmployeeAPI } from '@/api/employee'
import { getRoleListAPI } from '@/api/system'

export default {
  name: 'Employee',
  data() {
    return {
      dialogVisible: false, // 控制弹框显示
      roleList: [], // 角色列表
      addForm: {
        name: '',
        userName: '',
        phonenumber: '',
        status: 1,
        roleId: null
      },
      addFormRules: {
        name: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
        userName: [{ required: true, message: '请输入登录账号', trigger: 'blur' }],
        phonenumber: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
        roleId: [{ required: true, message: '请分配角色', trigger: 'change' }],
        status: [{ required: true, message: '请选择员工状态', trigger: 'change' }]
      },
      employeeList: [],
      params: {
        name: '',
        page: 1,
        pageSize: 2
      },
      total: 0,
      title: '添加员工'
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    editEmployee(row) {
      this.dialogVisible = true
      this.title = '编辑员工'
      // console.log('row:', row)
      Object.assign(this.addForm, row)
    },
    doSearch() {
      this.params.page = 1 // 重置页码
      this.getEmployeeList()
    },
    // 适配员工状态
    formatStatus(status) {
      return status === 0 ? '禁用' : '启用'
    },
    delEmployee(id) {
      this.$confirm('删除员工后将不可登录，确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // console.log(id)
        await delEmployeeAPI(id)
        // 如果删除的是最后一条数据，获取列表时，应该让 page--
        if (this.employeeList.length === 1 && this.params.page > 1) {
          this.params.page--
        }
        this.$message.success('删除成功')
        this.getEmployeeList()
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    async confirmAdd() {
      this.$refs.addForm.validate(async(valid) => {
        if (!valid) return
        if (this.addForm.id) {
          console.log('this.addForm:', this.addForm)
          await updateEmployeeAPI(this.addForm)
          this.$message.success('编辑成功')
        } else {
          await addEmployeeAPI(this.addForm)
          this.$message.success('添加成功')
        }
      })
      this.getEmployeeList()
      this.closeDialog()
    },
    async openDialog() {
      const res = await getRoleListAPI()
      // console.log(res)
      this.roleList = res.data
    },
    closeDialog() {
      this.dialogVisible = false
      // 重置表单
      this.$refs.addForm.resetFields()
      Object.assign(this.addForm, {
        name: '',
        userName: '',
        phonenumber: '',
        status: 1,
        roleId: null
      })
    },
    addEmployee() {
      this.dialogVisible = true
      this.title = '添加员工'
    },
    indexMethod(index) {
      return (this.params.page - 1) * this.params.pageSize + index + 1
    },
    pageChange(val) {
      // console.log(val)
      this.params.page = val
      this.getEmployeeList()
    },
    async getEmployeeList() {
      const res = await getEmployeeListAPI(this.params)
      // console.log(res)
      this.employeeList = res.data.rows
      this.total = res.data.total
    }
  }
}
</script>

<style lang="scss" scoped>
.employee-container {
  padding: 10px;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
  ;
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
.form-container{
  padding:0px 80px;
}
</style>
