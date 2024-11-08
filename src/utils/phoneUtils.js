// src/utils/phoneUtils.js
export const phoneUtils = {
    isE164Format(phoneNumber) {
        const e164Regex = /^\+?[1-9]\d{1,14}$/;
        return e164Regex.test(phoneNumber);
    },
  
    cleanPhoneNumber(phoneNumber) {
        return phoneNumber.replace(/\D/g, '');
    },
  
    formatPhoneNumber(number) {
        let cleanedNumber = number.trim();
        if (cleanedNumber.startsWith('+')) {
            return cleanedNumber;
        } 
        if (cleanedNumber.startsWith('55')) {
            if (cleanedNumber.length === 13 || cleanedNumber.length === 14) {
                return '+' + cleanedNumber;
            } else {
                return '+55' + cleanedNumber;
            }
        }
        return '+55' + cleanedNumber;
    }      
};