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
      <el-table style="width: 100%" :data="list">
        <el-table-column type="index" label="序号" :index="indexMethod" />
        <el-table-column label="企业名称" width="320" prop="name" />
        <el-table-column label="联系人" prop="contact" />
        <el-table-column
          label="联系电话"
          prop="contactNumber"
        />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="mini" type="text" @click="addRent">添加合同</el-button>
            <el-button size="mini" type="text">查看</el-button>
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
      <div class="form-container" />
      <template #footer>
        <el-button size="mini" @click="closeDialog">取 消</el-button>
        <el-button size="mini" type="primary">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getEnterpriseListAPI, deleteEnterpriseAPI } from '@/api/enterprise'

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
      rentDialogVisible: false // 控制添加合同弹框的显示隐藏
    }
  },
  created() {
    this.getEnterpriseList()
  },
  methods: {
    addRent() {
      this.rentDialogVisible = true
    },
    // 关闭弹框
    closeDialog() {
      this.rentDialogVisible = false
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
      this.list = res.data.rows
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
