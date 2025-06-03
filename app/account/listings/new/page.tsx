'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaHome, FaMapMarkerAlt, FaImages, FaInfoCircle, FaCheck, FaTimes } from 'react-icons/fa';
import styles from './page.module.css';

type FormData = {
  title: string;
  description: string;
  address: string;
  city: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: File[];
};

type ValidationErrors = {
  [key: string]: string;
};

const steps = [
  { id: 1, title: 'Основная информация', icon: FaHome },
  { id: 2, title: 'Расположение', icon: FaMapMarkerAlt },
  { id: 3, title: 'Фотографии', icon: FaImages },
  { id: 4, title: 'Дополнительно', icon: FaInfoCircle },
  { id: 5, title: 'Проверка', icon: FaCheck },
];

export default function NewListingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    address: '',
    city: '',
    price: 0,
    bedrooms: 1,
    bathrooms: 1,
    area: 0,
    images: [],
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'bedrooms' || name === 'bathrooms' || name === 'area' 
        ? Number(value) 
        : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        images: Array.from(e.target.files || [])
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.title.trim()) {
      errors.title = 'Название объявления обязательно';
    }
    if (!formData.description.trim()) {
      errors.description = 'Описание обязательно';
    }
    if (!formData.address.trim()) {
      errors.address = 'Адрес обязателен';
    }
    if (!formData.city.trim()) {
      errors.city = 'Город обязателен';
    }
    if (formData.price <= 0) {
      errors.price = 'Цена должна быть больше 0';
    }
    if (formData.bedrooms <= 0) {
      errors.bedrooms = 'Количество спален должно быть больше 0';
    }
    if (formData.bathrooms <= 0) {
      errors.bathrooms = 'Количество ванных должно быть больше 0';
    }
    if (formData.area <= 0) {
      errors.area = 'Площадь должна быть больше 0';
    }
    if (formData.images.length === 0) {
      errors.images = 'Загрузите хотя бы одно фото';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    // TODO: Implement form submission
    console.log('Form submitted:', formData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className={styles.stepContent}>
            <div className={styles.formGroup}>
              <label htmlFor="title" className={styles.label}>Название объявления</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Введите название объявления"
                required
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>Описание</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Опишите ваше жилье"
                required
                className={styles.textarea}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className={styles.stepContent}>
            <div className={styles.formGroup}>
              <label htmlFor="address" className={styles.label}>Адрес</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Введите адрес"
                required
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="city" className={styles.label}>Город</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Введите город"
                required
                className={styles.input}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className={styles.stepContent}>
            <div className={styles.formGroup}>
              <label htmlFor="images" className={styles.label}>Фотографии</label>
              <div className={styles.fileInput}>
                <label htmlFor="images" className={styles.fileInputLabel}>
                  <FaImages />
                  <span>Выберите фотографии</span>
                </label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  onChange={handleImageChange}
                  multiple
                  accept="image/*"
                  required
                />
                {formData.images.length > 0 && (
                  <div className={styles.fileList}>
                    {formData.images.map((file, index) => (
                      <div key={index} className={styles.fileItem}>
                        <span>{file.name}</span>
                        <FaTimes onClick={() => handleRemoveImage(index)} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className={styles.helperText}>
                Загрузите до 10 фотографий вашего жилья
              </p>
            </div>
          </div>
        );
      case 4:
        return (
          <div className={styles.stepContent}>
            <div className={styles.formGroup}>
              <label htmlFor="price" className={styles.label}>Цена за ночь (₽)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                required
                className={styles.input}
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="bedrooms" className={styles.label}>Спальни</label>
                <input
                  type="number"
                  id="bedrooms"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  min="1"
                  required
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="bathrooms" className={styles.label}>Ванные</label>
                <input
                  type="number"
                  id="bathrooms"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  min="1"
                  required
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="area" className={styles.label}>Площадь (м²)</label>
                <input
                  type="number"
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  min="0"
                  required
                  className={styles.input}
                />
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className={styles.stepContent}>
            <div className={styles.reviewSection}>
              <h3>Проверьте информацию</h3>
              {Object.keys(validationErrors).length > 0 && (
                <div className={styles.errorSection}>
                  <h4>Найдены ошибки:</h4>
                  <ul className={styles.errorList}>
                    {Object.entries(validationErrors).map(([field, error]) => (
                      <li key={field} className={styles.errorItem}>
                        <span className={styles.errorField}>{field}:</span> {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className={styles.reviewGrid}>
                <div className={`${styles.reviewItem} ${validationErrors.title ? styles.error : ''}`}>
                  <span className={styles.reviewLabel}>Название:</span>
                  <span className={styles.reviewValue}>{formData.title || 'Не указано'}</span>
                </div>
                <div className={`${styles.reviewItem} ${validationErrors.address ? styles.error : ''}`}>
                  <span className={styles.reviewLabel}>Адрес:</span>
                  <span className={styles.reviewValue}>{formData.address || 'Не указано'}</span>
                </div>
                <div className={`${styles.reviewItem} ${validationErrors.city ? styles.error : ''}`}>
                  <span className={styles.reviewLabel}>Город:</span>
                  <span className={styles.reviewValue}>{formData.city || 'Не указано'}</span>
                </div>
                <div className={`${styles.reviewItem} ${validationErrors.price ? styles.error : ''}`}>
                  <span className={styles.reviewLabel}>Цена за ночь:</span>
                  <span className={styles.reviewValue}>{formData.price ? `${formData.price} ₽` : 'Не указано'}</span>
                </div>
                <div className={`${styles.reviewItem} ${validationErrors.bedrooms ? styles.error : ''}`}>
                  <span className={styles.reviewLabel}>Спальни:</span>
                  <span className={styles.reviewValue}>{formData.bedrooms || 'Не указано'}</span>
                </div>
                <div className={`${styles.reviewItem} ${validationErrors.bathrooms ? styles.error : ''}`}>
                  <span className={styles.reviewLabel}>Ванные:</span>
                  <span className={styles.reviewValue}>{formData.bathrooms || 'Не указано'}</span>
                </div>
                <div className={`${styles.reviewItem} ${validationErrors.area ? styles.error : ''}`}>
                  <span className={styles.reviewLabel}>Площадь:</span>
                  <span className={styles.reviewValue}>{formData.area ? `${formData.area} м²` : 'Не указано'}</span>
                </div>
                <div className={`${styles.reviewItem} ${validationErrors.images ? styles.error : ''}`}>
                  <span className={styles.reviewLabel}>Фотографии:</span>
                  <span className={styles.reviewValue}>{formData.images.length ? `${formData.images.length} шт.` : 'Не загружены'}</span>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Создание нового объявления</h1>
          <p className={styles.subtitle}>
            Заполните форму ниже, чтобы создать новое объявление о сдаче жилья
          </p>
        </div>

        <div className={styles.steps}>
          {steps.map((step) => (
            <div
              key={step.id}
              className={`${styles.step} ${currentStep === step.id ? styles.activeStep : ''} ${currentStep > step.id ? styles.completedStep : ''}`}
              onClick={() => setCurrentStep(step.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.stepIcon}>
                <step.icon />
              </div>
              <span className={styles.stepTitle}>{step.title}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {renderStepContent()}

          <div className={styles.formActions}>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className={styles.backButton}
              >
                Назад
              </button>
            )}
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev + 1)}
                className={styles.nextButton}
              >
                Далее
              </button>
            ) : (
              <button type="submit" className={styles.submitButton}>
                Опубликовать
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
