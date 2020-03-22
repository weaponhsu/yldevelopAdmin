<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryMobile" placeholder="会员手机号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="queryNickname" placeholder="会员昵称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="queryStats" placeholder="状态" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" />
      <br>
    </div>
    <div class="filter-container">
      <el-radio-group v-model="sortBy">
        <el-radio label="0">按直属好友降序排列</el-radio>
        <el-radio label="1">按直属好友升序排列</el-radio>
        <el-radio label="2">按退货率降序排列</el-radio>
        <el-radio label="3">按退货率升序排列</el-radio>
        <el-radio label="4">按当前余额降序排列</el-radio>
        <el-radio label="5">按当前余额升序排列</el-radio>
        <el-radio label="6">按拼团消费降序排列</el-radio>
        <el-radio label="7">按拼团消费升序排列</el-radio>
        <el-radio label="8">按淘宝消费降序排列</el-radio>
        <el-radio label="9">按淘宝消费升序排列</el-radio>
        <el-radio label="10">按提现总额降序排列</el-radio>
        <el-radio label="11">按提现总额升序排列</el-radio>
        <el-radio label="12">按盈亏降序排列</el-radio>
        <el-radio label="13">按盈亏升序排列</el-radio>
        <el-radio label="14">按间属好友降序排列</el-radio>
        <el-radio label="15">按间属好友升序排列</el-radio>
      </el-radio-group>
    </div>

    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="会员手机号" width="110">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>
      <el-table-column label="会员昵称" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="avatar" label="会员头像" width="100" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" alt="" style="width: 50px;height: 50px">
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.stats | statusCssFilter">
            {{ row.stats | statusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="直属好友" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.direct }}</span>
        </template>
      </el-table-column>
      <el-table-column label="间属好友" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.indirect }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退货率" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.return_order_number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退款率" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.refund_order_number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前余额" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.balance }}</span>
        </template>
      </el-table-column>
      <el-table-column label="拼团消费" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.coupon_amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="淘宝消费" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tb_amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提现总额" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.withdraw }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登陆次数" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.login_times }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上次登陆ip" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.last_login_ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上次登陆时间" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.last_login_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="会员注册时间" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button icon="el-icon-edit" type="primary" size="mini" @click="handleUpdate(row)" />
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="currentPage" :limit.sync="pageSize" @pagination="fetchData({})" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="110px" style="width: 450px; margin-left:50px;">
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="temp.mobile" :disabled="temp.id" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="temp.nickname" />
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-input v-model="temp.avatar" :disabled="temp.id" />
        </el-form-item>
        <el-form-item label="余额" prop="balance">
          <el-input v-model="temp.balance" :disabled="temp.id" />
        </el-form-item>
        <el-form-item label="退款率" prop="refund_order_number">
          <el-input v-model="temp.refund_order_number" :disabled="temp.id" />
        </el-form-item>
        <el-form-item label="退货率" prop="return_order_number">
          <el-input v-model="temp.return_order_number" :disabled="temp.id" />
        </el-form-item>
        <el-form-item label="提现额" prop="withdraw">
          <el-input v-model="temp.withdraw" :disabled="temp.id" />
        </el-form-item>
        <el-form-item label="拼团总金额" prop="coupon_amount">
          <el-input v-model="temp.coupon_amount" :disabled="temp.id" />
        </el-form-item>
        <el-form-item label="淘宝总金额" prop="tb_amount">
          <el-input v-model="temp.tb_amount" :disabled="temp.id" />
        </el-form-item>
        <el-form-item label="为平台贡献利润" prop="coupon_platform_income">
          <el-input v-model="temp.coupon_platform_income" :disabled="temp.id" />
        </el-form-item>
        <el-form-item label="直属好友数量" prop="direct">
          <el-input v-model="temp.direct" :disabled="temp.id" />
        </el-form-item>
        <el-form-item label="间属好友数量" prop="indirect">
          <el-input v-model="temp.indirect" :disabled="temp.id" />
        </el-form-item>
        <el-form-item label="状态" prop="stats">
          <el-radio-group v-model="temp.stats">
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getList, editMember } from '@/api/member'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: '允许登陆',
        0: '禁止登陆'
      }
      return statusMap[status]
    },
    statusCssFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      hidden: false,
      listLoading: true,
      // 翻页相关数据 当前页，每页显示条数，排序方式，排序字段，符合条件的搜索结果数，搜索结果
      currentPage: 1,
      pageSize: 10,
      sort: 'desc',
      order: 'id',
      total: 0,
      list: [],
      queryMobile: '',
      queryNickname: '',
      queryStats: '',
      sortBy: '',
      // 搜索条件相关数据
      importanceOptions: [1, 2, 3],
      statusOptions: ['禁用', '启用'],
      showReviewer: false,
      // 弹出层数据
      // 是否隐藏弹出层
      dialogFormVisible: false,
      // 弹出层状态(创建、编辑)
      dialogStatus: '',
      textMap: {
        update: '编辑'
      },
      // 临时数据
      temp: {
        id: undefined,
        mobile: '',
        nickname: '',
        avatar: '',
        direct: '',
        indirect: '',
        coupon_amount: '',
        tb_amount: '',
        balance: '',
        withdraw: '',
        return_order_number: '',
        refund_order_number: '',
        coupon_platform_income: '',
        stats: ''
      },
      // 权限数据
      accessArr: {},
      rules: {
        name: [{ required: true, message: '角色名称必须存在', trigger: 'change' }]
      },
      // 下载的loading
      downloadLoading: false,
      downloadData: []
    }
  },
  mounted() {},
  created() {
    this.fetchData()
  },
  methods: {
    handleFilter() {
      this.currentPage = 1
      this.fetchData()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        mobile: '',
        nickname: '',
        avatar: '',
        direct: '',
        indirect: '',
        coupon_amount: '',
        tb_amount: '',
        balance: '',
        withdraw: '',
        return_order_number: '',
        refund_order_number: '',
        coupon_platform_income: '',
        stats: ''
      }
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const param = {
            id: this.temp.id,
            nickname: this.temp.nickname,
            stats: this.temp.stats
          }

          editMember(param).then(response => {
            this.$notify({
              title: '编辑成功',
              type: 'success',
              message: '会员资料编辑成功',
              duration: 2000
            })
            this.fetchData()
            this.dialogFormVisible = false
          }).catch(() => {
            this.$notify({
              title: '编辑失败',
              type: 'error',
              message: '会员资料编辑失败',
              duration: 2000
            })
          })
        }
      })
    },
    handleDownload() {
      this.downloadLoading = true
      // const tHeader = ['编号', '角色名称', '创建者', '创建时间', '编辑时间']
      // const filterVal = ['id', 'name', 'created_by_name', 'created_at', 'updated_by_name']
      // const data = this.formatJson(filterVal)
      // download(tHeader, data, 'role')
      // import('@/vendor/Export2Excel').then(excel => {
      //   excel.export_json_to_excel({
      //     header: tHeader,
      //     data,
      //     filename: 'role'
      //   })
      //   this.downloadLoading = false
      // })
      this.downloadLoading = false
    },
    formatJson(filterVal) {
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      console.log(this.temp)

      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleModifyStatus(row, value) {},
    fetchData() {
      this.listLoading = true
      if (this.sortBy === '0') {
        this.order = 'direct'
      } else if (this.sortBy === '1') {
        this.order = 'direct'
      } else if (this.sortBy === '2') {
        this.order = 'return_order_number'
      } else if (this.sortBy === '3') {
        this.order = 'return_order_number'
      } else if (this.sortBy === '4') {
        this.order = 'balance'
      } else if (this.sortBy === '5') {
        this.order = 'balance'
      } else if (this.sortBy === '6') {
        this.order = 'coupon_amount'
      } else if (this.sortBy === '7') {
        this.order = 'coupon_amount'
      } else if (this.sortBy === '8') {
        this.order = 'tb_amount'
      } else if (this.sortBy === '9') {
        this.order = 'tb_amount'
      } else if (this.sortBy === '10') {
        this.order = 'withdraw'
      } else if (this.sortBy === '11') {
        this.order = 'withdraw'
      } else if (this.sortBy === '12') {
        this.order = 'coupon_platform_income'
      } else if (this.sortBy === '13') {
        this.order = 'coupon_platform_income'
      } else if (this.sortBy === '14') {
        this.order = 'indirect'
      } else if (this.sortBy === '15') {
        this.order = 'indirect'
      }

      if (parseInt(this.sortBy) % 2 === 0) {
        this.sort = 'desc'
      } else {
        this.sort = 'asc'
      }
      const param = {
        sort: this.sort,
        order: this.order,
        page: this.currentPage,
        page_size: this.pageSize
      }
      if (this.queryMobile !== '') {
        param.mobile = this.queryMobile
      }
      if (this.queryNickname !== '') {
        param.nickname = this.queryNickname
      }
      if (this.queryStats !== '') {
        this.statusOptions.map((item, idx) => {
          if (this.queryStats === item) {
            param.stats = idx
          }
        })
      }
      getList(param).then(response => {
        const { data, meta } = response
        this.list = data
        this.listLoading = false
        this.currentPage = parseInt(meta.current_page)
        this.total = parseInt(meta.total)
      }).catch(() => {
        this.listLoading = false
        this.list = []
      })
    }
  }
}
</script>
<style scoped>
  .filter-container {
    background: #fff;
    padding: 32px 16px;
  }
</style>
