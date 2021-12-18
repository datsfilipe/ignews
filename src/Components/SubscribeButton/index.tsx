import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { api } from '../../services/api'
import { getStripeJs } from '../../services/stripe-js'
import styles from './styles.module.scss'

export function SubscribeButton () {
  const router = useRouter()
  const { data: session } = useSession()

  async function handleSubscribe () {
    if (!session) {
      signIn('github')
      return
    }
    
    if (session.activeSubscription) {
      router.push('/posts')
      return
    }

    try {
      const response = await api.post('/subscribe')

      const { sessionId } = response.data

      const stripe = await getStripeJs()

      await stripe.redirectToCheckout({ sessionId })
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
      disabled
    >
      Subscribe now
    </button>
  )
}