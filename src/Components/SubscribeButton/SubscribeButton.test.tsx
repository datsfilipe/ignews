import { screen, render, fireEvent } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { SubscribeButton } from '.'
import { Session } from 'next-auth'

// just initialize the mock
jest.mock("next-auth/react")
jest.mock('next/router')

describe('SubscribeButton component', () => {
  it("renders correctly", () => {
    const useSessionMocked = mocked(useSession)

    // mock the useSession value per test
    // *** OBS: advises that mocked is deprecated ***
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated'
    })

    render(<SubscribeButton />)

    expect(screen.getByText('Subscribe now')).toBeInTheDocument()
  })

  it('redirects user to sign in when not authenticated', () => {
    const useSessionMocked = mocked(useSession)
    const signInMocked = mocked(signIn)

    // mock the useSession value per test
    // *** OBS: advises that mocked is deprecated ***
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated'
    })
    
    render(<SubscribeButton />)

    // it just store the component into a function to be used after
    const subscribeButton = screen.getByText('Subscribe now')

    // fireEvent.click simulates a click on button
    fireEvent.click(subscribeButton)

    // so as the button was clicked, we can check if the route was called with the correct param
    expect(signInMocked).toHaveBeenCalled()
  })

  it('redirects to posts when user already has a subscription', () => {
    const useRouterMocked = mocked(useRouter)
    const useSessionMocked = mocked(useSession)

    // for useSession:
    // fake user to mock
    const data: Session = {
      user: {
        name: 'John Doe',
        email: 'johndoe@hotmail.com' 
      },
      activeSubscription: 'fake-active-subscription',
      expires: 'fake-expires',
    }

    // here we pass the fake data to mock exactly like it needs, with ts help
    useSessionMocked.mockReturnValueOnce(
      { data, status: 'authenticated' }
    )

    // for useRouter:
    const pushMock = jest.fn()

    useRouterMocked.mockReturnValueOnce({
      push: pushMock
      // this is just to not input here all the returned values from next router
    } as any)

    render(<SubscribeButton />)

    const subscribeButton = screen.getByText('Subscribe now')

    fireEvent.click(subscribeButton)

    expect(pushMock).toHaveBeenCalledWith('/posts')
  })
})