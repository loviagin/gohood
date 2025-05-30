import styles from "./FAQ.module.css";

export function FAQ() {
  return (
    <section className={styles.faq}>
      <div className={styles.container}>
        <h2 className={styles.title}>Вопросы и ответы</h2>
        <div className={styles.questionsList}>
          <div className={styles.questionItem}>
            <h3 className={styles.question}>Какой процент комиссии?</h3>
            <p className={styles.answer}>Бесплатное размещение и никаких скрытых комиссий.</p>
          </div>
          <div className={styles.questionItem}>
            <h3 className={styles.question}>Как происходит заселение жильцов?</h3>
            <p className={styles.answer}>Дистанционно. Ключи вы можете передать электронно или оставить интрукцию как их получить на месте. Важное условие - заселение должно проходить полностью онлайн.</p>
          </div>
        </div>
      </div>
    </section>
  );
} 