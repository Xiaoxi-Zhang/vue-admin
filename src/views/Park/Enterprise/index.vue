<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">企业名称：</div>
      <el-input v-model="params.name" clearable placeholder="请输入内容" class="search-main" @clear="search" />
      <el-button type="primary" @click="search">查询</el-button>
    </div>
    <div class="create-container">
      <el-button type="primary" @click="$router.push('/addEnterprise')">添加企业</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="list" @expand-change="expandChange">
        <el-table-column type="expand">
          <template #default="scope">
            <el-table :data="scope.row.rentList">
              <el-table-column label="租赁楼宇" width="320" prop="buildingName" />
              <el-table-column label="租赁起始时间" prop="startTime">
                <template #default="rentObj">
                  {{ rentObj.row.startTime }} 至 {{ rentObj.row.endTime }}
                </template>
              </el-table-column>
              <el-table-column label="合同状态" prop="status">
                <template #default="rentObj">
                  <el-tag :type="formatInfoType(rentObj.row.status)">
                    {{ formatStatus(rentObj.row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180">
                <template #default="rentObj">
                  <el-button size="mini" type="text" :disabled="rentObj.row.status===3" @click="rentingOut(rentObj.row.id)">退租</el-button>
                  <el-button size="mini" type="text" :disabled="rentObj.row.status!==3" @click="delRent(rentObj.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" :index="indexMethod" />
        <el-table-column label="企业名称" width="320" prop="name" />
        <el-table-column label="联系人" prop="contact" />
        <el-table-column
          label="联系电话"
          prop="contactNumber"
        />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="mini" type="text" @click="addRent(scope.row.id)">添加合同</el-button>
            <el-button size="mini" type="text" @click="$router.push(`/enterpriseDetail/${scope.row.id}`)">查看</el-button>
            <el-button size="mini" type="text" @click="toEditPage(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="delEnterprise(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <!-- total 和 page-size是必须要配置的 总页数=total/page-size -->
      <!-- @current-change 必须要配置的，切换页码用的 -->
      <el-pagination
        layout="total, prev, pager, next"
        :total="total"
        :page-size="params.pageSize"
        @current-change="handleChange"
      />
    </div>
    <!-- 添加合同弹框 -->
    <!-- title控制的左上角的文本 -->
    <!-- visible控制弹框的显示隐藏 -->
    <!-- close事件：弹框关闭时，会执行close后面的处理函数 -->
    <!-- close-on-click-modal控制点击模态框是否关闭 -->
    <el-dialog
      title="添加合同"
      :visible="rentDialogVisible"
      width="580px"
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <!-- 表单区域 -->
      <div class="form-container">
        <el-form ref="addForm" :model="rentForm" :rules="rentRules" label-position="top">
          <el-form-item label="租赁楼宇" prop="buildingId">
            <el-select v-model="rentForm.buildingId" placeholder="请选择">
              <el-option
                v-for="item in rentBuildingList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="租赁起止日期" prop="rentTime">
            <el-date-picker
              v-model="rentForm.rentTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="租赁合同" prop="contractId">
            <!-- action:配置默认上传的地址。必须要配置，如果不配置需要加一个# -->
            <!-- http-request 覆盖默认上传 -->
            <!-- :before-upload 上传前的钩子 -->
            <!-- limit 限制用户上传的最大个数 -->
            <!-- on-exceed 超出限制时会自动执行 -->
            <!-- on-remove 文件移除时会自动执行 -->
            <el-upload
              ref="upload"
              action="#"
              :http-request="httpRequest"
              :before-upload="beforeUpload"
              :limit="1"
              :on-exceed="onExceed"
              :on-remove="onRemove"
            >
              <el-button size="small" type="primary" plain>上传合同文件</el-button>
              <div slot="tip" class="el-upload__tip">支持扩展名：.doc .docx .pdf, 文件大小不超过5M</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button size="mini" @click="closeDialog">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmAdd">确 定</el-button>
      </template>
    </el-dialog></div></template>

<script>
import { getEnterpriseListAPI, deleteEnterpriseAPI, getRentBuildingAPI, addRentAPI, getEnterpriseRentBuildingAPI, rentingOutAPI, delRentAPI } from '@/api/enterprise'
import { uploadFileAPI } from '@/api/common'

export default {
  name: 'EnterPrise',
  data() {
    return {
      params: {
        name: '',
        page: 1,
        pageSize: 2
      },
      list: [],
      total: 0,
      rentDialogVisible: false, // 控制添加合同弹框的显示隐藏
      rentForm: {
        buildingId: null, // 租赁楼宇ID
        startTime: '', // 租赁起始时间
        endTime: '', // 租赁结束时间
        contractUrl: '', // 合同附件url
        contractId: null, // 合同附件id
        type: 0, // 添加合同0，续签合同1
        enterpriseId: null, // 企业ID
        rentTime: [] // 租赁起止日期
      },
      rentRules: {
        buildingId: [
          { required: true, message: '请选择租赁楼宇', trigger: 'change' }
        ],
        rentTime: [
          { required: true, message: '请选择租赁起止日期', trigger: 'change' }
        ],
        contractId: [
          { required: true, message: '请上传租赁合同', trigger: 'change' }
        ]
      },
      rentBuildingList: [] // 租赁楼宇列表
    }
  },
  created() {
    this.getEnterpriseList()
  },
  methods: {
    // 删除租赁合同
    delRent(id) {
      this.$confirm('您确定要删除该租赁合同吗？', '温馨提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await delRentAPI(id)
        this.$message({
          type: 'success',
          message: '删除成功！'
        })
        this.getEnterpriseList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 退租
    rentingOut(id) {
      // console.log(id)
      this.$confirm('您确定要退租吗？', '温馨提示').then(async() => {
        await rentingOutAPI(id)
        this.$message.success('退租成功')
        this.getEnterpriseList()
      }).catch(() => {

      })
    },
    // 格式化tag类型
    formatInfoType(status) {
      const MAP = {
        0: 'warning',
        1: 'success',
        2: 'info',
        3: 'danger'
      }
      // return 格式化之后的中文显示
      return MAP[status]
    },
    // 格式化状态
    formatStatus(status) {
      const Map = {
        0: '待生效',
        1: '生效中',
        2: '已到期',
        3: '已退租'
      }
      return Map[status]
    },
    // 点击展开或者关闭都会触发该事件
    // row是当前展开或者关闭那一行的数据
    // expandedRows是当前所有展开行的数据
    async expandChange(row, expandedRows) {
      // console.log(row, expandedRows)
      // 判断当前的状态是展开还是关闭
      const isInclude = expandedRows.find(item => item.id === row.id)
      if (!isInclude) return // 如果不包含，则说明是关闭状态
      // 如果包含，则说明是展开状态
      const res = await getEnterpriseRentBuildingAPI(row.id)
      // console.log(res)
      // eslint-disable-next-line require-atomic-updates
      row.rentList = res.data
      // console.log(row.rentList)
    },
    onRemove() {
      // console.log('文件被移除')
      this.rentForm.contractUrl = '' // 清空合同附件url
      this.rentForm.contractId = null // 清空合同附件id
      this.$refs.addForm.validateField('contractId') // 重新验证合同附件
      this.$message.success('合同文件已删除')
    },
    // 添加租赁合同
    confirmAdd() {
      this.$refs.addForm.validate(async(flag) => {
        if (!flag) return
        // 提交接口
        // this.rentForm.startTime = this.rentForm.rentTime[0]
        // this.rentForm.endTime = this.rentForm.rentTime[1]
        const [startTime, endTime] = this.rentForm.rentTime
        this.rentForm.startTime = startTime
        this.rentForm.endTime = endTime
        delete this.rentForm.rentTime
        await addRentAPI(this.rentForm)
        this.$message.success('添加租赁合同成功')
        this.getEnterpriseList()
        // 关闭弹框+清空数据
        this.closeDialog()
      })
    },
    onExceed() {
      // 超出限制时的提示
      this.$message.warning('只能上传一个合同文件，请先删除已上传的文件')
    },
    // 上传前的校验
    beforeUpload(file) {
      const fileType = [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'application/pdf'
      ]
      const result = fileType.includes(file.type)
      const isLt5M = file.size / 1024 / 1024 < 5
      if (result && isLt5M) {
        this.$message.success('上传文件格式正确，正在上传...')
        return true
      } else {
        this.$message.error('上传文件格式不正确或文件大小超过5M，请重新上传')
        return false
      }
    },
    // 上传文件
    async httpRequest({ file }) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 2) // 2表示合同
      const res = await uploadFileAPI(formData)
      // console.log(res)
      this.rentForm.contractId = res.data.id // 获取上传的合同id
      this.rentForm.contractUrl = res.data.url // 获取上传的合同url
      this.$refs.addForm.validateField('contractId')
    },
    // 添加合同
    async addRent(id) {
      this.rentDialogVisible = true
      this.rentForm.enterpriseId = id
      const res = await getRentBuildingAPI()
      // console.log(res)
      this.rentBuildingList = res.data
    },
    // 关闭弹框
    closeDialog() {
      this.rentDialogVisible = false
      // 清空表单数据
      // resetFields 只能清空绑定了prop的表单域
      // 清空 校验提示
      this.$refs.addForm.resetFields()
      // 清空表单数据
      this.rentForm = {
        buildingId: null,
        startTime: '',
        endTime: '',
        contractUrl: '',
        contractId: null,
        type: 0,
        enterpriseId: null,
        rentTime: []
      }
      this.$refs.upload.clearFiles() // 清空上传的文件
    },
    // 删除企业
    delEnterprise(id) {
      // console.log(id)
      this.$confirm('您确定要删除该企业吗？', '温馨提示').then(async() => {
        await deleteEnterpriseAPI(id)
        this.$message.success('删除成功')
        if (this.list.length === 1 && this.params.page > 1) {
          // 如果删除后当前页没有数据了，且当前页大于1，则将页码减1
          this.params.page--
        }
        this.getEnterpriseList()
      }).catch(() => {

      })
    },
    toEditPage(id) {
      // console.log(id)
      this.$router.push({
        path: '/addEnterprise',
        query: { id }
      })
    },
    // 点击查询按钮
    search() {
      // 重置page为1
      this.params.page = 1
      this.getEnterpriseList()
    },
    // 计算序号
    indexMethod(index) {
      return (this.params.page - 1) * this.params.pageSize + index + 1
    },
    // 点击分页
    handleChange(val) {
      // console.log(val)
      this.params.page = val
      this.getEnterpriseList()
    },
    // 获取企业列表
    async getEnterpriseList() {
      const res = await getEnterpriseListAPI(this.params)
      // console.log(res)
      // 给列表中的每一个数据添加一个额外的属性
      this.list = res.data.rows.map(item => {
        return {
          ...item,
          rentList: []
        }
      })
      this.total = res.data.total
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

<style lang="scss" scoped>
.department-container {
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
