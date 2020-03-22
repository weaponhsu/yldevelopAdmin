<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="新密码" prop="password">
        <el-input ref="password" v-model="form.password" type="password" style="width: 220px;" />
      </el-form-item>
      <el-form-item label="重复新密码" prop="repeatPassword">
        <el-input ref="repeatPassword" v-model="form.repeatPassword" type="password" style="width: 220px;"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { editUser } from '@/api/user'
import { getUserId } from '@/utils/auth'
import { isValidPassword } from '@/utils/validate'

export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      console.log('validatePassword')
      if (!isValidPassword(value)) {
        callback(new Error('密码必须是一个包含大小写字母与数字的，长度为8为的字符串'))
      } else {
        callback()
      }
    }
    const validateRepeatPassword = (rule, value, callback) => {
      console.log('validateRepeatPassword')
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      form: {
        password: undefined,
        repeatPassword: undefined
      },
      rules: {
        password: [{ required: true, trigger: 'change', validator: validatePassword }],
        repeatPassword: [{ required: true, trigger: 'change', validator: validateRepeatPassword }]
      },
      dialogFormVisible: false
    }
  },
  mounted() {
  },
  created() {

  },
  methods: {
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const param = {
            id: getUserId(),
            password: this.form.password
          }
          console.log(param)
          editUser(param).then(response => {
            this.$notify({
              title: '密码修改成功',
              type: 'success',
              message: '密码修改成功',
              duration: 2000
            })
          }).catch(error => {
            this.$notify({
              title: '密码修改失败',
              type: 'error',
              message: '密码修改失败',
              duration: 2000
            })
          })
        }
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
