/* 
  gatsby 在构建时加载指定插件的公开功能
*/
module.exports = {
  siteMetadata: {
    title: `Bingo's blog`,
    author: `wangjun`
  },
  plugins: [
    `gatsby-plugin-catch-links`,
    `gatsby-plugin-react-helmet`,
    {/* 源插件：创建节点，然后通过一个转换器插件将其转换为可用的格式 */
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages',
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 960,
              linkImagesToOriginal: false
            }
          }
        ] // just in case those previously mentioned remark plugins sound cool :)
      }
    }
  ],
}
