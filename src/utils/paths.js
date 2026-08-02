import path from 'path';

export function getResourcePath(relativePath) {
    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
        return path.join(process.cwd(), 'src', relativePath);
    } else {
        return path.join(process.resourcesPath, 'src', relativePath);
    }
}