import Tools from '../Tools'

export default function (start, finish) {
  return (blobInfo, success, failure, progress) => {
    start()
    const xhr = new XMLHttpRequest()
    xhr.withCredentials = false
    xhr.open('POST', Tools.GO_API_BASE_URL + 'api/v1/upload')
    xhr.setRequestHeader('token', Tools.getLoginTokenCookie())

    xhr.upload.onprogress = function (e) {
      progress(e.loaded / e.total * 100)
    }
    xhr.onload = function () {
      if (xhr.status === 403) {
        finish()
        failure('HTTP Error: ' + xhr.status, { remove: true })
        return
      }
      if (xhr.status < 200 || xhr.status >= 300) {
        finish()
        if (xhr.status === 500) {
          failure('The size of file mustn\'t exceed 5M!', { remove: true })
        } else if (xhr.status === 401) {
          failure('You need to first sign in to upload!', { remove: true })
        } else {
          failure('HTTP Error: ' + xhr.status, { remove: true })
        }
        return
      }
      const json = JSON.parse(xhr.responseText)
      if (!json || typeof json.url !== 'string') {
        finish()
        failure('Invalid JSON: ' + xhr.responseText, { remove: true })
        return
      }
      finish()
      success(Tools.GO_API_BASE_URL + json.url.substring(1))
    }
    xhr.onerror = function () {
      finish()
      failure('Image upload failed due to a XHR Transport error. Code: ' + xhr.status, { remove: true })
    }
    const formData = new FormData()
    formData.append('file', blobInfo.blob(), blobInfo.filename())
    xhr.send(formData)
  }
}
