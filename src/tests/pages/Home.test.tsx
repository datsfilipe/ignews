import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import Home, { getStaticProps } from '../../pages/index'
import { stripe } from '../../services/stripe'

jest.mock('next/router')
jest.mock('next-auth/react', () => {
  return {
    useSession() {
      return {
        data: null,
        status: 'unauthenticated'
      }
    }
  }
})
jest.mock('../../services/stripe.ts')

describe('Home page', () => {
  it('renders correctly', () => {
    render(<Home product={{ priceId: 'fake-priceId', amount: 'R$45,00' }} />)

    expect(screen.getByText('for R$45,00 month')).toBeInTheDocument()
  })

  it('loads initial data correctly', async () => {
    const retrieveStripePriceMocked = mocked(stripe.prices.retrieve)

    retrieveStripePriceMocked.mockResolvedValueOnce({
      id: 'fake-price-id',
      unit_amount: 1000,
    } as any)

    const response = await getStaticProps({})

    // toEqual will checks if what was passed match with what is required
    expect(response).toEqual(
      // here is saying that the requirement is to have this inside the answer
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake-price-id',
            amount: '$10.00'
          }
        }
      })
    )
  })
})