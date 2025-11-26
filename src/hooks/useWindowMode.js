import { useEffect, useState } from "react"

export const useWindowMode = () => {
    const [isAdminMode, setIsAdminMode] = useState(false)

    useEffect(() => {
        const checkMode = () => {
            const isAdmin = window.location.hash.includes('/admin')
            setIsAdminMode(isAdmin)
        }

        checkMode()

        const handlHashChange = () => {
            checkMode()
        }

        window.addEventListener('hashchange', handlHashChange)

        return () => {
            window.removeEventListener('hashchange', handlHashChange)
        }
    }, [])

    return isAdminMode
}