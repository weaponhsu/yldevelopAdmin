<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryUsername" placeholder="登录名 " style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="queryMobile" placeholder="手机号 " style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="queryStats" placeholder="状态" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in statsOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="queryRole" placeholder="角色" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in roleArr" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" />
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate" />
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload" />
    </div>

    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="登录名 " width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="手机号 " width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.stats | statsCssFilter">
            {{ row.stats | statsFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="角色" class-name="status-col" width="120" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.role">
            {{ row.role_name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="登陆次数" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.login_times }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上次登陆时间" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.last_login_time }}</span>
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
          <el-button icon="el-icon-delete" size="mini" type="danger" @click="handleDelete(row,$index)" />
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="currentPage" :limit.sync="pageSize" @pagination="fetchData({})" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="110px" style="width: 400px; margin-left:30px;">
        <el-form-item label="登录名" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="temp.mobile" />
        </el-form-item>
        <el-form-item v-if="dialogStatus=='create'" label="密码" prop="password">
          <el-input v-model="temp.password" />
        </el-form-item>
        <el-form-item v-if="dialogStatus=='create'" label="重复密码" prop="repeatPassword">
          <el-input v-model="temp.repeatPassword" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="temp.role" class="filter-item" placeholder="请选择角色">
            <el-option v-for="item in roleArr" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="temp.stats" class="filter-item" placeholder="请选择状态">
            <el-option v-for="(item, idx) in statsOptions" :key="item" :label="item" :value="idx" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create' ? createData() : updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { isPhoneAvailable, isValidPassword } from '@/utils/validate'
import { getList, createUser, editUser, deleteUser } from '@/api/user'
import { getList as getRoleList } from '@/api/role'
import { parseTime, download } from '@/utils'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  filters: {
    statsCssFilter(stats) {
      const statsMap = {
        1: 'success',
        0: 'danger'
      }
      return statsMap[stats]
    },
    statsFilter(stats) {
      const statsMap = {
        1: '启用',
        0: '禁用'
      }
      return statsMap[stats]
    }
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (isPhoneAvailable(value) === false) {
        callback(new Error('请输入一个有效的手机号码'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!isValidPassword(value)) {
        callback(new Error('密码必须是一个包含大小写字母与数字的，长度为8为的字符串'))
      } else {
        callback()
      }
    }
    const validateRepeatPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.temp.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
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
      queryUsername: '',
      queryMobile: '',
      queryRole: '',
      queryStats: '',
      // 搜索条件相关数据
      importanceOptions: [1, 2, 3],
      statsOptions: ['禁用', '启用'],
      // 弹出层数据
      // 是否隐藏弹出层
      dialogFormVisible: false,
      // 弹出层状态(创建、编辑)
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      // 临时数据
      temp: {
        id: undefined,
        username: '',
        mobile: '',
        stats: 0,
        role: 0,
        password: '',
        repeatPassword: ''
      },
      roleSelected: '',
      // 权限数据
      roleArr: {},
      rules: {
        username: [{ required: true, trigger: 'change', validator: validateUsername }],
        password: [{ required: true, trigger: 'change', validator: validatePassword }],
        repeatPassword: [{ required: true, trigger: 'change', validator: validateRepeatPassword }]
      },
      // 下载的loading
      downloadLoading: false,
      downloadData: []
    }
  },
  mounted() {
    this.handleRole()
  },
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
        username: '',
        mobile: '',
        stats: 0,
        role: '1',
        password: '',
        repeatPassword: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true

      this.roleArr.map(item => {
        this.$set(item, 'selected', false) // 这里，给对象添加属性，用$set方法。
        return item
      })

      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createUser(this.temp).then(response => {
            this.dialogFormVisible = false
            this.$notify({
              title: '创建成功',
              message: '管理员创建成功',
              type: 'success',
              duration: 2000
            })
            this.fetchData()
            this.dialogFormVisible = false
          }).catch(error => {
            this.$notify({
              title: '创建失败',
              type: 'error',
              message: error,
              duration: 2000
            })
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const param = {
            id: this.temp.id,
            mobile: this.temp.mobile,
            role: this.temp.role,
            stats: this.temp.stats
          }

          editUser(param).then(response => {
            this.$notify({
              title: '编辑成功',
              type: 'success',
              message: '角色编辑成功',
              duration: 2000
            })
            this.fetchData()
            this.dialogFormVisible = false
          }).catch(error => {
            this.$notify({
              title: '编辑失败',
              type: 'error',
              message: error,
              duration: 2000
            })
          })
        }
      })
    },
    handleRole() {
      const param = {
        page: 1,
        page_size: 999,
        order: 'id',
        sort: 'desc'
      }
      getRoleList(param).then(response => {
        this.roleArr = response.data
        // this.roleArr.map(item => {
        //   return { id: parseInt(item.id), name: item.name }
        // })
      }).catch(error => {
        console.log('role get access list error: ' + error)
      })
    },
    handleDownload() {
      this.downloadLoading = true
      const tHeader = ['编号', '登录名 ', '创建者', '创建时间', '编辑时间']
      const filterVal = ['id', 'name', 'created_by_name', 'created_at', 'updated_by_name']
      const data = this.formatJson(filterVal)
      download(tHeader, data, 'role')
      this.downloadLoading = false
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)

      const rules = ',' + this.temp.rules + ','
      this.roleArr.map(item => {
        this.$set(item, 'checked', rules.indexOf(',' + item.id + ',') !== -1)
        return item
      })

      this.temp.access = this.roleArr

      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleModifyStatus(row, value) {},
    handleDelete(row, idx) {
      const param = { id: row.id }
      deleteUser(param).then(response => {
        this.$notify({
          title: '删除成功',
          message: '管理员删除成功',
          type: 'success',
          duration: 2000
        })
        this.fetchData()
        this.dialogFormVisible = false
      }).catch(error => {
        console.log('role update error: ' + error)
        this.$notify({
          title: '删除失败',
          message: '管理员删除失败',
          type: 'error',
          duration: 2000
        })
      })
    },
    fetchData() {
      this.listLoading = true
      const param = {
        sort: this.sort,
        order: this.order,
        page: this.currentPage,
        page_size: this.pageSize
      }
      if (this.queryUsername !== '') {
        param.username = this.queryUsername
      }
      if (this.queryMobile !== '') {
        param.mobile = this.queryMobile
      }
      if (this.queryStats !== '') {
        this.statsOptions.map((item, idx) => {
          if (this.queryStats === item) {
            param.stats = idx
          }
        })
      }
      if (this.queryRole !== '') {
        param.role = this.queryRole
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
