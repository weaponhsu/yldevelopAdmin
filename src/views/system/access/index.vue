<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryName" placeholder="角色名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" />
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate" />
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload" />
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        显示审核人员
      </el-checkbox>
    </div>

    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column label="权限名称" width="110">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="所辖菜单" width="260" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.menu_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建者" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created_by_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编辑时间" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updated_at }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showReviewer" label="编辑者" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updated_by_name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row, $index}">
          <el-button icon="el-icon-edit" type="primary" size="mini" @click="handleUpdate(row)" />
          <el-button icon="el-icon-delete" size="mini" type="danger" @click="handleDelete(row, $index)" />
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="currentPage" :limit.sync="pageSize" @pagination="fetchData({})" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="角色" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>

        <el-form-item label="权限">
          <el-checkbox v-for="(item, idx) in menuArr" :key="item.id" v-model="item.checked" style="width: 400px;" name="access" :label="item.id">
            {{ item.name }}
          </el-checkbox>
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
import { getList, createAccess, editAccess, deleteAccess } from '@/api/access'
import { getList as getMenuList } from '@/api/menu'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
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
      queryName: '',
      // 搜索条件相关数据
      importanceOptions: [1, 2, 3],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
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
        name: '',
        access: [],
        rules: []
      },
      // 权限数据
      menuArr: {},
      rules: {
        name: [{ required: true, message: '角色名称必须存在', trigger: 'change' }]
      },
      // 下载的loading
      downloadLoading: false,
      downloadData: []
    }
  },
  mounted() {
    this.handleMenu()
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
        name: '',
        access: []
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true

      this.menuArr.map(item => {
        this.$set(item, 'checked', false) // 这里，给对象添加属性，用$set方法。
        return item
      })

      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    getMenuString() {
      const data = document.getElementsByName('access')
      const menuArr = []
      for (let i = 0; i < data.length; i++) {
        if (data[i].checked === true) {
          menuArr.push(data[i].value)
        }
      }
      return menuArr.join(',')
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const param = {
            name: this.temp.name,
            access: this.getMenuString()
          }

          createAccess(param).then(response => {
            this.dialogFormVisible = false
            this.$notify({
              title: '创建成功',
              message: '角色创建成功',
              type: 'success',
              duration: 2000
            })
            this.fetchData()
            this.dialogFormVisible = false
          }).catch(() => {
            this.$notify({
              title: '创建失败',
              type: 'info',
              message: '角色创建失败',
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
            name: this.temp.name,
            access: this.getMenuString()
          }

          editAccess(param).then(response => {
            this.$notify({
              title: '编辑成功',
              type: 'success',
              message: '角色编辑成功',
              duration: 2000
            })
            this.fetchData()
            this.dialogFormVisible = false
          }).catch(() => {
            this.$notify({
              title: '编辑失败',
              type: 'error',
              message: '角色编辑失败',
              duration: 2000
            })
          })
        }
      })
    },
    handleMenu() {
      const param = {
        page: 1,
        page_size: 999,
        order: 'id',
        sort: 'desc'
      }
      getMenuList(param).then(menuArr => {
        const { data } = menuArr
        this.menuArr = data
        this.menuArr = this.menuArr.map(item => {
          return { id: item.id, name: item.name, checked: false }
        })
      }).catch(() => {
        this.menuArr = []
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

      const menus = ',' + this.temp.menu_id + ','
      this.menuArr.map(item => {
        this.$set(item, 'checked', menus.indexOf(',' + item.id + ',') !== -1)
        return item
      })

      this.temp.access = this.menuArr

      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleModifyStatus(row, value) {},
    handleDelete(row, idx) {
      const param = { id: row.id }
      deleteAccess(param).then(response => {
        this.$notify({
          title: '删除成功',
          message: '角色删除成功',
          type: 'success',
          duration: 2000
        })
        this.fetchData()
        this.dialogFormVisible = false
      }).catch(() => {
        this.$notify({
          title: '删除失败',
          message: '角色删除失败',
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
      if (this.queryName !== '') {
        param.name = this.queryName
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
