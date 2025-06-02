import styles from './page.module.css';

export default function PayPage() {
    return <div className={styles.container}>
        <form method="POST" action="https://yoomoney.ru/quickpay/confirm">
            <input type="hidden" name="receiver" value="410018659568750" />
            <input type="hidden" name="label" value="8887778" />
            <input type="hidden" name="quickpay-form" value="button" />
            <input type="hidden" name="sum" value="100" data-type="number" />
            <label><input type="radio" name="paymentType" value="PC" />ЮMoney</label>
            <label><input type="radio" name="paymentType" value="AC" />Банковской картой</label>
            <input type="submit" value="Перевести" />
        </form>

    </div>;
}