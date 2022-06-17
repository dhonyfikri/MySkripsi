const dateToText = (date = new Date(), type = 'slice') => {
  let textDate = '';
  if (type === 'dash') {
    textDate =
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  } else {
    textDate =
      date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
  }
  return textDate;
};

const textToDate = (dateText, type = 'slice') => {
  let newDateText = '';
  if (type === 'dash') {
    newDateText = dateText.split(' ')[0];
  } else {
    const arrStrDate = dateText.split('/');
    for (let i = 0; i < arrStrDate.length; i++) {
      const twoDigitStr =
        arrStrDate[i].length > 1 ? arrStrDate[i] : '0' + arrStrDate[i];
      newDateText = twoDigitStr + newDateText;
      if (i + 1 !== arrStrDate.length) {
        newDateText = '-' + newDateText;
      }
    }
  }

  return new Date(newDateText);
};

export {dateToText, textToDate};
