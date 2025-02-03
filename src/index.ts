import { Hono } from 'hono'

export interface Env {
  kv_account: KVNamespace;
}

const app = new Hono()

app.get('/', (c) => {
  console.log('------')
  return c.text('Hono!')
})

app.post('/login', async (c) => {
  const { username, password } = await c.req.json()
  // @ts-ignore
  const env = c.env as Env

  // 从 KV 中异步获取存储的账号密码
  const kv_account = await env.kv_account.get('kv_account')
  const kv_password = await env.kv_account.get('kv_password')
  if(!kv_account || !kv_password) {
    await env.kv_account.put('kv_account', username)
    await env.kv_account.put('kv_password', password)
  }
  console.log(kv_account, kv_password)
  
  // 验证账号密码
  if (!kv_account || !kv_password) {
    return c.json({ success: false, message: '账号未设置' }, 400)
  }
  
  if (username === kv_account && password === kv_password) {
    return c.json({ success: true, message: '登录成功' })
  } else {
    return c.json({ success: false, message: '账号或密码错误' }, 401)
  }
})


// 为了在 Cloudflare Workers 中正确工作，需要导出默认对象
export default app
