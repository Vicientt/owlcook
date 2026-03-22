const {test, after, beforeEach, describe} = require('node:test')
const assert = require('node:assert')
const app = require('../app')
const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')
const logger = require('../utils/logger')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    logger.info("Delete all notes!")

    await Blog.insertMany(helper.initialBlogs)
    logger.info(`Saved ${helper.initialBlogs.length} notes!`)
})

// 4.8
test('get data from blog', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

// 4.9
test('unique identifier is named id', async () => {
    const response = await api.get('/api/blogs')

    const first_element = response.body[0]

    assert(first_element !== undefined)
})

test('add a new blog success', async () => {
    const blog = {
        "title": 'Get into UN',
        "author": 'Golden Ramsey',
        "url": 'Idk3',
        "likes": 889
    }

    await api
        .post('/api/blogs')
        .send(blog)
        .expect(201)
    
    const new_blogs = await helper.blogInDbs()

    assert.strictEqual(new_blogs.length, helper.initialBlogs.length + 1)

    const content = new_blogs.map(n => n.title)
    assert(content.includes('Get into UN'))
})

test('check return default 0 value', async () => {
    const blog = {
        "title": 'Get into UN',
        "author": 'Golden Ramsey',
        "url": 'Idk3'
    }

    await api
        .post('/api/blogs')
        .send(blog)
        .expect(201)
    
    const new_blogs = await helper.blogInDbs()
    const blog_posted = new_blogs.find(blog => blog.title === 'Get into UN')
    logger.info(blog_posted)

    assert.strictEqual(blog_posted.likes, 0)
})

describe.only('test title and url', async () => {
    test('missing url', async () => {
        const blog = {
        "title": 'Get into UN',
        "author": 'Golden Ramsey',
        }

        await api
            .post('/api/blogs')
            .send(blog)
            .expect(400)
        
    })

    test('missing title', async () => {
        const blog = {
        "author": 'Golden Ramsey',
        "url": "Idk5"
        }

        await api
            .post('/api/blogs')
            .send(blog)
            .expect(400)
        
    })
})

after(async () => {
    await mongoose.connection.close()
})