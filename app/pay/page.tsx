'use client';

import { useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';

interface Product {
    name: string;
    amount: number;
}

interface PaymentFormProps {
    product: Product;
}

export default function PayPage() {
    // Example product - in real app this would come from props or API
    const product: Product = {
        name: "Example Product",
        amount: 100
    };

    return <PaymentForm product={product} />;
}

function PaymentForm({ product }: PaymentFormProps) {
    const [paymentMethod, setPaymentMethod] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const handleYooKassaPayment = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/create-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: product.amount,
                    description: product.name,
                }),
            });

            const data = await response.json();
            
            if (data.confirmation?.confirmation_url) {
                window.location.href = data.confirmation.confirmation_url;
            } else {
                throw new Error('No confirmation URL received');
            }
        } catch (error) {
            console.error('Payment error:', error);
            alert('Произошла ошибка при создании платежа. Пожалуйста, попробуйте позже.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!paymentMethod) {
            alert('Пожалуйста, выберите способ оплаты');
            return;
        }

        if (paymentMethod === 'card-ru') {
            await handleYooKassaPayment();
        } else {
            // Handle other payment methods
            console.log('Processing payment:', {
                product,
                paymentMethod
            });
        }
    };

    return (
        <div className={styles.container}>
            <form className={styles.paymentForm} onSubmit={handleSubmit}>
                <h1 className={styles.title}>Оформление заказа</h1>
                
                <div className={styles.orderInfo}>
                    <p><strong>Товар:</strong> {product.name}</p>
                    <p><strong>Сумма:</strong> {product.amount} ₽</p>
                </div>

                <div className={styles.paymentSections}>
                    <div className={styles.paymentSection}>
                        <h2 className={styles.sectionTitle}>Для РФ</h2>
                        <div className={styles.paymentMethods}>
                            <div className={styles.paymentMethod}>
                                <input
                                    type="radio"
                                    id="yoomoney"
                                    name="paymentMethod"
                                    value="yoomoney"
                                    checked={paymentMethod === 'yoomoney'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <label htmlFor="yoomoney">
                                    <Image 
                                        src="/images/yookassa.webp" 
                                        alt="ЮMoney" 
                                        width={24} 
                                        height={24}
                                    />
                                    ЮMoney
                                </label>
                            </div>
                            <div className={styles.paymentMethod}>
                                <input
                                    type="radio"
                                    id="card-ru"
                                    name="paymentMethod"
                                    value="card-ru"
                                    checked={paymentMethod === 'card-ru'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <label htmlFor="card-ru">
                                    <Image 
                                        src="/images/card.webp" 
                                        alt="Банковская карта" 
                                        width={24} 
                                        height={24}
                                    />
                                    Банковская карта
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className={styles.paymentSection}>
                        <h2 className={styles.sectionTitle}>Для не РФ</h2>
                        <div className={styles.paymentMethods}>
                            <div className={styles.paymentMethod}>
                                <input
                                    type="radio"
                                    id="paypal"
                                    name="paymentMethod"
                                    value="paypal"
                                    checked={paymentMethod === 'paypal'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <label htmlFor="paypal">
                                    <Image 
                                        src="/images/paypal.webp" 
                                        alt="PayPal" 
                                        width={24} 
                                        height={24}
                                    />
                                    PayPal
                                </label>
                            </div>
                            <div className={styles.paymentMethod}>
                                <input
                                    type="radio"
                                    id="card-stripe"
                                    name="paymentMethod"
                                    value="card-stripe"
                                    checked={paymentMethod === 'card-stripe'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <label htmlFor="card-stripe">
                                    <Image 
                                        src="/images/stripe.webp" 
                                        alt="Stripe" 
                                        width={24} 
                                        height={24}
                                    />
                                    Банковская карта (Stripe)
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <button 
                    type="submit" 
                    className={styles.submitButton}
                    disabled={!paymentMethod || isLoading}
                >
                    {isLoading ? 'Обработка...' : `Оплатить ${product.amount} ₽`}
                </button>
            </form>
        </div>
    );
}



//<form method="POST" action="https://yoomoney.ru/quickpay/confirm">
/* <input type="hidden" name="receiver" value="410018659568750" />
<input type="hidden" name="label" value="8887778" />
<input type="hidden" name="quickpay-form" value="button" />
<input type="hidden" name="sum" value="100" data-type="number" />
<label><input type="radio" name="paymentType" value="PC" />ЮMoney</label>
<label><input type="radio" name="paymentType" value="AC" />Банковской картой</label>
<input type="submit" value="Перевести" />
</form> */