import { useState } from 'react';
import styles from '../components/css/PremiumPage.module.css';
import StudentNavBar from '../components/StudentNavBar';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const PremiumPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);

  const plans = [
    {
      title: 'Starter',
      minutes: 30,
      price: 99,
      features: ['Basic support', '1:1 Chat', 'Connect with any tutor'],
    },
    {
      title: 'Pro',
      minutes: 90,
      price: 199,
      features: ['Priority support', '1:1 Video + Chat', 'Prefer tutor match'],
      popular: true,
    },
    {
      title: 'Elite',
      minutes: 200,
      price: 399,
      features: ['Instant connect', '1:1 Video + Chat', 'Connect with favorite tutors'],
    },
  ];

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBuyNow = async (plan) => {
    setLoading(plan.title);

    // Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert('Failed to load Razorpay SDK. Please check your internet connection.');
      setLoading(null);
      return;
    }

    try {
      // Create order on backend
      const orderResponse = await axios.post(
        'http://localhost:5000/payment/create-order',
        {
          amount: plan.price,
          planName: plan.title,
        }
      );

      if (!orderResponse.data.success) {
        throw new Error('Failed to create order');
      }

      const { order, key_id } = orderResponse.data;

      // Razorpay checkout options
      const options = {
        key: key_id,
        amount: order.amount,
        currency: order.currency,
        name: 'LiveMentor-Hub',
        description: `${plan.title} Plan - ${plan.minutes} Minutes`,
        image: '/favicon.ico',
        order_id: order.id,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verifyResponse = await axios.post(
              'http://localhost:5000/payment/verify',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            if (verifyResponse.data.success) {
              alert(`Payment Successful! ✅\nYou've purchased ${plan.minutes} minutes.\nPayment ID: ${response.razorpay_payment_id}`);
              // You can redirect or update user status here
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support.');
          } finally {
            setLoading(null);
          }
        },
        prefill: {
          name: localStorage.getItem('userName') || 'Demo User',
          email: 'demo@livementorhub.com',
          contact: '9999999999',
        },
        notes: {
          plan: plan.title,
          minutes: plan.minutes,
        },
        theme: {
          color: '#6366f1',
        },
        modal: {
          ondismiss: function () {
            setLoading(null);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment. Please try again.');
      setLoading(null);
    }
  };

  return (
    <>
      <StudentNavBar />
      <div className={styles.pageWrapper}>
        <button className={styles.goBackBtn} onClick={() => navigate(-1)}>← Go Back</button>

        <h1 className={styles.heading}>Upgrade to Premium</h1>
        <p className={styles.subheading}>
          Buy minutes & connect instantly with top-rated tutors.
        </p>
 

        <div className={styles.cardContainer}>
          {plans.map((plan, idx) => (
            <div key={idx} className={`${styles.planCard} ${plan.popular ? styles.popular : ''}`}>
              {plan.popular && <div className={styles.popularBadge}>Most Popular</div>}
              <h2 className={styles.planTitle}>{plan.title}</h2>
              <p className={styles.minutes}>{plan.minutes} Minutes</p>
              <p className={styles.price}>₹{plan.price}</p>
              <ul className={styles.featureList}>
                {plan.features.map((f, i) => (
                  <li key={i}>✓ {f}</li>
                ))}
              </ul>
              <button 
                className={styles.buyBtn}
                onClick={() => handleBuyNow(plan)}
                disabled={loading === plan.title}
              >
                {loading === plan.title ? 'Processing...' : 'Buy Now'}
              </button>
            </div>
          ))}
        </div>

        {/* Test Payment Info */}
        <div className={styles.testCardsInfo}>
          <h3>🧪 Test Payment (Demo Mode)</h3>
          <p className={styles.upiInfo}>
            Use UPI ID: <span className={styles.upiId}>success@razorpay</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default PremiumPage;
