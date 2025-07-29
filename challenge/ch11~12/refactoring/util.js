export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export function typeToStr(type) {
    switch (type) {
        case '1':
            return '단편'
        case '2':
            return '중편'
        case '3':
            return '장편'
    }
}