import { describe, test, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import supertest from 'supertest'
import mongoose from 'mongoose'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

const TEST_USER = {
  email: 'testuser@owlcook.test',
  name: 'Test User',
  password: 'password123',
}

beforeAll(async () => {
  await mongoose.connection.asPromise()
})

beforeEach(async () => {
  await User.deleteMany({ email: TEST_USER.email })
})

afterAll(async () => {
  await User.deleteMany({ email: TEST_USER.email })
  await mongoose.connection.close()
})

describe('POST /api/users - registration', () => {
  test('creates a new user and returns 201 with no passwordHash', async () => {
    const response = await api
      .post('/api/users')
      .send(TEST_USER)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(response.body.email).toBe(TEST_USER.email)
    expect(response.body.name).toBe(TEST_USER.name)
    expect(response.body.passwordHash).toBeUndefined()
  })

  test('rejects registration when name or password is too short (400)', async () => {
    const response = await api
      .post('/api/users')
      .send({ email: 'short@owlcook.test', name: 'Ab', password: 'xy' })
      .expect(400)

    expect(response.body.error).toBeDefined()
  })

  test('rejects duplicate email registration with 400', async () => {
    await api.post('/api/users').send(TEST_USER).expect(201)

    const response = await api
      .post('/api/users')
      .send({ email: TEST_USER.email, name: 'Another', password: 'another123' })
      .expect(400)

    expect(response.body.error).toBeDefined()
  })
})
