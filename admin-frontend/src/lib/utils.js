import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export function formatPrice(price) {
    return new Intl.NumberFormat('en-PK', {
        style: 'currency',
        currency: 'PKR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price)
}

export function formatDate(date) {
    return new Intl.DateTimeFormat('en-PK', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(date))
}

export function getDiscountPercentage(price, comparePrice) {
    if (!comparePrice || comparePrice <= price) return 0
    return Math.round(((comparePrice - price) / comparePrice) * 100)
}

export function truncateText(text, maxLength = 100) {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
}
