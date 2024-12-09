// ==UserScript==
// @name        方正教务系统自动评教脚本
// @namespace   Violentmonkey Scripts
// @match       http*://*.edu.cn/*xspjgl/xspj_cxXspjIndex.html*
// @match       http*://jw.*.edu.cn/
// @author      Louis16s
// @version     1.2
// @description 方正教务系统自动评教脚本，随机选择一个赞同，其余选择完全赞同，并随机使用评语
// @license     GPL
// ==/UserScript==
/* jshint esversion: 8 */

const wait = ms => {
  return new Promise(resolve => {
    const rt = () => resolve();
    setTimeout(rt, ms);
  });
};

// 定义评语列表
const comments = [
  "教学有方", "知识渊博", "耐心细致", "启发思考", "风趣幽默",
  "严谨治学", "循循善诱", "经验丰富", "亲和力强", "专业精湛",
  "激情澎湃", "思路清晰", "互动活跃", "悉心指导", "富有创意",
  "博学多才", "教学相长", "寓教于乐", "因材施教", "引领成长"
];

// 随机选择评语
const getRandomComment = () => {
  return comments[Math.floor(Math.random() * comments.length)];
};

const alldo = async () => {
  for (let j of document.querySelector("#tempGrid > tbody").children) {
    if (j.querySelector("td:nth-child(8)").innerText == "未评") {
      j.click();
      await wait(1000);
      await evaluation();
      await wait(500);
    }
  }
  alert("完成");
};

const evaluation = async () => {
  let arr = document.querySelectorAll(".radio-pjf");
  for (let i = 0; i < arr.length; i += 5) {
    arr[i].click();
  }
  let num = Math.floor(Math.random() * arr.length / 5);
  arr[5 * num + 1].click();
  document.querySelector(".form-control").value = getRandomComment(); // 随机设置评语
  $("#btn_xspj_tj").data('enter', '1');
  $("#btn_xspj_tj").click();
  $("#btn_ok").click();
};

const init = async () => {
  console.log('begin');
  while (!document.querySelector("#kc-head")) {
    await wait(1000);
  }
  console.log('finish');

  // 创建“全部评价”按钮
  let tempe = document.createElement('button');
  tempe.innerText = '全部评价';
  tempe.type = 'button';
  tempe.onclick = alldo;
  tempe.style.backgroundColor = '#4CAF50'; // 绿色
  tempe.style.color = 'white';
  tempe.style.border = 'none';
  tempe.style.padding = '10px 20px';
  tempe.style.margin = '5px';
  tempe.style.cursor = 'pointer';
  tempe.style.borderRadius = '5px';
  document.querySelector("#kc-head").appendChild(tempe);

  // 创建“评价当前页”按钮
  tempe = document.createElement('button');
  tempe.innerText = '评价当前页';
  tempe.type = 'button';
  tempe.onclick = evaluation;
  tempe.style.backgroundColor = '#008CBA'; // 蓝色
  tempe.style.color = 'white';
  tempe.style.border = 'none';
  tempe.style.padding = '10px 20px';
  tempe.style.margin = '5px';
  tempe.style.cursor = 'pointer';
  tempe.style.borderRadius = '5px';
  document.querySelector("#kc-head").appendChild(tempe);

  // 添加换行
  tempe = document.createElement('br');
  document.querySelector("#kc-head").appendChild(tempe);

  // 添加评语输入框（显示当前默认评语）
  tempe = document.createElement('span');
  tempe.innerText = '评语：';
  document.querySelector("#kc-head").appendChild(tempe);
  tempe = document.createElement('input');
  tempe.id = 'auto-evalution';
  tempe.value = getRandomComment(); // 默认随机评语
  tempe.style.marginLeft = '5px';
  document.querySelector("#kc-head").appendChild(tempe);
};

setTimeout(init, 100);
