'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './FAQ.module.css';

const faqs = [
  {
    question: 'Как работает поиск жилья на GoHood?',
    answer: 'На GoHood вы можете легко найти идеальное жилье. Просто выберите город, укажите даты заезда и выезда, и мы покажем вам все доступные варианты. Вы можете фильтровать результаты по цене, типу жилья и другим параметрам.'
  },
  {
    question: 'Какие гарантии безопасности при аренде?',
    answer: 'Все объявления на GoHood проходят тщательную проверку. Мы работаем только с проверенными арендодателями и гарантируем безопасность сделки. Кроме того, мы предоставляем страховку и юридическую поддержку при необходимости.'
  },
  {
    question: 'Как происходит оплата?',
    answer: 'Оплата происходит через безопасную платежную систему GoHood. Вы можете оплатить аренду картой или банковским переводом. Деньги замораживаются до заезда и переводятся арендодателю только после подтверждения заселения.'
  },
  {
    question: 'Что делать, если возникли проблемы с жильем?',
    answer: 'Наша служба поддержки работает 24/7 и готова помочь в любой ситуации. Если возникли проблемы с жильем, свяжитесь с нами, и мы поможем решить вопрос или подберем альтернативный вариант.'
  },
  {
    question: 'Можно ли снять жилье на длительный срок?',
    answer: 'Да, на GoHood доступна как краткосрочная, так и долгосрочная аренда. Вы можете выбрать период от нескольких дней до нескольких лет. При долгосрочной аренде мы предоставляем специальные условия и скидки.'
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={styles.faq}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Часто задаваемые вопросы</h2>
          <p className={styles.subtitle}>
            Ответы на самые популярные вопросы об аренде жилья через GoHood
          </p>
        </div>
        <div className={styles.accordion}>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={styles.item}
              data-state={openIndex === index ? 'open' : 'closed'}
            >
              <button
                className={styles.button}
                onClick={() => toggleItem(index)}
                aria-expanded={openIndex === index}
              >
                <span className={styles.question}>{faq.question}</span>
                <ChevronDown className={styles.icon} />
              </button>
              <div className={styles.content}>
                <p className={styles.answer}>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 