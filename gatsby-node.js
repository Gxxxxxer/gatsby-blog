/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const path = require('path');

exports.createPages = ({ boundActionCreators, graphql }) => {
    /* 
    * 使用了 createPage 激活了 boundActionCreators，Gatsby 在内部使用 Redux 来管理其状态，
    * boundActionCreators 仅仅是 Gatsby 创造的一个action
    */
    const { createPage } = boundActionCreators;
    // 获取创建的 blogPostTemplate 的路径
    const blogPostTemplate = path.resolve(`src/templates/blog-post.js`);

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