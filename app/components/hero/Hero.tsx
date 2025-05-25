"use client"
import { Wifi, MapPin, Train, Coffee, ShoppingBag, Sparkles, Map, Search } from "lucide-react";
import { useState, FormEvent } from "react";
import styles from "./Hero.module.css";

type SearchTab = "housing" | "districts";

export default function Hero() {
  const [activeTab, setActiveTab] = useState<SearchTab>("housing");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setError("Пожалуйста, введите город или район");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implement actual search logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      console.log(`Searching for ${searchQuery} in ${activeTab} mode`);
    } catch (err) {
      setError("Произошла ошибка при поиске. Пожалуйста, попробуйте снова.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab: SearchTab) => {
    setActiveTab(tab);
    setSearchQuery("");
    setError(null);
  };

  return (
    <section className={styles.hero} aria-label="Поиск жилья">
      <div className={styles.heroContent}>
        <h1 className={styles.title}>
          Умный поиск жилья с ИИ
          <br />
          <span className={styles.titleHighlight}>в идеальном районе</span>
        </h1>
        
        <div className={styles.heroFeatures} role="list" aria-label="Преимущества сервиса">
          <div className={styles.heroFeature} role="listitem">
            <Sparkles className={styles.heroFeatureIcon} aria-hidden="true" />
            <span>ИИ подбирает варианты под ваши предпочтения</span>
          </div>
          <div className={styles.heroFeature} role="listitem">
            <Map className={styles.heroFeatureIcon} aria-hidden="true" />
            <span>Детальная карта районов с оценкой инфраструктуры</span>
          </div>
          <div className={styles.heroFeature} role="listitem">
            <Wifi className={styles.heroFeatureIcon} aria-hidden="true" />
            <span>Реальные спидтесты Wi-Fi и проверка качества жизни</span>
          </div>
        </div>
        
        <div className={styles.searchContainer}>
          <div className={styles.searchTabs} role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === "housing"}
              aria-controls="search-form"
              className={`${styles.searchTab} ${activeTab === "housing" ? styles.searchTabActive : ""}`}
              onClick={() => handleTabChange("housing")}
            >
              Поиск жилья
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "districts"}
              aria-controls="search-form"
              className={`${styles.searchTab} ${activeTab === "districts" ? styles.searchTabActive : ""}`}
              onClick={() => handleTabChange("districts")}
            >
              Исследовать районы
            </button>
          </div>

          <form 
            className={styles.searchForm} 
            onSubmit={handleSearch}
            id="search-form"
            role="search"
            aria-label={`Поиск ${activeTab === "housing" ? "жилья" : "районов"}`}
          >
            <div className={styles.searchInputWrapper}>
              <MapPin className={styles.searchInputIcon} aria-hidden="true" />
              <input
                type="text"
                placeholder={`Введите ${activeTab === "housing" ? "город или район" : "название района"}`}
                className={`${styles.searchInput} ${error ? styles.searchInputError : ""}`}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setError(null);
                }}
                aria-invalid={!!error}
                aria-describedby={error ? "search-error" : undefined}
                disabled={isLoading}
              />
              {error && (
                <div id="search-error" className={styles.searchError} role="alert">
                  {error}
                </div>
              )}
            </div>
            <button 
              type="submit" 
              className={`${styles.searchButton} ${isLoading ? styles.searchButtonLoading : ""}`}
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <span className={styles.searchButtonContent}>
                  <span className={styles.searchButtonSpinner} aria-hidden="true" />
                  Поиск...
                </span>
              ) : (
                <span className={styles.searchButtonContent}>
                  <Search className={styles.searchButtonIcon} aria-hidden="true" />
                  Найти идеальное место
                </span>
              )}
            </button>
          </form>

          <div className={styles.searchTags} role="list" aria-label="Популярные фильтры">
            <button 
              className={styles.searchTag}
              onClick={() => setSearchQuery(prev => prev + " транспорт")}
              type="button"
              role="listitem"
            >
              <Train className={styles.searchTagIcon} aria-hidden="true" />
              Транспорт
            </button>
            <button 
              className={styles.searchTag}
              onClick={() => setSearchQuery(prev => prev + " интернет")}
              type="button"
              role="listitem"
            >
              <Wifi className={styles.searchTagIcon} aria-hidden="true" />
              Интернет
            </button>
            <button 
              className={styles.searchTag}
              onClick={() => setSearchQuery(prev => prev + " кафе")}
              type="button"
              role="listitem"
            >
              <Coffee className={styles.searchTagIcon} aria-hidden="true" />
              Кафе
            </button>
            <button 
              className={styles.searchTag}
              onClick={() => setSearchQuery(prev => prev + " магазины")}
              type="button"
              role="listitem"
            >
              <ShoppingBag className={styles.searchTagIcon} aria-hidden="true" />
              Магазины
            </button>
          </div>
        </div>
      </div>
    </section>
  );
} 