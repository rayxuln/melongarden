
class Tools {
  getLoginTokenCookie () {
    const cookie = decodeURIComponent(document.cookie)
    const ca = cookie.split(';')
    for (const c of ca) {
      if (c.indexOf('token=') === 0) {
        return c.substring('token='.length, c.length)
      }
    }
    return ''
  }

  imagesUploadHandler (start: () => void, finish: () => void) {
    const forceFail = false
    return (blobInfo: { base64: () => string }, success: (a: string) => unknown, failure: (arg0: string, arg1: { remove: boolean }) => void, progress: (a: number) => unknown) => {
      start()
      const img = 'data:image/jpeg;base64,' + blobInfo.base64()
      console.log('About to upload a image')
      let cnt = 10
      const int = setInterval(() => {
        if (cnt === 0) {
          success(img)
          finish()
          window.clearInterval(int)
        } else if (forceFail && cnt === 5) {
          failure('error force', { remove: true })
          finish()
          window.clearInterval(int)
        } else {
          cnt -= 1
          progress((10 - cnt) / 10 * 100)
        }
      }, 100)
    }
  }
}

const ins = new Tools()

export default ins
