<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px" :visible.sync="dialogFormVisible">
      <el-form-item label="密钥">
        <el-input v-model="form.google_secret" disabled style="width: 220px;" />
      </el-form-item>
      <el-form-item label="二维码">
        <el-image :src="form.qr_code_url" ></el-image>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">绑定谷歌认证器</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { genGoogleCode, editUser } from '@/api/user'
import { getUserId } from '@/utils/auth'

export default {
  data() {
    return {
      form: {
        google_secret: '',
        qr_code_url: ''
      },
      dialogFormVisible: false
    }
  },
  mounted() {
  },
  created() {
    this.$confirm(
      '<p>一、请准备好手机，打开谷歌认证器</p>二、点击"手动输入验证码"后，将"密钥"填写入"密钥"输入框；或点击"扫描条形码"，扫描二维码</p><p>三、点击"绑定谷歌认证器"，完成绑定</p>',
      '特别提醒',
      {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        dangerouslyUseHTMLString: true
      }
    ).then(() => {
      this.genGoogleCode()
      this.dialogFormVisible = true
    }).catch(() => {
      this.$notify({
        title: '取消绑定谷歌认证器',
        type: 'error',
        message: '取消绑定谷歌认证器',
        duration: 2000
      })
    })
  },
  methods: {
    genGoogleCode() {
      const id = getUserId()
      genGoogleCode(id).then(response => {
        this.form.google_secret = response.google_secret
        this.form.qr_code_url = response.qr_code_url
      }).catch(error => {
        alert(error)
      })
    },
    onSubmit() {
      const param = {
        id: getUserId(),
        google_secret: this.form.google_secret
      }
      editUser(param).then(response => {
        this.$notify({
          title: '谷歌验证器绑定成功',
          type: 'success',
          message: '谷歌验证器绑定成功',
          duration: 2000
        })
      }).catch(error => {
        this.$notify({
          title: '谷歌验证器绑定失败',
          type: 'error',
          message: error,
          duration: 2000
        })
      })
    }
  }
}
</script>

<style scoped>
  .line{
    text-align: center;
  }
</style>
