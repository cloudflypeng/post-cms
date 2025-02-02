import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  console.log('------')
  return c.text('Hono!')
})

// 为了在 Cloudflare Workers 中正确工作，需要导出默认对象
export default app
