import { screen, render } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { useSession } from 'next-auth/react'
import { SignInButton } from '.'
import { Session } from 'next-auth'

// just initialize the mock
jest.mock("next-auth/react")

describe('SignInButtonComponent', () => {
  it("renders correctly when user isn't logged in", () => {
    const useSessionMocked = mocked(useSession)

    // mock the useSession value per test
    // *** OBS: advises that mocked is deprecated ***
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated'
    })

    render(
      <SignInButton />
    )

    expect(screen.getByText('Sign in with Github')).toBeInTheDocument()
  })

  it("renders correctly when user is logged in", () => {
    const useSessionMocked = mocked(useSession)

    // fake user to mock
    const data: Session = {
      user: {
        name: 'John Doe',
        email: 'johndoe@hotmail.com' 
      },
      expires: 'fake-expires',
    }

    // here we pass the fake data to mock exactly like it needs, with ts help
    useSessionMocked.mockReturnValueOnce(
      { data, status: 'authenticated' }
    )

    render(
      <SignInButton />
    )

    // expect value John Doe, the name of the logged user
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })
})