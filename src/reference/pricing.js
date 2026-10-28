import rates from './rates.json' with {type:'json'};
import bookProduct from './book-product.json' with {type:'json'};

export {rates,bookProduct};
export const participantOptions=Array.from({length:rates.maxParticipants},(_,index)=>index+1);
export const money=cents=>cents===null?'По согласованию':new Intl.NumberFormat('ru-RU',{style:'currency',currency:rates.currency,minimumFractionDigits:0,maximumFractionDigits:0}).format(cents/100);

// Group totals come from the supplied ruble tables, stored as integer kopeks.
// The participant count remains actual; the minimum fee affects billing only.
export function quoteCourse(course){
  const days=Number(course.days),participants=Number(course.participants);
  if(!rates.days.includes(days)||!Number.isInteger(participants)||participants<1||participants>rates.maxParticipants)throw new RangeError('Выберите длительность из прайса и от 1 до 20 участников.');
  const tariff=course.format==='onsite'?rates.onsite:rates;
  const billedParticipants=Math.max(participants,tariff.minimumBillableParticipants[String(days)]||1);
  const value=tariff.totalsCents[String(days)]?.[String(billedParticipants)];
  const totalCents=Number.isInteger(value)?value:null;
  return {...course,days,participants,billedParticipants,hours:days*rates.hoursPerDay,totalCents};
}

export function summarize(courses,bookQuantity=0){
  if(!Number.isInteger(bookQuantity)||bookQuantity<0||bookQuantity>bookProduct.maxQuantity)throw new RangeError('Количество комплектов книг должно быть от 0 до 20.');
  const selected=courses.filter(course=>course.selected).map(quoteCourse);
  const knownTrainingTotalCents=selected.reduce((sum,course)=>sum+(course.totalCents??0),0);
  const unpricedCount=selected.filter(course=>course.totalCents===null).length;
  const trainingTotalCents=unpricedCount?null:knownTrainingTotalCents;
  const bookTotalCents=bookQuantity*bookProduct.unitPriceCents;
  return {courses:selected,courseCount:selected.length,days:selected.reduce((sum,course)=>sum+course.days,0),hours:selected.reduce((sum,course)=>sum+course.hours,0),trainingTotalCents,knownSubtotalCents:knownTrainingTotalCents+bookTotalCents,unpricedCount,bookQuantity,bookTotalCents,totalCents:unpricedCount?null:knownTrainingTotalCents+bookTotalCents};
}

function parseDate(value){
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return null;
  const [year,month,day]=value.split('-').map(Number);
  if(year<1)return null;
  const date=new Date(0);date.setUTCFullYear(year,month-1,day);
  return date.getUTCFullYear()===year&&date.getUTCMonth()===month-1&&date.getUTCDate()===day?date:null;
}
export function endDate(start,days){
  const date=parseDate(start);
  if(!date||!Number.isInteger(days)||days<1)return '';
  // The first date counts as day one. Weekends are included, as in the source.
  date.setUTCDate(date.getUTCDate()+days-1);
  return !Number.isFinite(date.getTime())||date.getUTCFullYear()>9999?'':date.toISOString().slice(0,10);
}
export function formatDate(value){
  const date=parseDate(value);
  return date?new Intl.DateTimeFormat('ru-RU',{day:'2-digit',month:'2-digit',year:'numeric',timeZone:'UTC'}).format(date):'';
}
