
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

  getDateFullDate (date:Date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  }

  getDateDate (date:Date) {
    return `${date.getMonth() + 1}-${date.getDate()}`
  }

  getDateTime (date:Date) {
    const min = String(date.getMinutes())
    return `${date.getHours()}:${min.padStart(2, '0')}`
  }

  getProperDateString (date:Date) {
    if (date.getFullYear() !== (new Date()).getFullYear()) {
      return `${this.getDateFullDate(date)} ${this.getDateTime(date)}`
    } else if (this.getDateDate(date) !== this.getDateDate(new Date())) {
      return `${this.getDateDate(date)} ${this.getDateTime(date)}`
    } else {
      return this.getDateTime(date)
    }
  }
}

const ins = new Tools()

export default ins