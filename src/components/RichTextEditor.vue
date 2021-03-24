<template>
  <div class="rich-text-editor">
    <the-editor v-model="inputValue" :init="init"></the-editor>
  </div>
</template>

<script>
import Tools from '@/APIs/Tools'
import tinymce from 'tinymce/tinymce'
import TheEditor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver'
import 'tinymce/icons/default/icons'

import 'tinymce/plugins/image'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/code'
import 'tinymce/plugins/emoticons'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/link'
import 'tinymce/plugins/hr'
import 'tinymce/plugins/codesample'

import { Options, Vue } from 'vue-class-component'

@Options({
  components: { TheEditor },
  props: {
    modelValue: String
  },
  emits: ['update:modelValue', 'images-upload-start', 'images-upload-finished'],
  data () {
    return {
      inputValue: '',
      init: {
        skin_url: '/tinymce/skins/ui/oxide',
        height: 300,
        plugins: 'image paste advlist table lists code emoticons autolink link hr codesample',
        toolbar: 'emoticons forecolor backcolor bold italic underline strikethrough | codesample link image | alignleft aligncenter alignright alignjustify | h1 h2 h3 blockquote table numlist bullist | hr styleselect code',
        branding: true,
        menubar: false,
        paste_data_images: true,
        statusbar: false,
        elementpath: false,
        images_upload_handler: null,
        emoticons_database_url: '/tinymce/emojis/emojis.js',
        codesample_global_prismjs: true
      }
    }
  },
  created () {
    this.init.images_upload_handler = Tools.imagesUploadHandler(() => {
      this.$emit('images-upload-start')
    }, () => {
      this.$emit('images-upload-finished')
    })
  },
  mounted () {
    tinymce.init({})
  },
  watch: {
    modelValue (newValue) {
      this.inputValue = newValue
    },
    inputValue (newValue) {
      this.$emit('update:modelValue', newValue)
    }
  }
})
export default class RichTextEditor extends Vue {}
</script>

<style scope>

</style>
