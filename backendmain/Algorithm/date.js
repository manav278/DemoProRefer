async function getDate(){
    var date = new Date();
    var return_date = date.getFullYear()*100;
    return_date+=(date.getMonth()+1);
    return_date*=100;
    return_date+=(date.getDate());
    return return_date;
}

export default getDate;