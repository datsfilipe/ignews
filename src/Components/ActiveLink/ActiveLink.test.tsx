import { screen, render } from '@testing-library/react'
import { ActiveLink } from '.'

/**
 * a mock is a imitation of a functionality that's not only of the current element
 * in unit tests it makes logic to use mocks cause we want to test a single element.
 * a mock:
 */
jest.mock("next/router", () => {
  return {
    useRouter() {
      return {
        asPath: "/"
      }
    }
  }
})

/**
 * describe is used to organize the tests
 * as bellow
 * the describe tells what the tests written inside are testing
 * in a more semantic way, you can use "it" instead of "test"
 * cause describe might already said what component is being tested.
 */
describe('ActiveLinkComponent', () => {
  it('renders correctly', () => {
    render(
      <ActiveLink
        href="/"
        activeClassName="active"
      >
        <a>Home</a>
      </ActiveLink>
    )
 
    // get a element by a text inside an expect function
    // after that says the behavior that's expected
    expect(screen.getByText('Home')).toBeInTheDocument()
  })
  
  it('adds active class if the link is currently active', () => {
    render(
      <ActiveLink
        href="/"
        activeClassName="active"
      >
        <a>Home</a>
      </ActiveLink>
    )
  
    // get a element by a text inside an expect function
    // after that says the behavior that's expected
    expect(screen.getByText('Home')).toHaveClass('active')
  })
})