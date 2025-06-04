import Link from 'next/link';
import styles from './page.module.css';
import { FaBullhorn, FaStar, FaArrowUp, FaQuestionCircle } from 'react-icons/fa';

const services = [
  {
    icon: <FaBullhorn />,
    title: 'Продвижение объявления',
    desc: 'Ваше объявление будет показываться выше других и получит больше просмотров.',
    price: '299 ₽ / неделя',
    button: 'Оплатить',
  },
  {
    icon: <FaStar />,
    title: 'Выделение специальной маркой',
    desc: 'Объявление будет выделено яркой маркой и привлечёт больше внимания.',
    price: '199 ₽ / неделя',
    button: 'Оплатить',
  },
  {
    icon: <FaArrowUp />,
    title: 'Поднятие в топ',
    desc: 'Мгновенно поднимите объявление в верх списка для максимальной видимости.',
    price: '149 ₽ / час',
    button: 'Оплатить',
  },
];

export default function ServicePage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Платные услуги</h1>
      <p className={styles.subtitle}>Выберите подходящую услугу для продвижения вашего объявления</p>
      <div className={styles.cardsRow}>
        {services.map((service, idx) => (
          <div className={styles.card} key={idx}>
            <div className={styles.cardIcon}>{service.icon}</div>
            <div className={styles.cardTitle}>{service.title}</div>
            <div className={styles.cardDesc}>{service.desc}</div>
            <div className={styles.cardPrice}>{service.price}</div>
            <Link href={'/signin'} className={styles.payButton}>{service.button}</Link>
          </div>
        ))}
      </div>
      <div className={styles.fullWidthCard}>
        <div className={styles.fullWidthContent}>
          <div className={styles.fullWidthLeft}>
            <div className={styles.cardIcon}><FaQuestionCircle /></div>
            <div className={styles.cardTitle}>Нужно что-то ещё?</div>
            <div className={styles.cardDesc}>Отправьте нам запрос, и мы постараемся найти решение для вашей задачи</div>
          </div>
          <div className={styles.fullWidthRight}>
            <Link href={'/signin'} className={styles.requestButton}>Отправить запрос</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
