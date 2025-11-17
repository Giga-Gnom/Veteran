// src/admin/AdminPanel.jsx
import React, { useState } from 'react';
import './AdminPanel.css';

const AdminPanel = ({ onClose, isAuthenticated, onLogin }) => {
    const [password, setPassword] = useState('');
    const [selectedPage, setSelectedPage] = useState(null);

    const pagesArray = [
        {
            id: 'hello',
            name: "Страница приветствия руководителя",
            element: <HelloWindowAdmin />
        },
        {
            id: 'pages',
            name: "Управление страницами",
            element: <PagesManager />
        },
        {
            id: 'content',
            name: "Редактор контента", 
            element: <ContentManager />
        },
        {
            id: 'images',
            name: "Менеджер изображений",
            element: <ImagesManager />
        },
        {
            id: 'database',
            name: "Управление базой данных",
            element: <DatabaseManager />
        }
    ];

    const handleLogin = (e) => {
        e.preventDefault();
        if (onLogin(password)) {
            setPassword('');
        } else {
            alert('Неверный пароль! Попробуйте: admin');
        }
    };

    const handleClose = () => {
        onClose();
    };

    const handlePageSelect = (pageId) => {
        setSelectedPage(pageId);
    };

    if (!isAuthenticated) {
        return (
            <div className="admin-window">
                <div className="admin-header">
                    <h3>🔐 Админ Панель</h3>
                    <button onClick={handleClose} className="close-btn">✕</button>
                </div>
                <div className="admin-login">
                    <p>Введите пароль для доступа</p>
                    <form onSubmit={handleLogin}>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Пароль"
                            autoFocus
                        />
                        <div className="admin-login-buttons">
                            <button type="submit">Войти</button>
                            <button type="button" onClick={handleClose}>Отмена</button>
                        </div>
                    </form>
                    <p className="hint">Подсказка: пароль "admin"</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-window">
            <div className="admin-header">
                <h3>⚙️ Админ Панель</h3>
                <button onClick={handleClose} className="close-btn">✕</button>
            </div>
            
            <div className="admin-layout">
                {/* Боковая панель с навигацией */}
                <div className="admin-sidebar">
                    <h4>📑 Страницы админки</h4>
                    <div className="pages-list">
                        {pagesArray.map((page) => (
                            <div 
                                key={page.id}
                                className={`page-item ${selectedPage === page.id ? 'active' : ''}`}
                                onClick={() => handlePageSelect(page.id)}
                            >
                                {page.name}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Основной контент */}
                <div className="admin-main-content">
                    {selectedPage ? (
                        pagesArray.find(page => page.id === selectedPage)?.element
                    ) : (
                        <div className="welcome-message">
                            <h4>👋 Добро пожаловать в админ-панель!</h4>
                            <p>Выберите раздел для управления контентом</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const HelloWindowAdmin = () => (
    <div>
        <h4>👋 Страница приветствия руководителя</h4>
        <p>Здесь можно редактировать текст приветствия</p>
        
        <div className="form-group">
            <label>Заголовок приветствия:</label>
            <input type="text" placeholder="Введите заголовок" />
        </div>
        
        <div className="form-group">
            <label>Текст приветствия:</label>
            <textarea 
                rows="6" 
                placeholder="Введите текст приветствия"
                style={{ width: '100%' }}
            />
        </div>
        
        <div className="form-group">
            <label>Имя руководителя:</label>
            <input type="text" placeholder="Введите имя руководителя" />
        </div>
        
        <button className="save-btn">💾 Сохранить изменения</button>
    </div>
);

// Остальные компоненты без изменений
const PagesManager = () => (
    <div>
        <h4>Управление страницами</h4>
        <p>Здесь будет список всех страниц для редактирования</p>
        <ul>
            <li>🏆 AwardsWindow - Награды</li>
            <li>👥 DirectorsWindow - Руководство</li>
            <li>📅 EventsWindow - Мероприятия</li>
            <li>🗺️ MapWindow - Карта</li>
        </ul>
    </div>
);

const ContentManager = () => (
    <div>
        <h4>Редактор контента</h4>
        <p>Выберите страницу для редактирования контента</p>
    </div>
);

const ImagesManager = () => (
    <div>
        <h4>Менеджер изображений</h4>
        <p>Загрузка и управление изображениями</p>
    </div>
);

const DatabaseManager = () => (
    <div>
        <h4>Управление базой данных</h4>
        <p>Здесь будут инструменты для работы с БД</p>
        <button onClick={() => alert('БД будет подключена на следующем шаге')}>
            Проверить подключение БД
        </button>
    </div>
);

export default AdminPanel;