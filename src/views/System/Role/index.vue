<template>
  <div class="role-container">
    <div class="left-wrapper">
      <div
        v-for="(item, index) in roleList"
        :key="item.roleId"
        class="role-item"
        :class="{ active: activeIndex === index }"
        @click="menuChange(index)"
      >
        <div class="role-info">
          <svg-icon :icon-class="activeIndex === index?'user-active':'user'" class="icon" />
          {{ item.roleName }}
        </div>
        <div class="more">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              <svg-icon icon-class="more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="toEdit(item.roleId)">编辑角色</el-dropdown-item>
              <el-dropdown-item @click.native="deleteRole(item.roleId)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <el-button class="addBtn" size="mini" @click="$router.push('/sys/addRole')">添加角色</el-button>
    </div>
    <div class="right-wrapper">
      <el-tabs v-model="activeName">
        <el-tab-pane label="功能权限" name="permission">
          <div class="tree-wrapper">
            <div v-for="item in treeList" :key="item.id" class="tree-item">
              <div class="tree-title"> {{ item.title }} </div>
              <el-tree
                ref="tree"
                :data="item.children"
                :props="defaultProps"
                :default-expand-all="true"
                show-checkbox
                node-key="id"
              />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`成员(${total})`" name="employee">
          <div class="user-wrapper">
            <el-table
              :data="userList"
              style="width: 100%"
            >
              <el-table-column
                type="index"
                width="250"
                label="序号"
              />
              <el-table-column
                prop="name"
                label="员工姓名"
              />
              <el-table-column
                prop="userName"
                label="登录账号"
              />
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { getRoleListAPI, getTreeListAPI, getRoleDetailAPI, getRoleUserListAPI, delRoleUserAPI } from '@/api/system'

export default {
  name: 'Role',
  data() {
    return {
      roleList: [],
      activeIndex: 0, // 默认选中第一个菜单
      treeList: [], // 存储所有的权限列表
      defaultProps: {
        label: 'title',
        disabled: () => true
      },
      activeName: 'permission', // 默认选中功能权限
      params: {
        page: 1,
        pageSize: 10
      },
      total: 0, // 成员总数
      userList: [] // 成员列表
    }
  },
  async created() {
    await this.getRoleList()
    await this.getTreeList()
    this.menuChange(0) // 默认选中第一个角色
  },
  methods: {
    // 删除角色
    deleteRole(id) {
      this.$confirm('您确定要删除该角色吗？', '温馨提示').then(async() => {
        await delRoleUserAPI(id)
        this.$message.success('删除成功')
        this.getRoleList()
      }).catch(() => {})
    },
    toEdit(id) {
      this.$router.push(`/sys/addRole?id=${id}`)
    },
    // 递归调用添加禁用效果
    addDisabledProp(treeList) {
      // console.log(treeList)
      treeList.forEach(item => {
        item.disabled = true
        if (item.children) {
          this.addDisabledProp(item.children)
        }
      })
      // console.log(treeList)
    },
    // 获取所有的权限列表
    async getTreeList() {
      const res = await getTreeListAPI()
      // console.log(res)
      this.treeList = res.data
      // this.addDisabledProp(this.treeList)
    },
    // 点击菜单的事件
    menuChange(index) {
      // console.log(index)
      this.activeIndex = index
      // 获取id
      const roleId = this.roleList[index].roleId
      // console.log('当前选中的角色ID:', roleId)
      // 获取角色回显的权限数据
      this.getRoleDetail(roleId)
      // 获取角色下的成员信息
      this.getRoleUserList(roleId)
    },
    async getRoleUserList(roleId) {
      const res = await getRoleUserListAPI(roleId, this.params)
      // console.log(res)
      this.total = res.data.total
      this.userList = res.data.rows
    },
    // 获取角色对应的权限列表
    async getRoleDetail(roleId) {
      const res = await getRoleDetailAPI(roleId)
      // console.log(res)
      const perms = res.data.perms
      // console.log(this.$refs.tree)
      const treeComponentList = this.$refs.tree
      treeComponentList.forEach((tree, index) => {
        tree.setCheckedKeys(perms[index])
      })
    },
    async getRoleList() {
      const res = await getRoleListAPI()
      // console.log(res)
      this.roleList = res.data
    }
  }
}
</script>

<style scoped lang="scss">
.role-container {
  display: flex;
  font-size: 14px;
  background-color: #fff;
  padding: 20px;

  .left-wrapper {
    width: 200px;
    border-right: 1px solid #e4e7ec;
    padding: 4px;
    text-align: center;

    .role-item {
      position: relative;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      cursor: pointer;

      &.active {
        background: #edf5ff;
        color: #4770ff;
      }
    }

    .role-info {
      display: flex;
      align-items: center;

      .icon {
        margin-right: 10px;
      }
    }

    .more {
      display: flex;
      align-items: center;
    }

    .addBtn {
      width: 100%;
      margin-top: 20px;
    }
  }

  .right-wrapper {
    flex: 1;

    .tree-wrapper {
      display: flex;
      justify-content: space-between;

      .tree-item {
        flex: 1;
        border-right: 1px solid #e4e7ec;
        padding: 0px 4px;
        text-align: center;

        .tree-title {
          background: #f5f7fa;
          text-align: center;
          padding: 10px 0;
          margin-bottom: 12px;
        }
      }
    }

    ::v-deep .el-tabs__nav-wrap {
      padding-left: 20px;
    }

    .user-wrapper {
      padding: 20px;
    }
  }
}
</style>
