<template>
  <div class="add-card">
    <header class="add-header">
      <el-page-header :content="id?'编辑月卡':'增加月卡'" @back="$router.back()" />
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">车辆信息</div>
        <div class="form">
          <!-- el-form:  :model  :rules -->
          <!-- el-form-item  prop -->
          <!-- el-input  el-select   v-model -->
          <el-form ref="carInfoForm" label-width="100px" :model="carInfoForm" :rules="carInfoRules">
            <el-form-item label="车主姓名" prop="personName">
              <el-input v-model="carInfoForm.personName" />
            </el-form-item>
            <el-form-item label="联系方式" prop="phoneNumber">
              <el-input v-model="carInfoForm.phoneNumber" />
            </el-form-item>
            <el-form-item label="车辆号码" prop="carNumber">
              <el-input v-model="carInfoForm.carNumber" />
            </el-form-item>
            <el-form-item label="车辆品牌" prop="carBrand">
              <el-input v-model="carInfoForm.carBrand" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="form-container">
        <div class="title">最新一次月卡缴费信息</div>
        <div class="form">
          <el-form ref="feeInfoForm" label-width="100px" :model="feeInfoForm" :rules="feeInfoRules">
            <el-form-item label="有效日期" prop="payTime">
              <el-date-picker
                v-model="feeInfoForm.payTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item label="支付金额" prop="paymentAmount">
              <el-input v-model="feeInfoForm.paymentAmount" />
            </el-form-item>
            <el-form-item label="支付方式" prop="paymentMethod">
              <el-select v-model="feeInfoForm.paymentMethod" placeholder="请选择">
                <el-option
                  v-for="item in payMethodList"
                  :key="item.industryCode"
                  :value="item.industryCode"
                  :label="item.industryName"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>

    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button @click="resetForm">重置</el-button>
        <el-button type="primary" @click="confirmAdd">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { addCardAPI, getCardDetailAPI, editCardAPI } from '@/api/card'

export default {
  name: 'AddMonthCard',
  data() {
    return {
      carInfoForm: {
        personName: '',
        phoneNumber: '',
        carNumber: '',
        carBrand: ''
      },
      carInfoRules: {
        personName: [
          { required: true, message: '车主姓名不能为空', trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, message: '联系方式不能为空', trigger: 'blur' },
          // 正则校验
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        carNumber: [
          { required: true, message: '车牌号码不能为空', trigger: 'blur' },
          // 自定义校验 validator: 校验方法  不用配置message
          { validator: this.validatorCarNumber, trigger: 'blur' }
        ],
        carBrand: [
          { required: true, message: '车辆品牌不能为空', trigger: 'blur' }
        ]
      },
      feeInfoForm: {
        payTime: [],
        paymentAmount: '',
        paymentMethod: ''
      },
      feeInfoRules: {
        payTime: [
          { required: true, message: '请选择支付时间', trigger: 'blur' }
        ],
        paymentAmount: [
          { required: true, message: '请输入支付金额', trigger: 'blur' }
        ],
        paymentMethod: [
          { required: true, message: '请选择支付方式', trigger: 'change' }
        ]
      },
      // 支付方式列表
      payMethodList: [
        { industryCode: 'Alipay', industryName: '支付宝' },
        { industryCode: 'WeChat', industryName: '微信' },
        { industryCode: 'Cash', industryName: '现金' }
      ]
    }
  },
  computed: {
    // 目的：以后每次使用id 都不用写太长了
    id() {
      return this.$route.query.id
    }
  },
  created() {
    if (this.id) {
      this.getCardDetail()
    }
  },
  methods: {
    async getCardDetail() {
      const { data } = await getCardDetailAPI(this.id)
      // console.log(res)
      const { personName, phoneNumber, carNumber, carBrand, carInfoId } = data
      this.carInfoForm = { personName, phoneNumber, carNumber, carBrand, carInfoId }
      const { cardStartDate, cardEndDate, paymentAmount, paymentMethod, rechargeId } = data
      this.feeInfoForm = {
        payTime: [cardStartDate, cardEndDate],
        paymentAmount,
        paymentMethod,
        rechargeId
      }
    },
    // 重置表单
    resetForm() {
      // resetFields()只能清空加了prop表单域的内容
      this.$refs.carInfoForm.resetFields()
      this.$refs.feeInfoForm.resetFields()
    },
    // 点击确定按钮
    confirmAdd() {
      this.$refs.carInfoForm.validate((flag) => {
        if (!flag) return
        this.$refs.feeInfoForm.validate(async(flag) => {
          if (!flag) return
          // console.log('调用接口')
          // 把上边两个对象中的数据合并成一个对象
          const requestData = {
            ...this.carInfoForm,
            ...this.feeInfoForm,
            cardStartDate: this.feeInfoForm.payTime[0],
            cardEndDate: this.feeInfoForm.payTime[1]
          }
          // 因为接口做了校验，多字段不行，所以提交之前把多余的字段删掉
          delete requestData.payTime
          if (this.id) {
            await editCardAPI(requestData)
            this.$message.success('月卡编辑成功')
          } else {
            await addCardAPI(requestData)
            this.$message.success('月卡添加成功')
          }

          this.$router.back()
        })
      })
    },
    // rule  value  callback
    // rule 用不到
    // value:用户输入的数据
    // callback: 不管校验成功还是失败，都要调用  成功：callback()  失败：callback(new Error('错误信息'))
    validatorCarNumber(rule, value, callback) {
      const plateNumberRegex = /^[\u4E00-\u9FA5][\da-zA-Z]{6}$/
      if (plateNumberRegex.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的车牌号码'))
      }
    }
  }

}
</script>

<style scoped lang="scss">
.add-card {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 64px;
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
        padding-left: 20px;
      }

      .form {
        margin-bottom: 20px;
        padding: 20px 65px 24px;

        .el-form {
          display: flex;
          flex-wrap: wrap;

          .el-form-item {
            width: 50%;
          }
        }
      }
    }
    .preview{
      img{
        width: 100px;
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
