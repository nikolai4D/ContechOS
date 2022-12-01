const iconTemplateFunc = (iconString, moreClass = "", moreConfig = "")  => {
    return `<i class="bi ${iconString} ${moreClass}" ${moreConfig}></i>`
} 

export const eyeFillShow = (moreClass = "", moreConfig = "") => {
    return iconTemplateFunc("bi-eye-fill", moreClass, moreConfig);
} 

export const eyeFillHide = (moreClass = "", moreConfig = "")  => {
    return iconTemplateFunc("bi-eye-slash-fill", moreClass, moreConfig);
} 

export const chevronDown = (moreClass = "", moreConfig = "")  => {
    return iconTemplateFunc("bi-chevron-down", moreClass, moreConfig);
} 

export const chevronUp = (moreClass = "", moreConfig = "")  => {
    return iconTemplateFunc("bi-chevron-up", moreClass, moreConfig);
} 