/**
 * 站点基础 URL。
 * 生产环境通过环境变量 NEXT_PUBLIC_SITE_URL 注入真实域名，
 * 否则回退到本地开发地址。避免把占位域名写死在多处。
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://solfege-ear-training.vercel.app";
