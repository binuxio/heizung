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
        case 'en':
            return selectedDate.clone().format('MMMM YY')
        default:
            return selectedDate.clone().format('MMMM YYYY')
    }
}