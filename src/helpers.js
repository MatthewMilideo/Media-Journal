const monthObj = {
    0: 'January',
    1: 'Febuary',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December'
}

const dayObj = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
    7: 'Sunday',
}


export const formatDate = (date) => {
    let d = new Date(date);
    let dayName = dayObj[d.getDay()];
    let day = d.getDate();
    let month = monthObj[d.getMonth()];
    let year = d.getFullYear();

    return  (dayName + ', ' + month + ' ' + day +', ' + year); 
} 

export const formatMoney = (num) => {
    //console.log(('num', num);
    if (num === 0) return null; 

    let returnStr = '$'
    num = num.toString();
    let numLen = num.length -1; 
    let counter = 0; 

    for(let i = numLen; i >= 0; i-- ){
        counter++; 
        if (counter === 3 && i != 0){
            counter = 0; 
            let str1 = num.slice(0, i);
            let str2 = num.slice(i, num.length); 
            num = str1.concat(',', str2);  
        }
    }
    returnStr = returnStr.concat(num);
    return returnStr;
} 