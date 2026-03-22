const Blog = require('../models/blog')

const initialBlogs = [
  {
  "title": 'How to win game theory',
  "author": "Givenchy",
  "url": 'Idk1',
  "likes": 50,
  },
  {
  "title": 'How to win Miss Universe',
  "author": 'Catriona Gray',
  "url": 'Idk2',
  "likes": 1232,
  }
]
const blogInDbs = async () => {
    blogs = await Blog.find({}) 
    return blogs.map(blog => blog.toJSON())
}

module.exports = {initialBlogs, blogInDbs}