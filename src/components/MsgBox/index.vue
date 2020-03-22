<template>
  <div id="app">
    <MessageBox @callConfirm="thisCallConfirm" title="我是传过来的标题" contents="我是传过来的内容" confirmTitle="确认按钮"></MessageBox>
  </div>
</template>
<script>
export default {
  name: 'MsgBox',
  props: {
    contents: {
      type: String,
      default: '这是一段内容'
    },
    title: {
      type: String,
      default: '标题名称'
    },
    confirmTitle: {
      type: String,
      default: '确认'
    }
  },

  methods: {
    open() {
      const _this = this
      this.$alert(this.contents, this.title, {
        confirmButtonText: this.confirmTitle,
        callback: function() {
          // 这里是回调函数，因为作为一个组件，是个个地方都通用的，只是提供外部访问接口
          _this.$emit('callConfirm');
        }
      })
    }
  }
}
</script>
