<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="queryStats" placeholder="审核状态" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" />
      <br>
    </div>

    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column label="提现用户" width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.member_nickname }}
        </template>
      </el-table-column>
      <el-table-column label="提现账号信息" width="240" align="center">
        <template slot-scope="scope">
          {{ scope.row.account_info }}
        </template>
      </el-table-column>
      <el-table-column label="提现前账户余额" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.currency }}
        </template>
      </el-table-column>
      <el-table-column label="提现金额" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.amount }}
        </template>
      </el-table-column>
      <el-table-column label="提现后账户余额" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.remain }}
        </template>
      </el-table-column>
      <el-table-column label="类型" width="110" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.type | typeCssFilter">
            {{ row.type | typeFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.stats | statusCssFilter">
            {{ row.stats | statusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="240" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核时间" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updated_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核者" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updated_by_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-if="row.status == '0'"  icon="el-icon-edit" type="primary" size="mini" @click="handleUpdate(row)" />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="130px" style="width: 450px; margin-left:50px;">
        <el-form-item label="提现申请id">
          <el-input v-model="temp.id" :disabled="temp.id" />
        </el-form-item>
        <el-form-item label="申请提现用户">
          <el-input v-model="temp.member_nickname" :disabled="temp.id" />
        </el-form-item>
        <el-form-item label="提现金额">
          <el-input v-model="temp.amount" :disabled="temp.id" />
        </el-form-item>
        <el-form-item label="提现前余额">
          <el-input v-model="temp.currency" :disabled="temp.id" />
        </el-form-item>
        <el-form-item label="提现前余额">
          <el-input v-model="temp.remain" :disabled="temp.id" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="temp.remark" :disabled="temp.id" />
        </el-form-item>
        <el-form-item label="状态" prop="stats">
          <el-select v-model="temp.stats">
            <el-option label="待审核" value="0" disabled="disabled" />
            <el-option label="通过" value="1" />
            <el-option label="拒绝" value="2" />
          </el-select>
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
import { getWithdrawList, editWithdraw } from '@/api/finance'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        2: '拒绝',
        1: '通过',
        0: '待审核'
      }
      return statusMap[status]
    },
    statusCssFilter(status) {
      const statusMap = {
        0: 'info',
        1: 'success',
        2: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      const typeMap = {
        5: '余额提现',
        0: '金币转入'
      }
      return typeMap[type]
    },
    typeCssFilter(type) {
      const typeMap = {
        5: 'success',
        0: '金币转入'
      }
      return typeMap[type]
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
      queryStats: '',
      sortBy: '',
      // 搜索条件相关数据
      statusOptions: ['待审核', '通过', '拒绝'],
      showReviewer: false,
      // 弹出层数据
      // 是否隐藏弹出层
      dialogFormVisible: false,
      // 弹出层状态
      dialogStatus: '',
      textMap: {
        update: '审核'
      },
      // 临时数据
      temp: {
        id: undefined,
        name: '',
        parent: '',
        publishing: '',
        stats: ''
      },
      // 上级分类数据
      parentArr: {},
      rules: {
        id: [{ required: true, message: '商品分类编号必须存在', trigger: 'change' }],
        name: [{ required: true, message: '商品分类名称必须存在', trigger: 'change' }]
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
        stats: ''
      }
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {

          editWithdraw(this.temp).then(response => {
            this.$notify({
              title: '编辑成功',
              type: 'success',
              message: '阿里巴巴商品分类编辑成功',
              duration: 2000
            })
            this.fetchData()
            this.dialogFormVisible = false
          }).catch(() => {
            this.$notify({
              title: '编辑失败',
              type: 'error',
              message: '阿里巴巴商品分类编辑失败',
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

      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleModifyStatus(row, value) {},
    fetchData() {
      this.listLoading = true
      const param = {
        sort: this.sort,
        order: this.order,
        page: this.currentPage,
        page_size: this.pageSize
      }
      if (this.queryStats !== '') {
        this.statusOptions.map((item, idx) => {
          if (this.queryStats === item) {
            param.stats = idx
          }
        })
      }
      console.log(param.stats)
      getWithdrawList(param).then(response => {
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
