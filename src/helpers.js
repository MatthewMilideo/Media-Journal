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
/*
    num = num.toString();

    let numLength = (num.length-1);
    console.log('num', num, 'numLength', numLength);

    let j = -1; 
    for( let i = numLength; i >= 0; i--){
        if( j === 2){
            console.log('j', j);
            let num1 = 
        }
        console.log('i', i, 'num', num[i]);
        j++; 
    } d
*/
    return num;
} 