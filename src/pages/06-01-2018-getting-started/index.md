---
path: "/hello-gatsby6"
date: "2018-01-06T17:12:33.962Z"
title: "我是谁"
---

> Gatsby 是一个令人难以置信的静态站点生成器，它允许使用React作为渲染引擎来搭建一个静态站点。其原理就是在构建时通过服务器端渲染将动态的 React 组件呈现为静态 HTML 内容

Gatsby 最近发布了v1.0.0，推出了很多新特性。包括(但不限于)使用GraphQL创建内容查询的能力，与各种cms集成——包括 WordPress、Contentful、Drupal 等等。还有基于路由的代码分布使得用户体验更佳。在这次分享中，我们将简单探讨 Gatsby 和一些新特性，并创建一个静态博客。
### 一、起步
#### 1.安装cli
```bash
npm install -g gatsby-cli
```
Gatsby 带有一个很好的 CLI ，它包含了一个工作站点的搭建功能，以及帮助开发该站点的命令
```bash
gatsby new first-blog && cd $_
```
该命令将创建文件夹 first-blog，然后进入该目录。至此一个可供开发的环境已经搭建好了。Gatsby 的 CLI 包含了许多常见的开发特性，比如 gatsby build (构建一个生产、静态生成的项目版本)、gatsby develop(启动一个热加载的web开发服务器)等等。
### 二、添加必要的插件
Gatsby 支持使用丰富的插件，很多非常有用的插件都是为了完成普通任务而编写的。插件可以分为三个主要类别:功能( functional )插件、源( source )插件和转换器( transformer )插件
#### 1.功能插件
功能插件用来实现某些功能（离线支持，生成一个站点地图等等）或者用来扩展了 Gatsby 的 webpack 配置，增加了对 Typescript、Sass 等的支持。 对于这个特定的博客文章，我们想要一个单页面应用的感觉(没有页面重载)，以及在head 标签中动态更改title标签的能力。正如所提到的，Gatsby 插件的生态系统是丰富的、充满活力的，而且还在不断增长，所以通常一个已经存在的插件，可以解决你想要解决的特定问题。为了解决我们想要的这个博客的功能，我们将使用以下插件：
 
- gatsby-plugin-catch-links
    - 实现了历史 pushState API, 不需要页面重载就可以导航到博客的不同页面
- gatsby-plugin-react-helmet
    - [react-helmet](https://github.com/nfl/react-helmet) 是一种允许修改head标签的工具 Gatsby 静态地呈现这些头部标签的变化

使用下面命令：
```bash
npm i -S gatsby-plugin-catch-links gatsby-plugin-react-helmet
```
在安装了这些功能插件之后，我们将编辑 gatsby-config.js（Gatsby 在构建时加载指定插件的公开功能）。

```bash
module.exports = {
  siteMetadata: {
    title: `Bingo's blog`,
    author: `wangjun`,
  },
  plugins: [
    'gatsby-plugin-catch-links',
    'gatsby-plugin-react-helmet',
  ],
}

```
我们现在还可以编辑网站 head 标签，同时还可以实现一个无需重新加载的单页面应用。现在，让我们通过实现一个源插件来增强基本功能，该插件可以实现从本地文件系统加载博客文章。
#### 2.源插件
源插件创建节点，然后通过一个转换器插件将其转换为可用的格式。例如，一个典型的工作流通常需要使用gatsby-source-filesystem它从磁盘上加载文件，例如 Markdown 文件，然后指定一个 Markdown 转换器将 Markdown 转换成 HTML 。 因为博客的大部分内容都使用 Markdown 格式，让我们添加gatsby-source-filesystem，与我们之前的步骤类似，我们将安装插件，然后将其注入到我们的 gatsby-config.js,像这样：
```bash
npm i -S gatsby-source-filesystem
```
```bash
module.exports = {
  // previous configuration
  plugins: [
    ...
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages`,
        name: `pages`,
      },
    }
    ...
  ]
}
```
#### 3.转换器插件
正如前面提到的，转换器插件采用了一些底层的数据格式，这种格式在当前的表单中是不可用的（Markdown，json，yaml等），我们可以用 GraphQL 查询把它转换成 Gatsby 能够理解的格式。filesystem 源插件将从我们的文件系统中加载文件节点(如 Markdown )，然后 Markdown 转换器将接管并转换为可用的 HTML 。我们将只使用一个转换器插件(用于 Markdown )。

- gatsby-transformer-remark
    - 使用 [remark](https://github.com/remarkjs/remark) Markdown解析器进行转换磁盘上的 md 文件为 HTML 。 此外，该转换器还可以选择使用插件来进一步扩展功能，例如通过 gatsby-remark-prismjs来添加语法高亮，通过 gatsby-remark-copy-linked-files 复制在 markdown 中指定的相关文件，通过 gatsby-remark-images 压缩图像，并使用 srcset 添加响应性图像等等。

安装对应插件：
```bash
npm i -S gatsby-transformer-remark gatsby-remark-images
```
编辑 gatsby-config.js
```bash
module.exports = {
  // previous setup
    plugins: [
    ...
    
        {
          resolve: 'gatsby-transformer-remark',
          options: {
            plugins: [
                {
                    resolve: 'gatsby-remark-images',
                    options: {
                      maxWidth: 960,
                      linkImagesToOriginal: false
                    }
                }
            ]
          }
        },
    ...
  ]
};
```
### 四、书写第一个Markdown文章
我们先前配置的 gatsby-source-filesystem 插件希望我们的内容能够放在 src/pages。Gatsby 在命名规范方面并没有什么规定，但博客文章的一个典型做法是给文件夹起个类似MM-DD-YYYY-title的名字，例如03-01-2018-hello-world。让我们创建一个文件夹src/pages/03-01-2018-getting-started，并创建 index. md 。这个Markdown文件的内容将是我们的博客文章：
```bash
---
path: "/hello-gatsby"
date: "2018-01-03T17:12:33.962Z"
title: "My First Gatsby Post"
---

Ooooops, my first blog post!
```
被包含在横线里的部分是什么？这就是所谓的frontmatter，而这部分内容可以供 React 组件使用（例如path，date，title等等）你可以添加其他的数据，因此，你可以自由地进行实验，找到必要的信息，以实现一个理想的博客系统，供你使用。重要的一点是，当我们动态创建页面来指定页面时，path将会被用到识别路由。在这个例子里http://localhost:8000/hello-gatsby将是这个文件的路径。 现在我们已经创建了一个带有frontmatter和一些内容的博客文章，我们可以开始编写一些可以显示这些数据的 React 组件。
### 五、创建React模板
创建一个 src/templates/blog-post.js文件
```bash
import React from 'react';
import Helmet from 'react-helmet';

export default function Template({
  data // this prop will be injected by the GraphQL query 
}) {
  const { markdownRemark: post } = data;
  return (
    <div className="blog-post-container">
      <Helmet title={`Your Blog Name - ${post.frontmatter.title}`} />
      <div className="blog-post">
        <h1>{post.frontmatter.title}</h1>
        <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: post.html }} />
      </div>
    </div>
  );
}
```
看到上面，你会想什么是markdownRemark？这个数据支持从何而来？这些问题，让我们通过编写一个GraphQL查询来回答，以便为我们的组件添加内容。
### 六、编写一个 GraphQL 查询
在 Template 声明下面，我们将添加一个 GraphQL 查询。这是 Gatsby 的一个非常强大的工具。这让我们可以很简单地挑选出我们想要展示给我们的博客文章的数据片段。我们的查询选择的每个数据都将通过我们前面指定的数据属性注入。
```bash
export const pageQuery = graphql`
  query BlogPostByPath($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
      }
    }
  }
`;

```
### 七、创建静态页面
Gatsby 开放了一个gatsby-node.js文件，它允许创建动态页面这样的功能（博客文章页！），扩展 babel 或 webpack 配置，修改所创建的节点或页面等。在这个文件中发现的每一个导出都将由 Gatsby 分析。Gatsby详细地介绍了它的Node API规范。但是，我们这里只关心这个实例中的一个特定的API createPages。
```bash
const path = require('path');

exports.createPages = ({ boundActionCreators, graphql }) => {
    /* 
    * 使用了 createPage 激活了 boundActionCreators，Gatsby 在内部使用 Redux 来管理其状态，
    * boundActionCreators 仅仅是 Gatsby 创造的一个action
    */
    const { createPage } = boundActionCreators;
    // 获取创建的 blogPostTemplate 的路径
    const blogPostTemplate = path.resolve(`src/templates/blog-post.js`);
    // 查询文章
    // 构造 GraphQL 查询，它将获取所有的 Markdown 贴子
    // excerpt 用于预览一个简短的代码片段
    return graphql(`{
        allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
        ) {
            edges {
                node {
                    excerpt(pruneLength: 250)
                    html
                    id
                    frontmatter {
                        date
                        path
                        title
                    }
                }
            }
        }
    }`)
    .then(result => {
        if (result.errors) {
            return Promise.reject(result.errors);
        }
        // 创建页面
        result.data.allMarkdownRemark.edges
            .forEach(({ node }) => {
                createPage({
                    path: node.frontmatter.path,
                    component: blogPostTemplate,
                    context: {
                        test:`666666`
                    } // additional data can be passed via context
                });
            });
    });
}
```
我们现在得到了一个 Promise 的 graphql 查询。实际的贴子可以通过路径 result.data.allMarkdownRemark.edges 获得。我们将使用这些数据来构建一个包含 Gatsby 的页面。我们的 GraphQL“形状”直接反映在这个数据对象中，因此，当我们在GraphQL博客文章模板中查询时，我们从该查询中提取的每个属性都将可用。 createPage API接受一个需要定义path和component 属性的对象，我们已经在上面做过了。此外，可以使用可选属性context来注入数据并使其可用于博客文章模板组件通过注入props（用各种 props 来查看每一个可用的 prop！）每一次我们构建 Gatsby 时， createPage 将被调用，Gatsby 将会创建一个静态的 HTML 文件路径根据我们在帖子的前面专门写的 frontmatter。GraphQL查询的数据将注入到 stringified 和 parsed 后的 React 模板。我们可以在这时运行 npm run develop 然后打开其中一个文章 http://localhost:8000/hello-gatsby6

### 八、创建博客列表
创造一个 src/pages/tags.js 文件
```bash
import React from 'react';
import Link from 'gatsby-link';
import Helmet from 'react-helmet';


export default function Index({
    data
}) {
    const { edges: posts } = data.allMarkdownRemark;
    return (
        <div className="blog-posts">
            {posts
                .filter(post => post.node.frontmatter.title.length > 0)
                .map(({ node: post }) => {
                    return (
                        <div className="blog-post-preview" key={post.id}>
                            <h1>
                                <Link to={post.frontmatter.path}>{post.frontmatter.title}</Link>
                            </h1>
                            <h2>{post.frontmatter.date}</h2>
                            <p>{post.excerpt}</p>
                        </div>
                    );
                })}
        </div>
    );
}

export const pageQuery = graphql`
 query IndexQuery {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          excerpt(pruneLength: 250)
          id
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            path
          }
        }
      }
    }
 }
`;
```
至此，一个简单的博客文章站点就完成了，随着我们对 Gatsby 及其API的探索，你应该感到有能力开始充分利用 Gatsby 的潜力，博客仅仅是一个起点;Gatsby 丰富的生态系统、可扩展的 API 和高级的查询功能为构建真正令人难以置信的高性能站点提供了强大的工具集。
### Links
- [@dschau/gatsby-blog-starter-kit](https://github.com/dschau/gatsby-blog-starter-kit)
    - 展示 Gatsby 所有上述功能的可用的库