import { describe, test, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import Login from '../app/pages/Login'

vi.mock('../app/services/login', () => ({
  default: {
    login: vi.fn().mockRejectedValue({ response: { data: { error: 'Invalid credentials' } } }),
  },
}))

vi.mock('react-router', async (importActual) => {
  const actual = await importActual()
  return { ...actual, useNavigate: () => vi.fn() }
})

afterEach(() => {
  cleanup()
})

describe('Login page', () => {
  test('renders the OwlCook heading', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: 'OwlCook' })).toBeInTheDocument()
  })

  test('shows an error message when submitting empty fields', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByText('Login', { selector: 'button' }))
    await waitFor(() => {
      expect(screen.getByText('Please fill in all fields!')).toBeInTheDocument()
    })
  })

  test('renders email and password inputs', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )
    expect(screen.getByPlaceholderText('your.email@college.edu')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
  })
})
