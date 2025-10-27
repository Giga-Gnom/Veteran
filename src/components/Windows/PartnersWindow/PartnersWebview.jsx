// PartnerWebview.jsx
import React, { useRef } from 'react';
import styles from './PartnersWebview.module.css';

const PartnerWebview = ({ url, onBack }) => {
  const webviewRef = useRef(null);

  return (
    <div className={styles.webviewContainer}>
      <div className={styles.navPanel}>
        <button className={styles.backButton} onClick={onBack}>
          ← Вернуться к приложению
        </button>
      </div>
      <webview
        ref={webviewRef}
        src={url}
        className={styles.webview}
        nodeintegration={false}
        webpreferences="contextIsolation=true"
      />
    </div>
  );
};

export default PartnerWebview;