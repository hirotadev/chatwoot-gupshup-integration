// src/utils/phoneUtils.js
export const phoneUtils = {
    isE164Format(phoneNumber) {
        const e164Regex = /^\+?[1-9]\d{1,14}$/;
        return e164Regex.test(phoneNumber);
    },
  
    cleanPhoneNumber(phoneNumber) {
        return phoneNumber.replace(/\D/g, '');
    },
  
    formatToBrazilianE164(number) {
        let cleanedNumber = number.trim();
        if (cleanedNumber.startsWith('+')) {
            return cleanedNumber;
        } 
        if (cleanedNumber.startsWith('55')) {
            if (cleanedNumber.length === 12 || cleanedNumber.length === 13) {
                return '+' + cleanedNumber;
            } else {
                return '+55' + cleanedNumber;
            }
        }
        return '+55' + cleanedNumber;
    },
    
    formatPhoneNumber(phone) {
        // Remove caracteres que não são dígitos
        let cleanedPhone = phone.replace(/\D/g, '');
      
        // Adiciona o DDI +55 se não estiver presente
        if (!cleanedPhone.startsWith('55')) {
          cleanedPhone = '55' + cleanedPhone;
        }
      
        // Adiciona o símbolo + no início
        cleanedPhone = `+${cleanedPhone}`;
      
        // Extrai DDD e número
        const ddd = cleanedPhone.slice(3, 5);
        let number = cleanedPhone.slice(5);
      
        // Define se o número é móvel ou fixo usando o prefixo
        const isMobile = number.length === 8 || (number.length === 9 && number.startsWith('9'));
        const isFixed = number.length === 8 && /^[2-5]\d{3}/.test(number); // 2000-5999
      
        // Para números móveis, adiciona o 9 se ele não estiver presente
        if (isMobile && number.length === 8) {
          number = '9' + number;
        }
      
        // Para números fixos, não adiciona o 9
        if (isFixed && number.startsWith('9')) {
          // Remove o 9 para números fixos, se presente
          number = number.slice(1);
        }
      
        // Retorna o número formatado em E.164
        return `+55${ddd}${number}`;
    }
      
};