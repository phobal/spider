/*
 * @Author: fengbo
 * @Date:   2017-07-23 11:11:50
 * @Last Modified by:   fengbo
 * @Last Modified time: 2017-07-23 15:33:09
 */

'use strict';

const superagent = require('superagent');
const cheerio = require('cheerio');
const nodemailer = require('nodemailer');

const config = {
	url: 'http://www.cdht.gov.cn/search.jspx?q=%E7%BA%A2%E6%A0%91%E6%B9%BE'
};

let $ = {}, todayIsUpdate = false;

let transporter = nodemailer.createTransport({
	host: 'smtp.126.com',
	port: 465,
	secure: true, // secure:true for port 465, secure:false for port 587
	auth: {
		user: 'my@email.com',
		pass: 'my email password'
	}
});

// setup email data with unicode symbols
let mailOptions = {
	from: 'phobal@126.com', // sender address
	to: 'phobal@126.com', // list of receivers
	subject: '红树湾在公证处相关的公告', // Subject line
	// text: 'Hello world ?', // plain text body
	// html: '<b>Hello world ?</b>' // html body
};

function main() {
	getHSW();
}
/**
 * 获取红树湾公告相关数据
 * @return {[type]} [description]
 */
function getHSW() {
	superagent
		.get(config.url)
		.end((err, resp) => {
			const result = resp.text;
			clearData(result);
		})
}
/**
 * 清洗数据
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function clearData(data) {
	// console.log(data);
	$ = cheerio.load(data, {
		ignoreWhitespace: true
	});
	const count = $('.float_l .search_msg .bt .red').last().text();
	let content = [];
	$('.float_l .sslist ul li').map((i, item) => {
		if(i === 0) {
			todayIsUpdate = jugdeIsUpdate(item);
		}
		content.push(`第${i+1}条 ${$(item).html()}`)
	});
	// console.log(content);
	todayIsUpdate && seedEmail(count, content);
}
/**
 * 判断今天是否有数据更新
 * @param  {[type]} item [description]
 * @return {[type]}      [description]
 */
function jugdeIsUpdate(item) {
	const publishDate = $(item).find('nobr').text().trim().split('发布时间： ')[1];
	const nowDate =  new Date().format('yyyy-MM-dd');
	return publishDate === nowDate;
}
/**
 * 发送邮件通知
 * @param  {[type]} count   [description]
 * @param  {[type]} content [description]
 * @return {[type]}         [description]
 */
function seedEmail(count, content) {
	const now = new Date().format('yyyy-MM-dd hh:mm:ss');
	let detail = content.map(item => {
		return "<p>" + `${item}` + "</p>"
	})
	let todayUpdateContent = 	todayIsUpdate ? ('<p style="color: blue; font-size: 36px" >' + `今天有更新哦,   ${detail[0]}` + "</p>") : '';
	mailOptions.html = todayUpdateContent + "<p>" + `截止${now}为止，成都市公证处共刊登了` + '<span style="color: red; font-size: 36px">' + `${count}` + "</span>" + `有关红树湾的消息,下面列举前面10条:` + "</p>" + detail;
	mailOptions.subject += todayIsUpdate ? '(快看，今天有更新哦)' : '';
	console.log(mailOptions.html)
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return console.log(error);
		}
		console.log('Message %s sent: %s', info.messageId, info.response);
	});
}

main();

Date.prototype.format = function (format) {
  const o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds(),
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, `${this.getFullYear()}`.substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : (`00${o[k]}`).substr(`${o[k]}`.length))
    }
  }
  return format
}