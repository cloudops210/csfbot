"use client";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { createCheckoutSession, createPortalSession, clearCheckoutUrl } from '@/store/slices/subscriptionSlice';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { setUser } from '@/store/slices/authSlice';
import api from '@/lib/api';

// Replace with your actual Stripe Price IDs
const PLANS = [
  {
    name: 'Basic',
    price: '$10/mo',
    priceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID!,
    features: [
      'Up to 2 bots',
      'Standard support',
      'Basic analytics',
    ],
  },
  {
    name: 'Premium',
    price: '$30/mo',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID!,
    features: [
      'Unlimited bots',
      'Priority support',
      'Advanced analytics',
      'Backtesting',
    ],
  },
];

export default function SubscriptionPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status, error, checkoutUrl, loadingPriceId } = useSelector((state: RootState) => state.subscription);
  const { user, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
      dispatch(clearCheckoutUrl());
    }
  }, [checkoutUrl, dispatch]);

  // Add effect to handle subscription status refresh
  useEffect(() => {
    const shouldRefresh = searchParams.get('refresh') === 'true';
    if (shouldRefresh && token) {
      api.get('/api/auth/me')
        .then(res => {
          dispatch(setUser(res.data.user));
          // Remove the refresh parameter from URL
          router.replace('/dashboard/subscription');
        }).catch(console.error);
    }
  }, [searchParams, token, dispatch, router]);

  const handleManageSubscription = () => {
    dispatch(createPortalSession() as any);
  };

  const isSubscribed = user?.subscriptionStatus === 'active' || user?.subscriptionStatus === 'trialing';

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Subscription Plans</h1>
        <p className="text-accent mb-8">Choose the plan that's right for you.</p>
      </div>

      {isSubscribed && (
        <div className="text-center mb-10">
          <button
            onClick={handleManageSubscription}
            className="px-8 py-3 rounded-lg bg-black text-white font-semibold shadow-subtle hover:shadow-strong transition-all disabled:opacity-50"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Loading...' : 'Manage Your Subscription'}
          </button>
          <p className="text-sm text-accent mt-2">
            You are currently on the {user.subscriptionPlan} plan.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {PLANS.map((plan) => (
          <div key={plan.name} className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
            <div className="text-3xl font-bold mb-4">{plan.price}</div>
            <ul className="mb-6 space-y-2 text-gray-700">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <span className="mr-2 text-green-500">✔</span> {feature}
                </li>
              ))}
            </ul>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition disabled:opacity-50"
              disabled={loadingPriceId === plan.priceId}
              onClick={() => dispatch(createCheckoutSession(plan.priceId) as any)}
            >
              {loadingPriceId === plan.priceId ? 'Processing...' : 'Subscribe'}
            </button>
            {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
          </div>
        ))}
      </div>
    </div>
  );
} 