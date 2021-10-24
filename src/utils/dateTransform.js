export function dateTransform(date, format = "yyyy-MM-dd HH:mm:ss 星期w") {
  var o = {
    "M+" : date.getMonth()+1,                 //月份
    "d+" : date.getDate(),                    //日
    "H+" : date.getHours(),                   //24小时
    "h+":date.getHours()>12?date.getHours()-12:date.getHours(), //12小时
    "m+" : date.getMinutes(),                 //分
    "s+" : date.getSeconds(),                 //秒
     "w" :"日一二三四五六".charAt(date.getDay())

  };
  // 年份
  if(/(y+)/.test(format)){
      //与正则表达式匹配的第一个 子匹配(以括号为标志)字符串  RegExp.$1
    format=format.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
  }

  for(var k in o){
    if(new RegExp("("+ k +")").test(format)){
      format = format.replace(
        RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    }
  }

  return format;
}
