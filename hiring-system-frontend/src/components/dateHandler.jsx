import { parse, isDate, isValid, differenceInYears } from 'date-fns';

const formatDate = (value) => {
    const onlyNumbers = value.replace(/\D/g, '');
    let formatted = '';
    for(let i = 0; i < onlyNumbers.length; i++) {
    if (i === 2 || i === 4) formatted += '/';
        formatted += onlyNumbers[i];
    }
    return formatted;
};

const isValidDate = (date) => {
    const parsedDate = parse(date, 'dd/MM/yyyy', new Date());
    if (!isDate(parsedDate) || !isValid(parsedDate)) return false;

    const age = differenceInYears(new Date(), parsedDate);
    if (age < 18) return false;

    const [day, month, year] = date.split('/').map(Number);
    if (month < 1 || month > 12) return false;

    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) return false;

    return true;
};

export { formatDate, isValidDate };