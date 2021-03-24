
class Tools {
  getLoginTokenCookie () {
    const cookie = document.cookie
    const ca = cookie.split(';')
    for (let c of ca) {
      c = c.trim()
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

  htmlUnescape (html:string) {
    return html.replace(/&lt;|&gt;|&amp;|&quot;|&nbsp;/g, (match:string, pos:number, text:string):string => {
      switch (match) {
        case '&lt;': return '<'
        case '&gt;': return '>'
        case '&amp;': return '&'
        case '&quot;': return '"'
        case '&nbsp;': return ' '
      }
      return text
    })
  }

  extractTextFromHtml (html:string) {
    const e = document.createElement('div')
    e.innerHTML = html
    return e.innerText
  }

  locationSearchToQuery (str:string) {
    if (!str.includes('?')) return {}
    str = str.substr(1)
    const res:Record<string, unknown> = {}
    const ss = str.split('&')
    for (const s of ss) {
      const kv = s.split('=')
      res[kv[0]] = kv[1]
    }
    return res
  }
}

const ins = new Tools()

export default ins
