<template>
  <div class="databoard-container">
    <!-- 园区数据+快捷入口 -->
    <el-row :gutter="20" class="top-row">
      <el-col
        :span="18"
      ><div class="bg">
        <el-card class="box-card">
          <el-descriptions
            class="margin-top"
            title="园区数据"
            :column="4"
            direction="vertical"
            :colon="false"
          >
            <el-descriptions-item
              label="年度累计收费(元)"
              content-class-name="myfont"
            >{{ annualIncome }}</el-descriptions-item>
            <el-descriptions-item
              label="入驻企业"
              content-class-name="myfont"
            >{{ enterpriseTotal }}</el-descriptions-item>
            <el-descriptions-item
              label="月卡车辆总数(辆)"
              content-class-name="myfont"
            >{{ monthCardTotal }}</el-descriptions-item>
            <el-descriptions-item
              label="一体杠总数(台)"
              content-class-name="myfont"
            >{{ chargePoleTotal }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </div></el-col>
      <el-col
        :span="6"
      ><div class="bg">
        <el-card>
          <el-descriptions title="快速入口" :column="2" />
          <div class="main">
            <div class="item">
              <img :src="str" alt="">
              <div>添加企业</div>
            </div>
            <div class="item">
              <img src="@/assets/employee-manage.png" alt="">
              <div>员工管理</div>
            </div>
            <div class="item">
              <img src="@/assets/add-bill.png" alt="">
              <div>添加账单</div>
            </div>
            <div class="item">
              <img src="@/assets/data-screen.png" alt="">
              <div>数据大屏</div>
            </div>
          </div>
        </el-card>
      </div></el-col>
    </el-row>
    <!-- 年度收入统计+设备告警派单 -->
    <el-row :gutter="20" class="middle-row">
      <el-col
        :span="18"
      ><div class="bg">
        <el-card>
          <div
            ref="chart"
            class="chart"
            style="width: 90%; height: 400px"
          />
        </el-card></div></el-col>
      <el-col
        :span="6"
      ><div class="bg empty">
        <h5 class="font">设备告警派单</h5>
        <el-empty :image="empty" description=" " :image-size="120">
          <el-button type="primary" round class="btn">更多 &gt;</el-button>
        </el-empty>
      </div></el-col>
    </el-row>
    <!-- 临期合同提醒 -->
    <el-row :gutter="20" class="bottom-row">
      <el-col :span="18">
        <div class="bg">
          <el-card>
            <div class="card-header">
              <span>临期合同提醒</span>
            </div>
            <el-table :data="tableData" style="width: 100%">
              <el-table-column type="index" label="序号" width="80" />
              <el-table-column
                prop="enterpriseName"
                label="企业名称"
                width="400"
              />
              <el-table-column prop="buildingName" label="租赁楼宇" />
              <el-table-column label="租赁时间">
                <template slot-scope="scope">
                  {{ scope.row.startTime }}至{{ scope.row.endTime }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="mini"
                    @click="handleRenew(scope.row)"
                  >续租</el-button>
                  <el-button
                    type="text"
                    size="mini"
                    @click="handleSurrender(scope.row)"
                  >退租</el-button>
                  <el-button
                    type="text"
                    size="mini"
                    @click="handleView(scope.row)"
                  >查看</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination-container">
              <el-pagination
                :current-page.sync="params.page"
                :page-size.sync="params.pageSize"
                :total="total"
                layout="total, prev, pager, next"
                @current-change="handlePageChange"
              />
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import empty from '@/assets/empty.svg'
import { getWorkbenchInfo, getRentInfo } from '@/api/work'
import img from '@/assets/add-enterprise.png'
export default {
  data() {
    return {
      str: '',
      annualIncome: '', // 年度累计收入
      enterpriseTotal: '', // 企业总数
      monthCardTotal: '', // 月卡总数
      chargePoleTotal: '', // 一体杠总数
      annualIncomeArray: {
        xmonth: [],
        yBuilding: [],
        yParking: []
      }, // 图表数据
      empty: empty,
      params: {
        page: 1,
        pageSize: 10
      },
      total: 0, // 总条数
      tableData: []
    }
  },
  created() {
    this.str = img
    console.log(img)
  },
  async mounted() {
    await this.getInfo()
    await this.getRentList()
    console.log(this.annualIncomeArray)
    this.$nextTick(() => {
      const myChart = echarts.init(this.$refs.chart)
      myChart.setOption({
        title: {
          text: '年度收入统计',
          left: 'left',
          top: 'top',
          textStyle: {
            color: '#333',
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['物业费', '行车收入'],
          right: '10%',
          top: '10px',
          icon: 'rect',
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            color: '#666',
            fontSize: 12
          }
        },
        xAxis: {
          type: 'category',
          data: this.annualIncomeArray.xmonth,
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            color: '#666'
          }
        },
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#eee'
            }
          },
          axisLabel: {
            color: '#666'
          }
        },
        series: [
          {
            name: '物业费',
            type: 'bar',
            data: this.annualIncomeArray.ybuilding,
            itemStyle: {
              color: '#2f41ff'
            },
            barWidth: '12'
          },
          {
            name: '行车收入',
            type: 'bar',
            data: this.annualIncomeArray.yparking,
            itemStyle: {
              color: '#a0cfff'
            },
            barWidth: '12'
          }
        ],
        grid: {
          top: '60px',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        }
      })
    })
  },
  methods: {
    async getInfo() {
      const res = await getWorkbenchInfo()
      this.annualIncome = res.data.annualIncome
      this.enterpriseTotal = res.data.enterpriseTotal
      this.monthCardTotal = res.data.monthCardTotal
      this.chargePoleTotal = res.data.chargePoleTotal
      this.annualIncomeArray = res.data.annualIncomeArray
    },
    async getRentList() {
      try {
        const res = await getRentInfo(this.params)
        this.tableData = res.data.rows
        this.total = res.data.total
      } catch (error) {
        console.error('获取临期合同数据失败:', error)
      }
    },
    handleRenew(row) {
      console.log('续租:', row)
    },
    handleSurrender(row) {
      console.log('退租:', row)
    },
    handleView(row) {
      console.log('查看:', row)
    },
    handlePageChange(newPage) {
      this.params.page = newPage
      this.getRentList()
    }
  }
}
</script>

<style scoped lang="scss">
.databoard-container {
  background-color: #f4f6f8;
  height: 100%;
  .empty {
    background-color: #fff;
    .font {
      margin-left: 20px;
      margin-top: 3px;
      line-height: 60px;
      color: #5e5d5d;
    }
    .btn {
      width: 16vw;
    }
  }
  .main {
    display: flex;
    .item {
      padding: 10px;
      font-size: 15px;
      img {
        width: 50px;
      }
    }
  }
  ::v-deep .top-row {
    height: 20%;
    .myfont {
      font-size: 29px;
    }
  }
  ::v-deep .middle-row {
    margin-top: 30px;
    margin-bottom: 60px;
    height: 50%;
  }
  ::v-deep .bottom-row {
    height: 30%;
  }
  .bg {
    height: 100%;
  }
  ::v-deep .el-button--text {
    padding: 0;
    margin-right: 15px;
    font-size: 12px;

    &:last-child {
      margin-right: 0;
    }
  }

  .card-header {
    padding: 10px 0;
    font-size: 16px;
    color: #333;
  }

  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
