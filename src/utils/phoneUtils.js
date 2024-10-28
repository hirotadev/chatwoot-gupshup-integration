// src/utils/phoneUtils.js
export const phoneUtils = {
    isE164Format(phoneNumber) {
        const e164Regex = /^\+?[1-9]\d{1,14}$/;
        return e164Regex.test(phoneNumber);
    },
  
    cleanPhoneNumber(phoneNumber) {
        return phoneNumber.replace(/\D/g, '');
    },
  
    formatToBrazilianE164(phone) {
        const cleaned = this.cleanPhoneNumber(phone);
        const formatted = `+55${cleaned}`;
      
        if (!this.isE164Format(formatted)) {
            throw new Error(`Invalid phone number format: ${formatted}`);
        }
      
        return formatted;
    }
};