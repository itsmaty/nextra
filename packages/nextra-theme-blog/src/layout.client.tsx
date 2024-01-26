'use client'

import { usePathname } from 'next/navigation'
import type { NextraThemeLayoutProps } from 'nextra'
import { BlogProvider } from './blog-context'
import Meta from './meta'
import Nav from './nav'
import type { BlogFrontMatter } from './types'
import { isValidDate } from './utils/date'
export function ClientLayout({
  children,
  pageOpts,
  themeConfig
}: NextraThemeLayoutProps<BlogFrontMatter>) {
  const config = { ...DEFAULT_THEME, ...themeConfig }

  const ref = useRef<HTMLHeadingElement>(null)

  const { title: pageTitle, frontMatter } = pageOpts

  frontMatter.type ||= 'post'

  const { type, date } = frontMatter
  if (!layoutSet.has(type)) {
    throw new Error(
      `nextra-theme-blog does not support the layout type "${type}" It only supports "post", "page", "posts" and "tag"`
    )
  }

  if (date && !isValidDate(date)) {
    throw new Error(
      `Invalid date "${date}". Provide date in "YYYY/M/D", "YYYY/M/D H:m", "YYYY-MM-DD", "[YYYY-MM-DD]T[HH:mm]" or "[YYYY-MM-DD]T[HH:mm:ss.SSS]Z" format.`
    )
  }

  // @ts-expect-error
  const Footer = {
    post: () => (
      <>
        {themeConfig.postFooter}
        {themeConfig.comments}
      </>
    ),
    page: null
  }[type]

  return (
    <BlogProvider value={{ config: themeConfig, opts: pageOpts }}>
      <h1>{pageTitle}</h1>
      {type === 'post' ? <Meta /> : <Nav />}
      {Footer && <Footer />}
      {children}
    </BlogProvider>
  )
}