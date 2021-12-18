import { render, screen } from '@testing-library/react'
import { getSession } from 'next-auth/react'
import { mocked } from 'ts-jest/utils'
import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { getPrismicioClient } from '../../services/prismic'

jest.mock('../../services/prismic.ts')
jest.mock('next-auth/react')

const post = {
  slug: 'my-new-fake-post',
  title: 'My new fake post',
  content: '<p>Post excerpt</p>',
  updatedAt: '10 de Abril'
}

describe('Post page', () => {
  it('renders correctly', () => {
    render(<Post post={post} />)

    expect(screen.getByText('My new fake post')).toBeInTheDocument()
    expect(screen.getByText('Post excerpt')).toBeInTheDocument()
  })

  it('redirects user if no subscription is found', async () => {
    const getSessionMocked = mocked(getSession)

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: null
    } as any)

    const response = await getServerSideProps({
      params: { slug: 'my-new-fake-post' }
    } as any)

    // toEqual will checks if what was passed match with what is required
    expect(response).toEqual(
      // here is saying that the requirement is to have this inside the answer
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/'
        })
      })
    )
  })

  it('loads initial data', async () => {
    const getSessionMocked = mocked(getSession)

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

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription'
    } as any)

    const response = await getServerSideProps({
      params: { slug: 'my-new-fake-post' }
    } as any)

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