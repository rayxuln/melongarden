import { promiseHelper } from './Mocker'

export default function ():Promise<unknown> {
  return promiseHelper({
    url: process.env.BASE_URL + 'logo.png'
  }, 1000, '', false)
}
