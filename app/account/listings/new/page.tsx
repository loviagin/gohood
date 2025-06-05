'use client';

import { useState } from 'react';
import { FaHome, FaMapMarkerAlt, FaImages, FaInfoCircle, FaCheck, FaTimes, FaShieldAlt } from 'react-icons/fa';
import styles from './page.module.css';
import AddressAutocomplete from './components/addressAutocomplete/AddressAutocomplete';

type PropertyCategory = 'apartment' | 'house' | 'studio' | 'room' | 'townhouse' | 'apartments';
type ParkingType = 'none' | 'free' | 'paid';
type FurnitureType = 'full' | 'partial' | 'none';
type PetPolicy = 'allowed' | 'not_allowed';
type ChildrenPolicy = 'allowed' | 'not_allowed';

type ValidationErrors = {
  [key: string]: string;
};

type FormData = {
  // Основная информация
  title: string;
  description: string;
  category: PropertyCategory;
  
  // Локация
  address: string;
  city: string;
  metro: string;
  district: string;
  districtDescription: string;
  
  // Фотографии
  mainPhoto: File | null;
  images: File[];
  imageDescriptions: { [key: string]: string };
  floorPlan: File | null;
  
  // Параметры жилья
  price: number;
  priceType: 'per_night' | 'per_month';
  availableDates: { start: Date | null; end: Date | null };
  bedrooms: number;
  bathrooms: number;
  toilets: number;
  area: number;
  floor: number;
  totalFloors: number;
  bedTypes: string[];
  parking: ParkingType;
  balcony: boolean;
  terrace: boolean;
  courtyard: boolean;
  furniture: FurnitureType;
  appliances: {
    refrigerator: boolean;
    washingMachine: boolean;
    dishwasher: boolean;
    airConditioner: boolean;
    microwave: boolean;
  };
  pets: PetPolicy;
  children: ChildrenPolicy;
  wifi: boolean;
  wifiSpeed: string;
  features: string[];
  security: {
    intercom: boolean;
    security: boolean;
    cameras: boolean;
  };
  deposit: number;
  commission: number;
  minRentalPeriod: number;
  
  // Район
  nearbySchools: string[];
  nearbyShops: string[];
  nearbyRestaurants: string[];
  nearbyParks: string[];
  districtSafety: string;
  nearbyBusinessCenters: string[];
  communityFeatures: string[];
  districtRating: number;
};

const propertyCategories = [
  { value: 'apartment', label: 'Квартира' },
  { value: 'house', label: 'Дом' },
  { value: 'studio', label: 'Студия' },
  { value: 'room', label: 'Комната' },
  { value: 'townhouse', label: 'Таунхаус' },
  { value: 'apartments', label: 'Апартаменты' },
];

const steps = [
  { id: 1, title: 'Основная информация', icon: FaHome },
  { id: 2, title: 'Локация и район', icon: FaMapMarkerAlt },
  { id: 3, title: 'Фотографии', icon: FaImages },
  { id: 4, title: 'Параметры жилья', icon: FaInfoCircle },
  { id: 5, title: 'Район', icon: FaShieldAlt },
  { id: 6, title: 'Проверка', icon: FaCheck },
];

export default function NewListingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: 'apartment',
    address: '',
    city: '',
    metro: '',
    district: '',
    districtDescription: '',
    mainPhoto: null,
    images: [],
    imageDescriptions: {},
    floorPlan: null,
    price: 0,
    priceType: 'per_night',
    availableDates: { start: null, end: null },
    bedrooms: 1,
    bathrooms: 1,
    toilets: 1,
    area: 0,
    floor: 1,
    totalFloors: 1,
    bedTypes: [],
    parking: 'none',
    balcony: false,
    terrace: false,
    courtyard: false,
    furniture: 'none',
    appliances: {
      refrigerator: false,
      washingMachine: false,
      dishwasher: false,
      airConditioner: false,
      microwave: false,
    },
    pets: 'not_allowed',
    children: 'allowed',
    wifi: false,
    wifiSpeed: '',
    features: [],
    security: {
      intercom: false,
      security: false,
      cameras: false,
    },
    deposit: 0,
    commission: 0,
    minRentalPeriod: 1,
    nearbySchools: [],
    nearbyShops: [],
    nearbyRestaurants: [],
    nearbyParks: [],
    districtSafety: '',
    nearbyBusinessCenters: [],
    communityFeatures: [],
    districtRating: 0,
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...(prev[parent as keyof FormData] as Record<string, any>),
            [child]: checked
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    }
  };

  const handleImageDescriptionChange = (index: number, description: string) => {
    setFormData(prev => ({
      ...prev,
      imageDescriptions: {
        ...prev.imageDescriptions,
        [index]: description
      }
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imageDescriptions: Object.fromEntries(
        Object.entries(prev.imageDescriptions)
          .filter(([key]) => Number(key) !== index)
          .map(([key, value]) => [Number(key) > index ? Number(key) - 1 : key, value])
      )
    }));
  };

  const handleFloorPlanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        floorPlan: e.target.files![0]
      }));
    }
  };

  const handleMainPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        mainPhoto: e.target.files![0]
      }));
    }
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
    if (!formData.district.trim()) {
      errors.district = 'Район обязателен';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      // Add main photo
      if (formData.mainPhoto) {
        formDataToSend.append('mainPhoto', formData.mainPhoto);
      }

      // Add additional photos
      formData.images.forEach((photo) => {
        formDataToSend.append('photos', photo);
      });

      // Add floor plan if exists
      if (formData.floorPlan) {
        formDataToSend.append('floorPlan', formData.floorPlan);
      }

      // Add all other form data as JSON
      const { mainPhoto, images, floorPlan, ...restData } = formData;
      formDataToSend.append('data', JSON.stringify(restData));

      const response = await fetch('/api/listings', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create listing');
      }

      const listing = await response.json();
      window.location.href = `/listings/${listing._id}`;
    } catch (error) {
      console.error('Error submitting form:', error);
      setValidationErrors(prev => ({
        ...prev,
        submit: error instanceof Error ? error.message : 'Failed to create listing'
      }));
    }
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
                placeholder="Расскажите о преимуществах вашей квартиры, уникальных особенностях, стиле жилья и для кого оно идеально подходит"
                required
                className={styles.textarea}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="category" className={styles.label}>Категория жилья</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className={styles.select}
              >
                {propertyCategories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className={styles.stepContent}>
            <div className={styles.formGroup}>
              <label htmlFor="address" className={styles.label}>Адрес</label>
              <AddressAutocomplete
                value={formData.address}
                onChange={(address, city, district) => {
                  console.log('AddressAutocomplete onChange:', { address, city, district });
                  setFormData(prev => {
                    const newData = {
                      ...prev,
                      address,
                      city: city || prev.city,
                      district: district || prev.district
                    };
                    console.log('New form data:', newData);
                    return newData;
                  });
                }}
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
            <div className={styles.formGroup}>
              <label htmlFor="metro" className={styles.label}>Ближайшее метро/транспорт</label>
              <input
                type="text"
                id="metro"
                name="metro"
                value={formData.metro}
                onChange={handleInputChange}
                placeholder="Введите ближайшую станцию метро или остановку"
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="district" className={styles.label}>Район города</label>
              <input
                type="text"
                id="district"
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                placeholder="Введите район"
                required
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="districtDescription" className={styles.label}>Описание района</label>
              <textarea
                id="districtDescription"
                name="districtDescription"
                value={formData.districtDescription}
                onChange={handleInputChange}
                placeholder="Опишите особенности района: инфраструктура, уровень шума, безопасность, наличие парков, магазинов, школ, транспортной доступности"
                className={styles.textarea}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className={styles.stepContent}>
            <div className={styles.formGroup}>
              <label htmlFor="mainPhoto" className={styles.label}>Главное фото</label>
              <div className={`${styles.fileInput} ${styles.mainPhotoInput}`}>
                <label htmlFor="mainPhoto" className={styles.fileInputLabel}>
                  <FaImages />
                  <span>Загрузить главное фото</span>
                </label>
                <input
                  type="file"
                  id="mainPhoto"
                  name="mainPhoto"
                  onChange={handleMainPhotoChange}
                  accept="image/*"
                  required
                />
                {formData.mainPhoto && (
                  <div className={styles.fileItem}>
                    <span>{formData.mainPhoto.name}</span>
                    <FaTimes onClick={() => setFormData(prev => ({ ...prev, mainPhoto: null }))} />
                  </div>
                )}
              </div>
              <p className={styles.helperText}>
                Выберите самое привлекательное фото, которое будет отображаться в списке объявлений
              </p>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="images" className={styles.label}>Дополнительные фотографии</label>
              <div className={styles.fileInput}>
                <label htmlFor="images" className={styles.fileInputLabel}>
                  <FaImages />
                  <span>Выберите фотографии (до 20)</span>
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
                        <input
                          type="text"
                          value={formData.imageDescriptions[index] || ''}
                          onChange={(e) => handleImageDescriptionChange(index, e.target.value)}
                          placeholder="Описание фото"
                          className={styles.fileDescription}
                        />
                        <span>{file.name}</span>
                        <FaTimes onClick={() => handleRemoveImage(index)} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className={styles.helperText}>
                Загрузите до 20 фотографий вашего жилья
              </p>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="floorPlan" className={styles.label}>План квартиры/дома</label>
              <div className={styles.fileInput}>
                <label htmlFor="floorPlan" className={styles.fileInputLabel}>
                  <FaImages />
                  <span>Загрузить планировку</span>
                </label>
                <input
                  type="file"
                  id="floorPlan"
                  name="floorPlan"
                  onChange={handleFloorPlanChange}
                  accept="image/*"
                />
                {formData.floorPlan && (
                  <div className={styles.fileItem}>
                    <span>{formData.floorPlan.name}</span>
                    <FaTimes onClick={() => setFormData(prev => ({ ...prev, floorPlan: null }))} />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className={styles.stepContent}>
            <div className={styles.formGroup}>
              <label htmlFor="price" className={styles.label}>Цена</label>
              <div className={styles.priceInput}>
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
                <select
                  name="priceType"
                  value={formData.priceType}
                  onChange={handleInputChange}
                  className={styles.select}
                >
                  <option value="per_night">за ночь</option>
                  <option value="per_month">за месяц</option>
                </select>
              </div>
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
                <label htmlFor="toilets" className={styles.label}>Туалеты</label>
                <input
                  type="number"
                  id="toilets"
                  name="toilets"
                  value={formData.toilets}
                  onChange={handleInputChange}
                  min="1"
                  required
                  className={styles.input}
                />
              </div>
            </div>
            <div className={styles.formRow}>
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
              <div className={styles.formGroup}>
                <label htmlFor="floor" className={styles.label}>Этаж</label>
                <input
                  type="number"
                  id="floor"
                  name="floor"
                  value={formData.floor}
                  onChange={handleInputChange}
                  min="1"
                  required
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="totalFloors" className={styles.label}>Этажность</label>
                <input
                  type="number"
                  id="totalFloors"
                  name="totalFloors"
                  value={formData.totalFloors}
                  onChange={handleInputChange}
                  min="1"
                  required
                  className={styles.input}
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Парковка</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="parking"
                    value="none"
                    checked={formData.parking === 'none'}
                    onChange={handleInputChange}
                  />
                  Нет
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="parking"
                    value="free"
                    checked={formData.parking === 'free'}
                    onChange={handleInputChange}
                  />
                  Бесплатная
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="parking"
                    value="paid"
                    checked={formData.parking === 'paid'}
                    onChange={handleInputChange}
                  />
                  Платная
                </label>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Дополнительно</label>
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="balcony"
                    checked={formData.balcony}
                    onChange={handleInputChange}
                  />
                  Балкон
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="terrace"
                    checked={formData.terrace}
                    onChange={handleInputChange}
                  />
                  Терраса
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="courtyard"
                    checked={formData.courtyard}
                    onChange={handleInputChange}
                  />
                  Двор
                </label>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Мебель</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="furniture"
                    value="full"
                    checked={formData.furniture === 'full'}
                    onChange={handleInputChange}
                  />
                  Полностью
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="furniture"
                    value="partial"
                    checked={formData.furniture === 'partial'}
                    onChange={handleInputChange}
                  />
                  Частично
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="furniture"
                    value="none"
                    checked={formData.furniture === 'none'}
                    onChange={handleInputChange}
                  />
                  Нет
                </label>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Техника</label>
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="appliances.refrigerator"
                    checked={formData.appliances.refrigerator}
                    onChange={handleInputChange}
                  />
                  Холодильник
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="appliances.washingMachine"
                    checked={formData.appliances.washingMachine}
                    onChange={handleInputChange}
                  />
                  Стиральная машина
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="appliances.dishwasher"
                    checked={formData.appliances.dishwasher}
                    onChange={handleInputChange}
                  />
                  Посудомоечная машина
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="appliances.airConditioner"
                    checked={formData.appliances.airConditioner}
                    onChange={handleInputChange}
                  />
                  Кондиционер
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="appliances.microwave"
                    checked={formData.appliances.microwave}
                    onChange={handleInputChange}
                  />
                  Микроволновка
                </label>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Правила</label>
              <div className={styles.checkboxGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="pets"
                    value="allowed"
                    checked={formData.pets === 'allowed'}
                    onChange={handleInputChange}
                  />
                  Можно с животными
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="pets"
                    value="not_allowed"
                    checked={formData.pets === 'not_allowed'}
                    onChange={handleInputChange}
                  />
                  Нельзя с животными
                </label>
              </div>
              <div className={styles.checkboxGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="children"
                    value="allowed"
                    checked={formData.children === 'allowed'}
                    onChange={handleInputChange}
                  />
                  Можно с детьми
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="children"
                    value="not_allowed"
                    checked={formData.children === 'not_allowed'}
                    onChange={handleInputChange}
                  />
                  Нельзя с детьми
                </label>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Wi-Fi</label>
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="wifi"
                    checked={formData.wifi}
                    onChange={handleInputChange}
                  />
                  Есть Wi-Fi
                </label>
                {formData.wifi && (
                  <input
                    type="text"
                    name="wifiSpeed"
                    value={formData.wifiSpeed}
                    onChange={handleInputChange}
                    placeholder="Скорость интернета"
                    className={styles.input}
                  />
                )}
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Безопасность</label>
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="security.intercom"
                    checked={formData.security.intercom}
                    onChange={handleInputChange}
                  />
                  Домофон
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="security.security"
                    checked={formData.security.security}
                    onChange={handleInputChange}
                  />
                  Охрана
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="security.cameras"
                    checked={formData.security.cameras}
                    onChange={handleInputChange}
                  />
                  Видеонаблюдение
                </label>
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="deposit" className={styles.label}>Залог (₽)</label>
                <input
                  type="number"
                  id="deposit"
                  name="deposit"
                  value={formData.deposit}
                  onChange={handleInputChange}
                  min="0"
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="commission" className={styles.label}>Комиссия (₽)</label>
                <input
                  type="number"
                  id="commission"
                  name="commission"
                  value={formData.commission}
                  onChange={handleInputChange}
                  min="0"
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="minRentalPeriod" className={styles.label}>Мин. срок (дней)</label>
                <input
                  type="number"
                  id="minRentalPeriod"
                  name="minRentalPeriod"
                  value={formData.minRentalPeriod}
                  onChange={handleInputChange}
                  min="1"
                  className={styles.input}
                />
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className={styles.stepContent}>
            <div className={styles.formGroup}>
              <label htmlFor="nearbySchools" className={styles.label}>Школы и детские сады рядом</label>
              <textarea
                id="nearbySchools"
                name="nearbySchools"
                value={formData.nearbySchools.join('\n')}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  nearbySchools: e.target.value.split('\n').filter(Boolean)
                }))}
                placeholder="Перечислите ближайшие школы и детские сады"
                className={styles.textarea}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="nearbyShops" className={styles.label}>Магазины и торговые центры</label>
              <textarea
                id="nearbyShops"
                name="nearbyShops"
                value={formData.nearbyShops.join('\n')}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  nearbyShops: e.target.value.split('\n').filter(Boolean)
                }))}
                placeholder="Перечислите ближайшие магазины и торговые центры"
                className={styles.textarea}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="nearbyRestaurants" className={styles.label}>Кафе, рестораны, бары</label>
              <textarea
                id="nearbyRestaurants"
                name="nearbyRestaurants"
                value={formData.nearbyRestaurants.join('\n')}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  nearbyRestaurants: e.target.value.split('\n').filter(Boolean)
                }))}
                placeholder="Перечислите ближайшие кафе, рестораны и бары"
                className={styles.textarea}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="nearbyParks" className={styles.label}>Парки и зоны отдыха</label>
              <textarea
                id="nearbyParks"
                name="nearbyParks"
                value={formData.nearbyParks.join('\n')}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  nearbyParks: e.target.value.split('\n').filter(Boolean)
                }))}
                placeholder="Перечислите ближайшие парки и зоны отдыха"
                className={styles.textarea}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="districtSafety" className={styles.label}>Безопасность района</label>
              <textarea
                id="districtSafety"
                name="districtSafety"
                value={formData.districtSafety}
                onChange={handleInputChange}
                placeholder="Опишите уровень безопасности района, наличие видеонаблюдения, патрулей и т.д."
                className={styles.textarea}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="nearbyBusinessCenters" className={styles.label}>Близость к бизнес-центрам</label>
              <textarea
                id="nearbyBusinessCenters"
                name="nearbyBusinessCenters"
                value={formData.nearbyBusinessCenters.join('\n')}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  nearbyBusinessCenters: e.target.value.split('\n').filter(Boolean)
                }))}
                placeholder="Перечислите ближайшие бизнес-центры, кампусы, университеты"
                className={styles.textarea}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="communityFeatures" className={styles.label}>Особенности сообщества</label>
              <textarea
                id="communityFeatures"
                name="communityFeatures"
                value={formData.communityFeatures.join('\n')}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  communityFeatures: e.target.value.split('\n').filter(Boolean)
                }))}
                placeholder="Опишите особенности сообщества (например: 'тихий район для семей', 'много молодежи и баров', 'престижный и закрытый квартал')"
                className={styles.textarea}
              />
            </div>
          </div>
        );
      case 6:
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
                <div className={`${styles.reviewItem} ${validationErrors.category ? styles.error : ''}`}>
                  <span className={styles.reviewLabel}>Категория:</span>
                  <span className={styles.reviewValue}>
                    {propertyCategories.find(c => c.value === formData.category)?.label || 'Не указано'}
                  </span>
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
                  <span className={styles.reviewLabel}>Цена:</span>
                  <span className={styles.reviewValue}>
                    {formData.price ? `${formData.price} ₽ ${formData.priceType === 'per_night' ? 'за ночь' : 'за месяц'}` : 'Не указано'}
                  </span>
                </div>
                <div className={`${styles.reviewItem} ${validationErrors.area ? styles.error : ''}`}>
                  <span className={styles.reviewLabel}>Площадь:</span>
                  <span className={styles.reviewValue}>{formData.area ? `${formData.area} м²` : 'Не указано'}</span>
                </div>
                <div className={`${styles.reviewItem} ${validationErrors.mainPhoto ? styles.error : ''}`}>
                  <span className={styles.reviewLabel}>Главное фото:</span>
                  <span className={styles.reviewValue}>{formData.mainPhoto ? formData.mainPhoto.name : 'Не загружено'}</span>
                </div>
                <div className={`${styles.reviewItem} ${validationErrors.images ? styles.error : ''}`}>
                  <span className={styles.reviewLabel}>Дополнительные фото:</span>
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
