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
            <el-button size="mini" type="text">添加合同</el-button>
            <el-button size="mini" type="text">查看</el-button>
            <el-button size="mini" type="text" @click="toEditPage(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
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
  </div>
</template>

<script>
import { getEnterpriseListAPI } from '@/api/enterprise'

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
      total: 0
    }
  },
  created() {
    this.getEnterpriseList()
  },
  methods: {
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
