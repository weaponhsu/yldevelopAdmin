<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryMobile" placeholder="会员手机号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="queryIsDefault" placeholder="默认地址" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in isDefaultOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" />
      <br>
    </div>

    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="会员昵称" width="110">
        <template slot-scope="scope">
          {{ scope.row.member_nickname }}
        </template>
      </el-table-column>
      <el-table-column label="默认地址" width="120" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.is_default | isDefaultCssFilter">
            {{ row.is_default | isDefaultFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="省份" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.province }}</span>
        </template>
      </el-table-column>
      <el-table-column label="城市" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column label="区县" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.area }}</span>
        </template>
      </el-table-column>
      <el-table-column label="街道" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.street }}</span>
        </template>
      </el-table-column>
      <el-table-column label="详细地址" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.location }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收货人姓名" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收货人手机号" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮编" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.zipcode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180" align="center">
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
        <el-form-item label="会员昵称" prop="mobile">
          <el-input v-model="temp.member_nickname" :disabled="temp.id" />
        </el-form-item>
        <el-form-item label="收货人姓名" prop="name">
          <el-input v-model="temp.name" :disabled="temp.id" />
        </el-form-item>
        <el-form-item label="收货人手机" prop="mobile">
          <el-input v-model="temp.mobile" :disabled="temp.id" />
        </el-form-item>
        <el-form-item label="省份" prop="province">
          <el-input v-model="temp.province" :disabled="temp.id" />
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-input v-model="temp.city" :disabled="temp.id" />
        </el-form-item>
        <el-form-item label="区县" prop="area">
          <el-input v-model="temp.area" :disabled="temp.id" />
        </el-form-item>
        <el-form-item label="街道" prop="street">
          <el-input v-model="temp.street" :disabled="temp.id" />
        </el-form-item>
        <el-form-item label="详细地址" prop="location">
          <el-input v-model="temp.location" :disabled="temp.id" />
        </el-form-item>
        <el-form-item label="邮编" prop="zipcode">
          <el-input v-model="temp.zipcode" :disabled="temp.id" />
        </el-form-item>
        <el-form-item label="默认地址" prop="stats">
          <el-radio-group v-model="temp.is_default">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
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
import { getList, editAddress } from '@/api/address'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  filters: {
    isDefaultFilter(status) {
      const statusMap = {
        1: '是',
        0: '否'
      }
      return statusMap[status]
    },
    isDefaultCssFilter(status) {
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
      queryIsDefault: '',
      sortBy: '',
      // 搜索条件相关数据
      importanceOptions: [1, 2, 3],
      isDefaultOptions: ['是', '否'],
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
        member_nickname: '',
        member_id: '',
        province: '',
        city: '',
        area: '',
        street: '',
        location: '',
        name: '',
        mobile: '',
        zipcode: '',
        is_default: ''
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
        name: '',
        access: []
      }
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const param = {
            id: this.temp.id,
            is_default: this.temp.is_default
          }

          editAddress(param).then(response => {
            this.$notify({
              title: '编辑成功',
              type: 'success',
              message: '会员收货地址编辑成功',
              duration: 2000
            })
            this.fetchData()
            this.dialogFormVisible = false
          }).catch(() => {
            this.$notify({
              title: '编辑失败',
              type: 'error',
              message: '会员收货地址编辑失败',
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
      const param = {
        sort: this.sort,
        order: this.order,
        page: this.currentPage,
        page_size: this.pageSize
      }
      if (this.queryMobile !== '') {
        param.mobile = this.queryMobile
      }
      if (this.isDefaultOptions !== '') {
        this.isDefaultOptions.map((item, idx) => {
          if (this.queryIsDefault === item) {
            param.is_default = idx
          }
        })
      }
      console.log(param)
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
