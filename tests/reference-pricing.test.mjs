import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {rates,bookProduct,quoteCourse,summarize,endDate,formatDate,money} from '../src/reference/pricing.js';

const require=createRequire(import.meta.url);
const sourcePricing=require('./fixtures/source-8774/course-pricing.cjs');
const sourceSchedule=require('./fixtures/source-8774/course-schedule.cjs');
const fixture=name=>JSON.parse(fs.readFileSync(new URL('./fixtures/'+name,import.meta.url),'utf8'));
const screenshots=fixture('rub-price-screenshots.json');

test('the 52 published rows unaffected by the later small-group correction retain their exact prices',()=>{
  let checked=0;
  for(const [name,days,format] of [['online2',2,'online'],['online5',5,'online'],['onsite5',5,'onsite']]){
    const data=screenshots[name];
    data.totalsRubles.forEach((rubles,index)=>{
      const participants=data.firstParticipant+index;
      // The user's latest instruction replaces the old online 3/4-person rows.
      if(name==='online5'&&participants<5)return;
      const quote=quoteCourse({days,participants,format});
      assert.equal(quote.totalCents,rubles*100,name+'/'+participants);
      assert.equal(Math.round(quote.totalCents/100/participants),data.perPersonRubles[index],name+' per person/'+participants);
      checked++;
    });
  }
  assert.equal(checked,52);
  assert.equal(rates.currency,'RUB');
  assert.equal(bookProduct.currency,'RUB');
  assert.equal(bookProduct.unitPriceCents,800000);
  assert.equal(bookProduct.maxQuantity,20);
});

test('the original billing algorithm accepts the latest five-person base across 720 combinations',()=>{
  assert.deepEqual(rates.minimumBillableParticipants,{2:1,5:5,10:5});
  assert.deepEqual(rates.onsite.minimumBillableParticipants,{2:1,5:5,10:5});
  for(const id of [1,2,3,4])for(const format of ['online','office','onsite'])for(const days of [2,5,10])for(let participants=1;participants<=20;participants++){
    const course={id,selected:true,format,days,participants};
    const sourceTariff=format==='onsite'?{...rates,...rates.onsite}:rates;
    const expected=sourcePricing.quote(course,sourceTariff),actual=quoteCourse(course);
    assert.equal(actual.totalCents,expected.totalCents,id+'/'+format+'/'+days+'/'+participants);
    assert.equal(actual.billedParticipants,expected.billedParticipants);
    assert.equal(actual.participants,participants);
    assert.equal(actual.hours,expected.hours);
  }
});

test('one through five people pay the same agreed group fee; six people use the next published rate',()=>{
  const cases=[
    {formats:['online','office'],days:5,groupRubles:220000,sixRubles:240000},
    {formats:['online','office'],days:10,groupRubles:440000,sixRubles:480000},
    {formats:['onsite'],days:5,groupRubles:280000,sixRubles:290000},
    {formats:['onsite'],days:10,groupRubles:560000,sixRubles:580000},
  ];
  for(const entry of cases)for(const format of entry.formats){
    for(let participants=1;participants<=5;participants++){
      const quote=quoteCourse({format,days:entry.days,participants});
      assert.equal(quote.totalCents,entry.groupRubles*100,format+'/'+entry.days+'/'+participants);
      assert.equal(quote.billedParticipants,5);
      assert.equal(quote.participants,participants);
      assert.equal(Math.round(quote.totalCents/100/participants),Math.round(entry.groupRubles/participants));
    }
    assert.equal(quoteCourse({format,days:entry.days,participants:6}).totalCents,entry.sixRubles*100);
  }
});

test('two-day prices, the price jump at ten people and the confirmed ten-day rule are retained',()=>{
  assert.equal(quoteCourse({days:2,participants:1}).totalCents,4000000);
  assert.equal(quoteCourse({days:2,participants:20}).totalCents,24000000);
  assert.equal(quoteCourse({days:2,participants:5}).totalCents,9000000);
  assert.equal(quoteCourse({days:5,participants:9}).totalCents,30000000);
  assert.equal(quoteCourse({days:5,participants:10}).totalCents,40000000);
  assert.equal(quoteCourse({format:'onsite',days:5,participants:10}).totalCents,37000000);
  for(const format of ['online','office','onsite'])for(let participants=1;participants<=20;participants++)assert.equal(quoteCourse({format,days:10,participants}).totalCents,2*quoteCourse({format,days:5,participants}).totalCents);
});

test('mixed course durations and book quantities add without a discount',()=>{
  const courses=[{id:1,selected:true,days:2,participants:1},{id:2,selected:true,days:5,participants:2},{id:3,selected:true,days:10,participants:4},{id:4,selected:false,days:2,participants:20}];
  const expected=sourcePricing.summarize(courses,rates),actual=summarize(courses,2);
  assert.equal(actual.trainingTotalCents,expected.totalCents);
  assert.equal(actual.trainingTotalCents,70000000);
  assert.equal(actual.bookTotalCents,1600000);
  assert.equal(actual.totalCents,71600000);
  assert.equal(actual.days,17);
  assert.equal(actual.hours,136);
  assert.equal(actual.courseCount,3);
  courses[3].selected=true;
  assert.equal(summarize(courses,2).totalCents,95600000);
});

test('only two-day onsite tariffs remain unknown and the known subtotal stays separate',()=>{
  for(let participants=1;participants<=20;participants++)assert.equal(quoteCourse({format:'onsite',days:2,participants}).totalCents,null);
  const result=summarize([{selected:true,days:2,participants:1},{selected:true,format:'onsite',days:2,participants:10}],1);
  assert.equal(result.totalCents,null);
  assert.equal(result.unpricedCount,1);
  assert.equal(result.knownSubtotalCents,4800000);
  assert.equal(money(result.totalCents),'По согласованию');
});

test('RUB 8000 book sets can be ordered alone; empty and invalid quantities are handled',()=>{
  assert.equal(summarize([],1).totalCents,800000);
  assert.equal(summarize([],20).totalCents,16000000);
  assert.equal(summarize([],0).totalCents,0);
  assert.equal(summarize([],1).days,0);
  for(const quantity of [-1,0.5,21])assert.throws(()=>summarize([],quantity),RangeError);
});

test('inclusive calendar dates match the source across weekends, leap years and year boundaries',()=>{
  const dates=['2026-11-07','2028-02-28','2026-03-28','2026-12-29','0001-01-01','9999-12-31','2026-02-29','0000-01-01',''];
  for(const start of dates)for(const days of [2,5,10])assert.equal(endDate(start,days),sourceSchedule.endDate(start,days),start+'/'+days);
  assert.equal(endDate('2026-11-07',2),'2026-11-08');
  assert.equal(endDate('2026-11-07',5),'2026-11-11');
  assert.equal(endDate('2026-11-07',10),'2026-11-16');
  assert.equal(endDate('2028-02-28',2),'2028-02-29');
  assert.equal(endDate('9999-12-31',2),'');
  assert.equal(formatDate('2028-02-29'),'29.02.2028');
});

test('unsupported sizes cannot acquire a price and display rounding follows the screenshots',()=>{
  for(const participants of [0,21,1.5,NaN])assert.throws(()=>quoteCourse({days:5,participants}),RangeError);
  assert.throws(()=>quoteCourse({days:3,participants:1}),RangeError);
  assert.equal(money(4000000).replace(/\s/g,' '),'40 000 ₽');
  assert.equal(money(22000000/3).replace(/\s/g,' '),'73 333 ₽');
});
