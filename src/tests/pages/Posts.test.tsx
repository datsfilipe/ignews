import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import Posts, { getStaticProps } from '../../pages/posts'
import { getPrismicioClient } from '../../services/prismic'

jest.mock('../../services/prismic.ts')

const posts = [
  {
    slug: 'my-new-fake-post',
    title: 'My new fake post',
    excerpt: 'Post excerpt',
    updatedAt: '10 de Abril'
  }
]

describe('Posts page', () => {
  it('renders correctly', () => {
    render(<Posts posts={posts} />)

    expect(screen.getByText('My new fake post')).toBeInTheDocument()
  })

  it('loads initial data correctly', async () => {
    const getPrismicClientMocked = mocked(getPrismicioClient)

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'my-new-fake-post',
            data: {
              title: [
                { type: 'heading', text: 'My new fake post' }
              ],
              content: [
                { type: 'paragraph', text: 'Post excerpt' }
              ],
            },
            last_publication_date: '04-01-2021'
          }
        ]
      })
    } as any)

    const response = await getStaticProps({})

    // toEqual will checks if what was passed match with what is required
    expect(response).toEqual(
      // here is saying that the requirement is to have this inside the answer
      expect.objectContaining({
        props: {
          posts: [{
            slug: 'my-new-fake-post',
            title: 'My new fake post',
            excerpt: 'Post excerpt',
            updatedAt: '01 de abril de 2021' 
          }]
        }
      })
    )
  })
})