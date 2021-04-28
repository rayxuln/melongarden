
class Tools {
  setLoginTokenCookie (token:string) {
    // document.cookie = `token=${token};path=/;`
    window.localStorage.setItem('token', token)
  }

  getLoginTokenCookie () {
    // const cookie = document.cookie
    // const ca = cookie.split(';')
    // for (let c of ca) {
    //   c = c.trim()
    //   if (c.indexOf('token=') === 0) {
    //     return c.substring('token='.length, c.length)
    //   }
    // }
    // return ''
    return window.localStorage.getItem('token') ?? ''
  }

  getImagesInPost (content:string, maxNum = 3) {
    const images = []
    const reg = /<img((?!scr=")[^<])+src="(([^"]|\\")*)"/gim
    let res = reg.exec(content)
    // eslint-disable-next-line no-unmodified-loop-condition
    while (res !== null && (maxNum === -1 || images.length < maxNum)) {
      images.push(this.htmlUnescape(res[2]))
      res = reg.exec(content)
    }
    return images
  }

  imagesUploadHandler (start: () => void, finish: () => void) {
    const forceFail = false
    return (blobInfo: { base64: () => unknown }, success: (a: string) => unknown, failure: (arg0: string, arg1: { remove: boolean }) => void, progress: (a: number) => unknown) => {
      start()
      const base64 = blobInfo.base64()
      const upload = (img:string) => {
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
      if (typeof base64 === 'string') {
        upload('data:image/jpeg;base64,' + base64)
      } else {
        const p = base64 as Promise<unknown>
        p.then((v:unknown) => {
          upload(v as string)
        }).catch((e) => {
          console.error(e)
        })
      }
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

  trimTextWithLength (content:string, maxLegnth:number, dotLegnth = 3, dot = '.') {
    if (content === '') return ''
    if (content.length > maxLegnth) {
      content = content.substring(0, maxLegnth - dotLegnth)
      return content.padEnd(maxLegnth, dot)
    }
    return content
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
