<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate" />
    </div>

    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column label="菜单名称" width="auto">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="上级菜单" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.parent_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="90" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.display | displayCssFilter">
            {{ row.display | displayFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="接口地址" width="220" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
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
        <el-form-item label="角色">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="上级菜单">
          <el-select v-model="temp.parent" placeholder="选择上级菜单">
            <el-option v-for="item in parentArr" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单栏">
          <el-radio-group v-model="temp.display">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="接口">
          <el-radio-group v-model="temp.is_operation">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="接口地址">
          <el-input v-model="temp.url" />
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
import { getList, createMenu, editMenu, deleteMenu } from '@/api/menu'

export default {
  filters: {
    displayCssFilter(display) {
      const displayMap = {
        1: 'success',
        0: 'danger'
      }
      return displayMap[display]
    },
    displayFilter(display) {
      const displayMap = {
        1: '菜单栏',
        0: '接口'
      }
      return displayMap[display]
    }
  },
  data() {
    return {
      hidden: false,
      listLoading: true,
      // 翻页相关数据 当前页，每页显示条数，排序方式，排序字段，符合条件的搜索结果数，搜索结果
      currentPage: 1,
      pageSize: 999,
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
        parent: 0,
        type: 0,
        url: ''
      },
      // 父级菜单
      parentArr: [],
      rules: {
        name: [{ required: true, message: '菜单名称必须存在', trigger: 'change' }]
      },
      // 下载的loading
      downloadLoading: false,
      downloadData: []
    }
  },
  mounted() {
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

      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createMenu(this.temp).then(response => {
            this.dialogFormVisible = false
            this.$notify({
              title: '创建成功',
              message: '菜单创建成功',
              type: 'success',
              duration: 2000
            })
            this.fetchData()
            this.dialogFormVisible = false
          }).catch(() => {
            this.$notify({
              title: '创建失败',
              type: 'error',
              message: '创建创建失败',
              duration: 2000
            })
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          editMenu(this.temp).then(response => {
            this.$notify({
              title: '编辑成功',
              type: 'success',
              message: '菜单编辑成功',
              duration: 2000
            })
            this.fetchData()
            this.dialogFormVisible = false
          }).catch(() => {
            this.$notify({
              title: '编辑失败',
              type: 'error',
              message: '菜单编辑失败',
              duration: 2000
            })
          })
        }
      })
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
    handleDelete(row, idx) {
      const param = { id: row.id }
      deleteMenu(param).then(response => {
        this.$notify({
          title: '删除成功',
          message: '菜单删除成功',
          type: 'success',
          duration: 2000
        })
        this.fetchData()
        this.dialogFormVisible = false
      }).catch(() => {
        this.$notify({
          title: '删除失败',
          message: '菜单删除失败',
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
        for (const item of data) {
          if (item.display === '1' && item.is_operation === '0') {
            this.parentArr.push({ id: item.id, name: item.name })
          }
        }
        this.list = data.map(item => {
          let name = ''
          if (item.route.split('-').length > 2) {
            for (let i = 0; i < item.route.split('-').length; i++) {
              if (i >= 2) {
                if (i === 2) {
                  name = '|-'
                } else {
                  name += '--'
                }
              }
            }
            name += item.name
          } else {
            name = item.name
          }
          return { id: item.id, name: name, display: item.display, parent: item.parent, parent_name: item.parent_name, is_operation: item.is_operation, url: item.url }
        })
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
