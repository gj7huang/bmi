var checkResult = document.querySelector('.checkResult');
var recordList = [];
var statusList = [
  {'status': '過輕', 'num': 1},
  {'status': '理想', 'num': 2},
  {'status': '過重', 'num': 3},
  {'status': '輕度肥胖', 'num': 4},
  {'status': '中度肥胖', 'num': 5},
  {'status': '重度肥胖', 'num': 6}
];

function checkItem(){
  if(localStorage.getItem('recordList') === null)
    localStorage.setItem('recordList', '[]');
  recordList = JSON.parse(localStorage.getItem('recordList'));
}
checkItem();
showRecordList();

function getData() {
  let height = document.getElementById('hText').value;
  let weight = document.getElementById('wText').value;
  if((/^([0-9]{1,3})+(.[0-9]{1,10})?$/.test(height)) && (Number(height)>0 && Number(height)<230)
  && (/^([0-9]{1,3})+(.[0-9]{1,10})?$/.test(weight)) && (Number(weight)>0 && Number(weight)<500)) {
    return {
      'height': Number(height),
      'weight': Number(weight)
    };
  }else {
    console.log('錯誤!');
    return;
  }
}
function calculatorData(obj) {
  obj.bmi = (obj.weight/Math.pow(obj.height*0.01,2)).toFixed(2);
  if(obj.bmi < 18.5){
    obj.status = '過輕';
  }else if(obj.bmi < 24 && obj.bmi >= 18.5){
    obj.status = '理想';
  }else if(obj.bmi < 27 && obj.bmi >= 24) {
    obj.status = '過重';
  }else if(obj.bmi < 30 && obj.bmi >= 27) {
    obj.status = '輕度肥胖';
  }else if(obj.bmi < 38 && obj.bmi >= 30) {
    obj.status = '中度肥胖';
  }else {
    obj.status = '重度肥胖';
  }
  return obj;
}
function getTime() {
  let date = new Date();
  // let res = date.toISOString().slice(0,10).split("-").reverse().join("-");
  let arr = date.toISOString().slice(0,10).split("-");
  res = arr[1] + '-' +arr[2] + '-' +arr[0];
  return res;
}
function showRecordList() {
  let content = document.querySelector('.content');
  let str = '<div class="contentTitle">BMI 紀錄</div>';
  let statusNum = 0;
  if(recordList.length === 0){
    str+='<p class="prompt noselect">No Historic Records</p>';
  }
  recordList.map((obj)=>{
    statusNum = getStatusNum(obj.status);
    str += '<div class="item item'+statusNum+'"><div class="status">'+obj.status+'</div><div class="info"><div class="bmi"><a class="attr">BMI</a>'+obj.bmi+'</div><div class="weight"><a class="attr">weight</a>'+obj.weight+'kg</div><div class="height"><a class="attr">height</a>'+obj.height+'cm</div><div class="date"><a class="attr">'+obj.date+'</a></div></div></div>';
  });
  content.innerHTML = str;
}
function getStatusNum(str) {
  let status = statusList.filter((obj)=> {
    return obj.status === str;
  });
  return status[0].num;
}
function addNewItem(item) {
  let re = recordList.map((obj,index)=> {
    return (obj.height !== item.height || obj.weight !== item.weight);
  });

  for(let x of re)if(!x){return;}
  recordList.push(item);
  // console.log(recordList);
  localStorage.setItem('recordList',JSON.stringify(recordList));
}
function changeCheckArea(item) {
  let checkText = document.querySelector('.checkText');
  let statusNum = 0;
  if(item){
    statusNum = getStatusNum(item.status);
    checkText.innerHTML = '<a class="checkText'+statusNum+'">'+item.status+'</a>';
  }else {
    checkText.innerHTML = '';
  }
}
function changeCheckBox(item) {
  let checkBox = document.querySelector('.checkBox');
  let statusNum = 0;
  if(item){
    statusNum = getStatusNum(item.status);
    checkBox.innerHTML = '<div class="check'+statusNum+'"><p class="checkBoxTextNum">'+item.bmi+'</p><p class="checkBoxTextTitle">BMI</p><div class="loop loop'+statusNum+'"></div></div>';;
  }else {
    checkBox.innerHTML = '<div class="check">看結果</div>';
  }
}
checkResult.addEventListener('click', ()=> {
  checkItem();
  let item = getData();

  if(item) {
    item = calculatorData(item);
    item.date = getTime();
    changeCheckArea(item);
    changeCheckBox(item);
    addNewItem(item);
    showRecordList();
  }else {
    changeCheckArea('');
    changeCheckBox('');
  }
  showRecordList();
});
