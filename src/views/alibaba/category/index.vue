<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryId" placeholder="商品分类编号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="queryName" placeholder="商品分类名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="queryPublishing" placeholder="是否允许添加商品" clearable style="width: 160px" class="filter-item">
        <el-option v-for="item in publishingOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="queryStats" placeholder="app是否显示" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="queryParent" placeholder="上级分类" clearable style="width: 220px" class="filter-item">
        <el-option v-for="item in parentArr" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" />
      <br>
    </div>

    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label="商品分类编号" width="110">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="商品分类名称" width="240" align="left">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="上级分类" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.parent_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布商品" width="80" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.publishing | publishingCssFilter">
            {{ row.publishing | publishingFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="app显示" width="120" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.stats | statusCssFilter">
            {{ row.stats | statusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建者" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created_by_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updated_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新者" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updated_by_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button icon="el-icon-edit" type="primary" size="mini" @click="handleUpdate(row)" />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="130px" style="width: 450px; margin-left:50px;">
        <el-form-item label="商品分类编号" prop="id">
          <el-input v-model="temp.id" :disabled="temp.id" />
        </el-form-item>
        <el-form-item label="商品分类名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="上级分类" prop="stats">
          <el-select v-model="temp.parent">
            <el-option v-for="item in parentArr" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否允许添加商品" prop="publishing">
          <el-radio-group v-model="temp.publishing">
            <el-radio label="1">允许</el-radio>
            <el-radio label="0">不允许</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="app是否显示" prop="stats">
          <el-radio-group v-model="temp.stats">
            <el-radio label="1">显示</el-radio>
            <el-radio label="0">不显示</el-radio>
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
import { getList, editAlibabaCategory } from '@/api/alibabaCategory'

export default {
  filters: {
    publishingFilter(publishing) {
      const publishingMap = {
        1: '允许',
        0: '禁止'
      }
      return publishingMap[publishing]
    },
    publishingCssFilter(publishing) {
      const publishingMap = {
        1: 'success',
        0: 'danger'
      }
      return publishingMap[publishing]
    },
    statusFilter(status) {
      const statusMap = {
        1: '显示',
        0: '不显示'
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
      pageSize: 9999,
      sort: 'desc',
      order: 'id',
      total: 0,
      list: [],
      queryId: '',
      queryName: '',
      queryPublishing: '',
      queryStats: '',
      queryParent: '',
      sortBy: '',
      // 搜索条件相关数据
      importanceOptions: [1, 2, 3],
      statusOptions: ['不显示', '显示'],
      publishingOptions: ['禁止', '允许'],
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
    this.getParent()
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
        parent: '',
        publishing: '',
        stats: ''
      }
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // const param = {
          //   id: this.temp.id,
          //   name: this.temp.name,
          //   stats: this.temp.stats
          // }

          editAlibabaCategory(this.temp).then(response => {
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
    getParent() {
      const param = {
        sort: this.sort,
        order: this.order,
        page: this.currentPage,
        page_size: 9999,
        publishing: 0
      }
      getList(param).then(response => {
        const { data, meta } = response
        console.log(data)
        this.parentArr = data.map((item, idx) => {
          return { id: item.id, name: item.name }
        })
        console.log(this.parentArr)
      }).catch(() => {
        this.parentArr = []
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
      if (this.queryId !== '') {
        param.id = this.queryId
      }
      if (this.queryName !== '') {
        param.name = this.queryName
      }
      if (this.queryStats !== '') {
        this.statusOptions.map((item, idx) => {
          if (this.queryStats === item) {
            param.stats = idx
          }
        })
      }
      if (this.queryPublishing !== '') {
        this.publishingOptions.map((item, idx) => {
          if (this.queryPublishing === item) {
            param.publishing = idx
          }
        })
      }
      if (this.queryParent !== '') {
        param.parent = this.queryParent
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
