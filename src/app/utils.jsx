import { useNavigate } from 'react-router-dom';
import { pageIndex } from "./pageIndex";

// Вспомогательные функции (не требуют хуков)
export function getLastUrl() {
    const currentUrl = window.location.pathname;
    const segments = currentUrl.split('/');
    return segments.length > 1 ? '/' + segments.pop() : '/';
}

export function getCurrentUrlIndex() {
    const currentUrl = getLastUrl();
    return pageIndex.findIndex(item => item.route === currentUrl);
}

// Основные экспорты (старый вариант для совместимости)
export function handleNextPage() {
    const currentIndex = getCurrentUrlIndex();
    const nextIndex = currentIndex === pageIndex.length - 1 ? 0 : currentIndex + 1;
    window.location.href = pageIndex[nextIndex].route;
}

export function handeleBeforPage() {
    const currentIndex = getCurrentUrlIndex();
    if (currentIndex > 0) {
        window.location.href = pageIndex[currentIndex - 1].route;
    }
}

export function handelToMainPage() {
    window.location.href = "/";
}

// Новый вариант с useNavigate (по желанию)
export function usePageNavigation() {
    const navigate = useNavigate();

    return {
        handelToMainPage: () => navigate("/"),
        handeleBeforPage: () => {
            const currentIndex = getCurrentUrlIndex();
            if (currentIndex > 0) {
                navigate(pageIndex[currentIndex - 1].route);
            }
        },
        handleNextPage: () => {
            const currentIndex = getCurrentUrlIndex();
            const nextIndex = currentIndex === pageIndex.length - 1 ? 0 : currentIndex + 1;
            navigate(pageIndex[nextIndex].route);
        }
    };
}