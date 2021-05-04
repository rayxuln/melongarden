
export class TagsBuilder {
  tags:Array<Record<string, string>> = []

  append (type:string, tag:string, add = true) {
    if (add) {
      this.tags.push({ type, tag })
    }
    return this
  }

  build () {
    return this.tags
  }
}

type JsonHandlerReturnType = Record<string, unknown> | Promise<unknown>
type JsonHandler = (json:Record<string, unknown>) => JsonHandlerReturnType

class Tools {
  // GO_API_BASE_URL = 'http://81.68.104.78:8082/' // 'http://192.168.43.139:8082/'
  GO_API_BASE_URL = ''

  constructor () {
    this.GO_API_BASE_URL = document.location.protocol === 'https:' ? 'https://mc.raiix.com:8085/' : 'http://81.68.104.78:8082/'
  }

  objectToQuery (args:Record<string, unknown>) {
    let query = '?'
    for (const k in args) {
      query += k + '=' + encodeURIComponent(String(args[k])) + '&'
    }
    return query
  }

  goAPIGetOption (args:Record<string, unknown>) {
    return this.goAPIMakeOption(this.objectToQuery(args), 'GET', null)
  }

  goAPIEmptyGetOption () {
    return this.goAPIMakeOption('', 'GET', null)
  }

  goAPIMakeOption (query:string, method:string, body:unknown) {
    return {
      query,
      method,
      body
    }
  }

  goAPIPromiseHelper (path:string, options: {query:string, method:string, body:unknown}, jsonHandler: JsonHandler, rejectReason:string, statusMap:Record<number, string> = {}) {
    return new Promise((resolve, reject) => {
      fetch(this.GO_API_BASE_URL + path + options.query, {
        method: options.method,
        body: options.body ? JSON.stringify(options.body) : null,
        headers: {
          token: window.localStorage.getItem('token') ?? '',
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then((res:Response) => {
        if (res.status === 200) {
          return res.json()
        } else {
          reject(new Error(statusMap[res.status] ?? 'Status is not ok. Status: ' + res.status))
        }
      }).then((v) => {
        const res = jsonHandler(v)
        if (res instanceof Promise) {
          res.then(v => {
            resolve(v)
          }).catch(e => {
            reject(new Error(e))
          })
        } else {
          resolve(res)
        }
      }).catch((e) => {
        reject(new Error(rejectReason + e))
      })
    })
  }

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
