<template>
  <div class="add-enterprise">
    <header class="add-header">
      <div class="left">
        <span class="arrow" @click="$router.back()"><i class="el-icon-arrow-left" />返回</span>
        <span>|</span>
        <span>{{ id?"编辑企业":"添加企业" }}</span>
      </div>
      <div class="right">
        超级管理员
      </div>
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">企业信息</div>
        <div class="form">
          <!-- :model  :rules  prop  v-model -->
          <el-form ref="ruleForm" label-width="100px" :model="addForm" :rules="rules">
            <el-form-item label="企业名称" prop="name">
              <el-input v-model="addForm.name" />
            </el-form-item>
            <el-form-item label="法人" prop="legalPerson">
              <el-input v-model="addForm.legalPerson" />
            </el-form-item>
            <el-form-item label="注册地址" prop="registeredAddress">
              <el-input v-model="addForm.registeredAddress" />
            </el-form-item>
            <el-form-item label="所在行业" prop="industryCode">
              <el-select v-model="addForm.industryCode">
                <el-option v-for="item in list" :key="item.industryCode" :label="item.industryName" :value="item.industryCode" />
              </el-select>
            </el-form-item>
            <el-form-item label="企业联系人" prop="contact">
              <el-input v-model="addForm.contact" />
            </el-form-item>
            <el-form-item label="联系电话" prop="contactNumber">
              <el-input v-model="addForm.contactNumber" />
            </el-form-item>
            <el-form-item label="营业执照" prop="businessLicenseUrl">
              <!-- action 是一个必传属性，配置的是上传文件的路径。但是不灵活，一般不用 -->
              <!-- action 即使不用，也得配置。如果没配置上传路径，需要用#代替 -->
              <!-- 上传前执行 -->
              <el-upload
                class="upload-demo"
                action="#"
                :http-request="uploadImage"
                :before-upload="beforeUpload"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传.png .jpg .jpeg文件，且不超过5M</div>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button>重置</el-button>
        <el-button type="primary" @click="confirmAdd">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { getIndustryListAPI, addEnterpriseAPI } from '@/api/enterprise'
import { uploadFileAPI } from '@/api/common'

export default {
  data() {
    return {
      addForm: {
        name: '', // 企业名称
        legalPerson: '', // 法人
        registeredAddress: '', // 注册地址
        industryCode: '', // 所在行业
        contact: '', // 企业联系人
        contactNumber: '', // 联系人电话
        businessLicenseUrl: '', // 营业执照url
        businessLicenseId: '' // 营业执照id
      },
      list: [],
      rules: {
        name: [
          { required: true, message: '企业名称为必填项', trigger: 'blur' }
        ],
        legalPerson: [
          { required: true, message: '法人为必填项', trigger: 'blur' }
        ],
        registeredAddress: [
          { required: true, message: '注册地址为必填项', trigger: 'blur' }
        ],
        industryCode: [
          { required: true, message: '所在行业为必填项', trigger: 'change' }
        ],
        contact: [
          { required: true, message: '企业联系人为必填项', trigger: 'blur' }
        ],
        contactNumber: [
          { required: true, message: '联系电话为必填项', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        businessLicenseUrl: [
          { required: true, message: '营业执照为必填项', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    id() {
      return this.$route.query.id // 获取路由参数id
    }
  },
  created() {
    this.getIndustryList()
  },
  methods: {
    // 确认添加
    confirmAdd() {
      this.$refs.ruleForm.validate(async(flag) => {
        if (!flag) return
        // console.log('可以请求接口')
        await addEnterpriseAPI(this.addForm)
        this.$message.success('企业添加成功')
        this.$router.go(-1) // 返回上一页
      })
    },
    // 上传前的校验
    beforeUpload(file) {
      // console.log(file)
      const imageType = ['image/jpeg', 'image/png', 'image/jpg']
      const imageSize = file.size / 1024 / 1024 // 图片大小转换为MB
      if (!imageType.includes(file.type)) {
        this.$message.error('上传图片格式不正确，请上传jpg、jpeg、png格式的图片')
        return false
      }
      if (imageSize > 5) {
        this.$message.error('上传图片大小不能超过5MB')
        return false
      }
    },
    // 上传文件
    async uploadImage({ file }) {
      const formData = new FormData()
      // formData追加数据，使用append方法
      formData.append('file', file)
      formData.append('type', 1) // 1表示营业执照
      const res = await uploadFileAPI(formData)
      // console.log(res)
      this.addForm.businessLicenseId = res.data.id // 获取到营业执照id
      this.addForm.businessLicenseUrl = res.data.url // 获取到营业执照url
      this.$refs.ruleForm.validateField('businessLicenseUrl') // 手动校验营业执照字段
      this.$message.success('营业执照上传成功')
    },
    // 获取行业列表
    async getIndustryList() {
      const res = await getIndustryListAPI()
      // console.log(res)
      this.list = res.data
    }
  }
}
</script>

<style scoped lang="scss">
.add-enterprise {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    height: 64px;
    line-height: 64px;
    font-size: 16px;
    font-weight: bold;
    background-color: #fff;

    .left {
      span {
        margin-right: 4px;
      }
      .arrow{
        cursor: pointer;
      }
    }

    .right {
      text-align: right;
    }
  }

  .add-main {
    background: #f4f6f8;
    padding: 20px 130px;

    .form-container {
      background-color: #fff;
      .title {
        height: 60px;
        line-height: 60px;
        padding-left:20px;
      }
      .form {
        margin-bottom: 20px;
        padding: 20px 65px 24px;
        .el-form{
          display: flex;
          flex-wrap: wrap;
          .el-form-item{
            width: 50%;
          }
        }
      }
    }
  }

  .add-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 24px 50px;
    color: #000000d9;
    font-size: 14px;
    background: #fff;
    text-align: center;
  }
}
</style>
