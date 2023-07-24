import Stripe from 'stripe'
import { version } from '../../package.json'

export const stripe = new Stripe(
  process.env.STRIPE_API_KEY,
  {
    apiVersion: '2020-08-27',
    appInfo: {
      name: 'Ignews',
      version
    }
  }
)

stripe.webhookEndpoints.list({
  limit: 1
}).then(res => {
  if (!(res.data.length > 0)) {
    stripe.webhookEndpoints.create({
      url: 'https://ignews-beige.vercel.app/api/webhooks',
      api_version: '2020-08-27',
      enabled_events: [
        'checkout.session.completed',
        'customer.subscription.updated',
        'customer.subscription.deleted'
      ],
    }).then(() => console.log('webhook created'))
  }
})
