import { useEffect, useMemo, useReducer, useState } from "react";
import type {
  Audience,
  Budget,
  BookType,
  InterfaceLocale,
  Language,
  MushafProduct,
  Riwayah,
  Size,
} from "./domain/catalogue/types";
import { recommendationWeights } from "./domain/catalogue/sample-products";
import { localCatalogue } from "./domain/catalogue/source";
import { recommendProducts } from "./domain/recommendations/recommend";
import { messages } from "./i18n";
import { getDirection } from "./i18n";
import {
  audienceOptions,
  bookTypeOptions,
  budgetOptions,
  languageOptions,
  riwayahOptions,
  sizeOptions,
} from "./features/questionnaire/options";
import {
  finderReducer,
  isStepComplete,
  loadFinderState,
  saveFinderState,
} from "./features/questionnaire/state";

const languageNames: Record<Language, string> = {
  ar: "العربية",
  en: "English",
  fr: "Français",
  de: "Deutsch",
  es: "Español",
  ru: "Русский",
};

const whatsappUrl = "https://wa.me/15144464465";

interface OptionCardProps {
  icon: string;
  label: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}

function OptionCard({
  icon,
  label,
  description,
  selected,
  onSelect,
}: OptionCardProps) {
  return (
    <button
      type="button"
      className={`option-card${selected ? " is-selected" : ""}`}
      aria-pressed={selected}
      onClick={onSelect}
    >
      <span className="option-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="option-copy">
        <span className="option-label">{label}</span>
        <span className="option-description">{description}</span>
      </span>
      <span className="option-check" aria-hidden="true">
        {selected ? "✓" : ""}
      </span>
    </button>
  );
}

function ProductCover({
  product,
  placeholder,
}: {
  product: MushafProduct;
  placeholder: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  if (product.image && !imageFailed) {
    return (
      <div className="product-cover">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      </div>
    );
  }

  return (
    <div className="product-cover cover-placeholder" aria-label={placeholder}>
      <span className="cover-ornament" aria-hidden="true">
        ✧
      </span>
      <span className="cover-title">{placeholder}</span>
      <span className="cover-mark" aria-hidden="true">
        ◈
      </span>
    </div>
  );
}

function formatPrice(
  price: number,
  currency: MushafProduct["currency"],
  locale: InterfaceLocale,
) {
  const localeTag = locale === "ar" ? "ar-CA" : `${locale}-CA`;
  return new Intl.NumberFormat(localeTag, {
    style: "currency",
    currency,
  }).format(price);
}

export default function App() {
  const [state, dispatch] = useReducer(finderReducer, undefined, loadFinderState);
  const [locale, setLocale] = useState<InterfaceLocale>("en");
  const [storageWarning, setStorageWarning] = useState(false);
  const t = messages[locale];
  const results = useMemo(
    () => recommendProducts(localCatalogue.getProducts(), state.answers, recommendationWeights),
    [state.answers],
  );

  useEffect(() => {
    try {
      saveFinderState(state);
      setStorageWarning(false);
    } catch (error) {
      console.error("Could not save Mushaf Finder progress.", error);
      setStorageWarning(true);
    }
  }, [state]);

  const selectAudience = (value: Audience) =>
    dispatch({ type: "answer", value: { audience: value } });
  const selectLanguage = (value: Language) =>
    dispatch({ type: "answer", value: { language: value } });
  const selectRiwayah = (value: Riwayah) =>
    dispatch({ type: "answer", value: { riwayah: value } });
  const selectSize = (value: Size) =>
    dispatch({ type: "answer", value: { size: value } });
  const selectBookType = (value: BookType) =>
    dispatch({ type: "answer", value: { bookType: value } });
  const selectBudget = (value: Budget) =>
    dispatch({ type: "answer", value: { budget: value } });

  function restart() {
    dispatch({ type: "restart" });
  }

  function renderQuestion() {
    if (state.step === 0) {
      return (
        <div className="option-grid" role="group" aria-label={t.readerGroup}>
          {audienceOptions.map(({ value, icon }) => (
            <OptionCard
              key={value}
              icon={icon}
              label={t.audiences[value].label}
              description={t.audiences[value].description}
              selected={state.answers.audience === value}
              onSelect={() => selectAudience(value)}
            />
          ))}
        </div>
      );
    }
    if (state.step === 1) {
      return (
        <div className="option-grid" role="group" aria-label={t.languageGroup}>
          {languageOptions.map(({ value, icon }) => (
            <OptionCard
              key={value}
              icon={icon}
              label={t.languages[value].label}
              description={t.languages[value].description}
              selected={state.answers.language === value}
              onSelect={() => selectLanguage(value)}
            />
          ))}
        </div>
      );
    }
    if (state.step === 2) {
      return (
        <>
          <p className="helper-callout">{t.narrationHelp}</p>
          <div className="option-grid" role="group" aria-label={t.narrationGroup}>
            {riwayahOptions.map(({ value, icon }) => (
              <OptionCard
                key={value}
                icon={icon}
                label={t.riwayahs[value].label}
                description={t.riwayahs[value].description}
                selected={state.answers.riwayah === value}
                onSelect={() => selectRiwayah(value)}
              />
            ))}
          </div>
        </>
      );
    }
    if (state.step === 3) {
      return (
        <div className="option-grid option-grid-compact" role="group" aria-label={t.sizeGroup}>
          {sizeOptions.map(({ value, icon }) => (
            <OptionCard
              key={value}
              icon={icon}
              label={t.sizes[value].label}
              description={t.sizes[value].description}
              selected={state.answers.size === value}
              onSelect={() => selectSize(value)}
            />
          ))}
        </div>
      );
    }
    return (
      <div className="final-groups">
        <div className="choice-group" role="group" aria-label={t.bookTypeGroup}>
          <h3>{t.bookTypeGroup}</h3>
          <div className="option-grid option-grid-compact">
            {bookTypeOptions.map(({ value, icon }) => (
              <OptionCard
                key={value}
                icon={icon}
                label={t.bookTypes[value].label}
                description={t.bookTypes[value].description}
                selected={state.answers.bookType === value}
                onSelect={() => selectBookType(value)}
              />
            ))}
          </div>
        </div>
        <div className="choice-group" role="group" aria-label={t.budgetGroup}>
          <h3>{t.budgetGroup}</h3>
          <div className="option-grid option-grid-compact budget-grid">
            {budgetOptions.map(({ value, icon }) => (
              <OptionCard
                key={value}
                icon={icon}
                label={t.budgets[value].label}
                description={t.budgets[value].description}
                selected={state.answers.budget === value}
                onSelect={() => selectBudget(value)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const questionTitles = [
    t.welcomeQuestion,
    t.languageQuestion,
    t.narrationQuestion,
    t.sizeQuestion,
    t.finalQuestion,
  ];
  const embedded = document.getElementById("root")?.dataset.embedded === "true";

  function renderResults() {
    return (
      <section className="results-panel" aria-labelledby="results-heading">
        <div className="results-heading-row">
          <div>
            <p className="eyebrow">{t.brand}</p>
            <h1 id="results-heading">{t.resultsTitle}</h1>
            <p className="section-description">{t.resultsSubtitle}</p>
          </div>
          <button type="button" className="button button-outline" onClick={restart}>
            <span aria-hidden="true">↺</span> {t.restart}
          </button>
        </div>
        <div className="answer-summary">
          <span>{state.answers.audience && t.audiences[state.answers.audience].label}</span>
          <span>{state.answers.language && t.languages[state.answers.language].label}</span>
          <span>{state.answers.riwayah && t.riwayahs[state.answers.riwayah].label}</span>
          <span>{state.answers.size && t.sizes[state.answers.size].label}</span>
        </div>

        {results.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-mark" aria-hidden="true">
              ◌
            </span>
            <h2>{t.noMatchesTitle}</h2>
            <p>{t.noMatchesBody}</p>
            <div className="empty-actions">
              <button
                type="button"
                className="button button-primary"
                onClick={() => dispatch({ type: "edit-answers" })}
              >
                {t.editAnswers}
              </button>
              <a className="button button-outline" href={whatsappUrl} target="_blank" rel="noreferrer">
                {t.assistance}
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className="product-grid">
              {results.map(({ product, score, reasons }, index) => (
                <article className="product-card" key={product.id}>
                  <div className="product-card-top">
                    <span className={`rank-badge${index === 0 ? " rank-badge-best" : ""}`}>
                      {index === 0 ? t.bestMatch : t.suitableAlternative}
                    </span>
                    <span className="match-score">{score}% {t.score}</span>
                  </div>
                  <ProductCover product={product} placeholder={t.coverPlaceholder} />
                  <div className="product-card-content">
                    <h2>{product.name}</h2>
                    <p className="publisher-line">{t.publisher}: {product.publisher ?? t.notListed}</p>
                    <p className="product-description">{product.description}</p>
                    <dl className="product-facts">
                      <div><dt>{t.narrationFact}</dt><dd>{product.riwayah ? t.riwayahs[product.riwayah].label : "—"}</dd></div>
                      <div><dt>{t.languageFact}</dt><dd>{product.translationLanguages === null ? t.notListed : product.translationLanguages.length ? product.translationLanguages.map((code) => t.languages[code].label).join(", ") : t.languages.ar.label}</dd></div>
                      <div><dt>{t.sizeFact}</dt><dd>{product.dimensions ?? (product.size ? t.sizes[product.size].label : t.notListed)}</dd></div>
                      <div><dt>{t.typeFact}</dt><dd>{product.bookType === "full" ? t.itemFull : product.bookType === "part" ? t.itemPart : t.notListed}</dd></div>
                    </dl>
                    <div className="why-match">
                      <h3>{t.whyMatch}</h3>
                      <ul>
                        {reasons.map((reason) => <li key={reason}>{t.audienceReasons[reason]}</li>)}
                      </ul>
                    </div>
                    <div className="product-card-footer">
                      <strong className="product-price">{formatPrice(product.price, product.currency, locale)}</strong>
                      <span className={`stock-status${product.availability === false ? " is-unavailable" : ""}`}>
                        {product.availability === true ? t.stock : product.availability === false ? t.unavailable : t.stockUnknown}
                      </span>
                    </div>
                    {product.productUrl && (
                      <a className="button button-primary product-link" href={product.productUrl}>
                        {t.buyLink}
                      </a>
                    )}
                    {product.isDemo && <span className="demo-product-label">{t.sampleProduct}</span>}
                  </div>
                </article>
              ))}
            </div>
            <div className="results-actions">
              <button
                type="button"
                className="button button-outline"
                onClick={() => dispatch({ type: "edit-answers" })}
              >
                {t.editAnswers}
              </button>
              <a className="button button-primary" href={whatsappUrl} target="_blank" rel="noreferrer">
                {t.assistance}
              </a>
            </div>
          </>
        )}
      </section>
    );
  }

  return (
    <div className="site-shell" lang={locale} dir={getDirection(locale)}>
      <header className={`site-header${embedded ? " is-embedded" : ""}`}>
        {!embedded && (
          <div className="brand-lockup" aria-label={`${t.homeLabel} — ${t.brand}`}>
            <span className="brand-symbol" aria-hidden="true">◈</span>
            <span>
              <strong>{t.homeLabel}</strong>
              <small>{t.brand}</small>
            </span>
          </div>
        )}
        <label className="language-picker">
          <span className="sr-only">{t.interfaceLanguage}</span>
          <select
            value={locale}
            onChange={(event) => setLocale(event.target.value as InterfaceLocale)}
          >
            {(["en", "fr", "ar"] as const).map((code) => (
              <option key={code} value={code}>{languageNames[code]}</option>
            ))}
          </select>
        </label>
      </header>

      <main className="main-content">
        {!state.started ? (
          <section className="welcome-panel">
            <div className="welcome-copy">
              <p className="eyebrow"><span className="eyebrow-dot" />{t.welcomeEyebrow}</p>
              <h1>{t.welcomeTitle}</h1>
              <p className="welcome-description">{t.welcomeBody}</p>
              <div className="welcome-actions">
                <button
                  type="button"
                  className="button button-primary button-large"
                  onClick={() => dispatch({ type: "start" })}
                >
                  {t.start}<span aria-hidden="true">→</span>
                </button>
                <span className="time-estimate"><span aria-hidden="true">◷</span>{t.minute}</span>
              </div>
            </div>
            <div className="welcome-art" aria-hidden="true">
              <div className="art-glow" />
              <div className="art-arch">
                <div className="art-book">
                  <div className="book-border">
                    <span className="book-emblem">۞</span>
                    <span className="book-lines" />
                    <span className="book-caption">AL-QUR'AN</span>
                  </div>
                </div>
                <span className="art-star art-star-one">✧</span>
                <span className="art-star art-star-two">✦</span>
                <span className="art-leaf art-leaf-one">❋</span>
              </div>
              <p className="art-caption">Find your way to a meaningful read.</p>
            </div>
          </section>
        ) : state.showResults ? (
          renderResults()
        ) : (
          <section className="questionnaire-panel" aria-labelledby="question-heading">
            <div className="questionnaire-topline">
              <div className="progress-copy">
                <span>{t.step} {state.step + 1} <span className="step-divider">/</span> 5</span>
                <span className="progress-percent">{Math.round(((state.step + 1) / 5) * 100)}%</span>
              </div>
              <div className="progress-track" role="progressbar" aria-valuenow={state.step + 1} aria-valuemin={1} aria-valuemax={5} aria-label={`${t.step} ${state.step + 1} of 5`}>
                <span style={{ width: `${((state.step + 1) / 5) * 100}%` }} />
              </div>
              <div className="question-title-row">
                {state.step > 0 && (
                  <button type="button" className="back-button" onClick={() => dispatch({ type: "back" })}>
                    <span aria-hidden="true">←</span> {t.back}
                  </button>
                )}
                <button type="button" className="restart-text-button" onClick={restart}>{t.restart}</button>
              </div>
            </div>
            <div className="question-content">
              <p className="eyebrow question-eyebrow">{t.step} {state.step + 1}</p>
              <h1 id="question-heading">{questionTitles[state.step]}</h1>
              {state.step < 4 && <p className="choose-one">{t.chooseOne}</p>}
              {renderQuestion()}
              <div className="question-actions">
                {state.step > 0 && (
                  <button type="button" className="button button-outline mobile-back" onClick={() => dispatch({ type: "back" })}>
                    {t.back}
                  </button>
                )}
                <button
                  type="button"
                  className="button button-primary continue-button"
                  disabled={!isStepComplete(state.step, state.answers)}
                  onClick={() => dispatch({ type: "continue" })}
                >
                  {state.step === 4 ? t.resultsTitle : t.continue}
                  <span aria-hidden="true">{locale === "ar" ? "←" : "→"}</span>
                </button>
              </div>
            </div>
          </section>
        )}
        {storageWarning && (
          <p role="status" className="storage-warning">
            Your answers are not being saved in this browser. You can still continue.
          </p>
        )}
      </main>

      {!embedded && (
        <footer className="site-footer">
          <span>{t.footerNote}</span>
          <span className="footer-ornament" aria-hidden="true">✧</span>
          <span>© {t.homeLabel}</span>
        </footer>
      )}
      <aside className="sample-notice" role="note">
        <span className="notice-dot" aria-hidden="true" />
        {t.sampleNotice}
      </aside>
    </div>
  );
}
