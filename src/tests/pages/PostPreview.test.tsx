import { render, screen } from '@testing-library/react'
import { getSession, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { mocked } from 'ts-jest/utils'
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]'
import { getPrismicioClient } from '../../services/prismic'

jest.mock('../../services/prismic.ts')
jest.mock('next-auth/react')
jest.mock('next/router')

const post = {
  slug: 'my-new-fake-post',
  title: 'My new fake post',
  content: '<p>Post excerpt</p>',
  updatedAt: '10 de Abril'
}

describe('Post preview page', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce({
      data: {
        session: null
      }
    } as any)

    render(<Post post={post} />)

    expect(screen.getByText('My new fake post')).toBeInTheDocument()
    expect(screen.getByText('Post excerpt')).toBeInTheDocument
    ()
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
  })

  it('redirects to full post when user is subscribed', async () => {
    const useSessionMocked = mocked(useSession)
    const useRouterMocked = mocked(useRouter)
    const pushMock = jest.fn()

    const data = {
      activeSubscription: 'fake-active-subscription'
    }

    useSessionMocked.mockReturnValueOnce({
      data, status: "authenticated"
    } as any)

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any)

    render(<Post post={post} />)

    expect(pushMock).toHaveBeenCalledWith('/posts/my-new-fake-post')
  })

  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicioClient)

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            { type: 'heading', text: 'My new fake post' }
          ],
          content: [
            { type: 'paragraph', text: 'Post content' }
          ],
        },
        last_publication_date: '04-01-2021'
      })
    } as any)

    const response = await getStaticProps({
      params: { slug: 'my-new-fake-post' }
    })

    // toEqual will checks if what was passed match with what is required
    expect(response).toEqual(
      // here is saying that the requirement is to have this inside the answer
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-fake-post',
            title: 'My new fake post',
            content: '<p>Post content</p>',
            updatedAt: '01 de abril de 2021' 
          }
        }
      })
    )
  })
})