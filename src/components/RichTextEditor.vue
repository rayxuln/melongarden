<template>
  <div class="rich-text-editor">
    <the-editor v-model="inputValue" :init="init"></the-editor>
  </div>
</template>

<script>
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

import { Options, Vue } from 'vue-class-component'

@Options({
  components: { TheEditor },
  props: {
    modelValue: String
  },
  emits: ['update:modelValue'],
  data () {
    return {
      inputValue: '',
      init: {
        skin_url: '/tinymce/skins/ui/oxide',
        height: 300,
        plugins: 'image paste advlist table lists',
        toolbar: 'forecolor backcolor bold italic underline strikethrough image | alignleft aligncenter alignright alignjustify | quicklink h1 h2 h3 blockquote table numlist bullist',
        branding: true,
        menubar: false,
        paste_data_images: true,
        statusbar: false,
        elementpath: false,
        images_upload_handler: (blobInfo, success, failure) => {
          const img = 'data:image/jpeg;base64,' + blobInfo.base64()
          console.log('About to upload a image')
          success(img)
        }
      }
    }
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
