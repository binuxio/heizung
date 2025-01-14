export const applyLocale = (locale, setCancelText, setConfirmText) => {
    switch (locale) {
        case 'de':
            setCancelText('Schließen')
            setConfirmText('OK')
            break
        default:
            setCancelText('Cancel')
            setConfirmText('Confirm')
            break
    }
}

export const displayTitleByLocale = (locale, selectedDate, format) => {
    if (format !== undefined) return selectedDate.clone().format(format)

    switch (locale) {
        case 'de':
            return selectedDate.clone().format('MMMM YYYY')
        default:
            return selectedDate.clone().format('MMMM YYYY')
    }
}