//純數字
function checkPhone(invoiceNumber) {
    var regularExpression = /^[0-9]+$/;

    return invoiceNumber.match(regularExpression);
}
//字母+數字
function checkAccount(invoiceNumber) {
    var regularExpression = /^[a-zA-Z0-9]+$/;

    return invoiceNumber.match(regularExpression);
}
//mail格式
function checkmail(invoiceNumber) {
    var regularExpression = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    return invoiceNumber.match(regularExpression);
}
//身分證格式
function checkTwID(id) {
    //建立字母分數陣列(A~Z)  
    var city = new Array(
         1, 10, 19, 28, 37, 46, 55, 64, 39, 73, 82, 2, 11,
        20, 48, 29, 38, 47, 56, 65, 74, 83, 21, 3, 12, 30
    )
    id = id.toUpperCase();
    // 使用「正規表達式」檢驗格式  
    if (id.search(/^[A-Z](1|2)\d{8}$/i) == -1) {
        //alert('基本格式錯誤');  
        return false;
    } else {
        //將字串分割為陣列(IE必需這麼做才不會出錯)  
        id = id.split('');
        //計算總分  
        var total = city[id[0].charCodeAt(0) - 65];
        for (var i = 1; i <= 8; i++) {
            total += eval(id[i]) * (9 - i);
        }
        //補上檢查碼(最後一碼)  
        total += eval(id[9]);
        //檢查比對碼(餘數應為0);  
        return ((total % 10 == 0));
    }
}
//有效日期
function check_date_old(objDate, tmperrmsg) {

    var ischrome = (navigator.userAgent.toLowerCase().indexOf('chrome') != -1)
    var isfirefox = (navigator.userAgent.toLowerCase().indexOf('firefox') != -1)
    var chkDate = new Date(objDate.value.trim());
    //alert(objDate.value.trim() + 'xx');
    var tmpgetyear = chkDate.getYear();

    if (tmpgetyear.toString().length == 3) {
        tmpgetyear = chkDate.getYear() + 1900;
    }


    //西元年
    //if(ischrome==true || isfirefox==true)
    //{ tmpgetyear = chkDate.getYear()+1900;}

    if (tmpgetyear < 100) {
        if ((chkDate.getMonth() + 1) >= 10) {
            if (chkDate.getDate() >= 10) {
                testDat1 = tmpgetyear + '/' + (chkDate.getMonth() + 1) + '/' + chkDate.getDate(); //組合日期，消去時間。
                testDat2 = testDat1
                testDat3 = testDat1
                testDat4 = testDat1
            }
            else {
                testDat1 = tmpgetyear + '/' + (chkDate.getMonth() + 1) + '/0' + chkDate.getDate(); //組合日期，消去時間。
                testDat2 = tmpgetyear + '/' + (chkDate.getMonth() + 1) + '/' + chkDate.getDate(); //組合日期，消去時間。
                testDat3 = testDat1
                testDat4 = testDat1
            }
        }
        else {
            if (chkDate.getDate() >= 10) {
                testDat1 = tmpgetyear + '/0' + (chkDate.getMonth() + 1) + '/' + chkDate.getDate(); //組合日期，消去時間。
                testDat2 = tmpgetyear + '/' + (chkDate.getMonth() + 1) + '/' + chkDate.getDate(); //組合日期，消去時間。
                testDat3 = testDat1
                testDat4 = testDat1
            }
            else {
                testDat1 = tmpgetyear + '/0' + (chkDate.getMonth() + 1) + '/0' + chkDate.getDate(); //組合日期，消去時間。
                testDat2 = tmpgetyear + '/' + (chkDate.getMonth() + 1) + '/0' + chkDate.getDate(); //組合日期，消去時間。
                testDat3 = tmpgetyear + '/0' + (chkDate.getMonth() + 1) + '/' + chkDate.getDate(); //組合日期，消去時間。
                testDat4 = tmpgetyear + '/' + (chkDate.getMonth() + 1) + '/' + chkDate.getDate(); //組合日期，消去時間。
            }
        }
    }
    else {
        if ((chkDate.getMonth() + 1) >= 10) {
            if (chkDate.getDate() >= 10) {
                testDat1 = tmpgetyear + '/' + (chkDate.getMonth() + 1) + '/' + chkDate.getDate(); //組合日期，消去時間。
                testDat2 = testDat1
                testDat3 = testDat1
                testDat4 = testDat1
            }
            else {
                testDat1 = tmpgetyear + '/' + (chkDate.getMonth() + 1) + '/0' + chkDate.getDate(); //組合日期，消去時間。
                testDat2 = tmpgetyear + '/' + (chkDate.getMonth() + 1) + '/' + chkDate.getDate(); //組合日期，消去時間。
                testDat3 = testDat1
                testDat4 = testDat1
            }
        }
        else {
            if (chkDate.getDate() >= 10) {
                testDat1 = tmpgetyear + '/0' + (chkDate.getMonth() + 1) + '/' + chkDate.getDate(); //組合日期，消去時間。
                testDat2 = tmpgetyear + '/' + (chkDate.getMonth() + 1) + '/' + chkDate.getDate(); //組合日期，消去時間。
                testDat3 = testDat1
                testDat4 = testDat1
            }
            else {
                testDat1 = tmpgetyear + '/0' + (chkDate.getMonth() + 1) + '/0' + chkDate.getDate(); //組合日期，消去時間。
                testDat2 = tmpgetyear + '/' + (chkDate.getMonth() + 1) + '/0' + chkDate.getDate(); //組合日期，消去時間。
                testDat3 = tmpgetyear + '/0' + (chkDate.getMonth() + 1) + '/' + chkDate.getDate(); //組合日期，消去時間。
                testDat4 = tmpgetyear + '/' + (chkDate.getMonth() + 1) + '/' + chkDate.getDate(); //組合日期，消去時間。
            }
        }

    }

    testDat = chkDate.toString();

    if (testDat == 'NaN' && testDat.indexOf('/') < 0) {
        return tmperrmsg + "格式錯誤，請使用格式（yyyy/mm/dd）\n";
    }
    else if (testDat1 != objDate.value.trim() && testDat2 != objDate.value.trim() && testDat3 != objDate.value.trim() && testDat4 != objDate.value.trim()) {
        return tmperrmsg + "格式錯誤，請使用格式（yyyy/mm/dd）\n";
    }
    else {
        return "";
    }
}
function check_date(objDate, tmperrmsg) {

    if (IsDate(objDate.value.trim()) == false) {
        return tmperrmsg + "格式錯誤，請使用格式（yyyy/mm/dd）\n";
    }
    else if (IsDate(objDate.value.trim()) == "err1" || IsDate(objDate.value.trim()) == "err2" || IsDate(objDate.value.trim()) == "err3") {
        return tmperrmsg + "格式錯誤，請使用格式（yyyy/mm/dd）\n";
    }
    else {
        return "";
    }


}
function IsDate(d) {
    var reg = /(19|20|30)\d\d\/(0[1-9]|1[012]|[1-9])\/(0[1-9]|[12][0-9]|3[01]|[1-9])/;
    var result = d.match(reg);

    if (result == null) {
        return false
    };
    var ds = d.split('/');

    var dt = new Date(ds[0], ds[1] - 1, ds[2]);
    if (Number(dt.getFullYear()) != Number(ds[0])) {
        return "err1";
    }
    if (Number(dt.getMonth()) + 1 != Number(ds[1])) {
        return "err2";
    }
    if (Number(dt.getDate()) != Number(ds[2])) {
        return "err3";
    }
    return true;
}

//顯示欄位驗證錯誤訊息
function showErrorMessage(Target, msg) {
    $(Target).html(msg);
}

//開新視窗 列印div
function printDiv($area) {
    w = window.open("", "", "width=800, height=800");

    var printBody = $area.html();
    var $html = $('html').clone();
    $html.find('body').html(printBody);
    w.document.write($html.html());
    setTimeout(function () {
    w.document.close();
    w.focus();
    w.print();
    w.close();
    }, 500);
}


//錢加上 , 千分符號
function addComma(n) {
    n += "";
    var arr = n.split(".");
    var re = /(\d{1,3})(?=(\d{3})+$)/g;
    return arr[0].replace(re, "$1,") + (arr.length == 2 ? "." + arr[1] : "");
}
//錢去掉 , 千分符號
function delComma(value) {
    var rtnVal = value + "";
    return rtnVal.replace(/,/g, "");
}

//密碼
function checkpwd(m_string) {
    return passwordrulechk(m_string);
}
function passwordrulechk(pwstr) {

    var minneed = 12; //必要條件:字數>=12
    var maxneed = 16; //必要條件:字數<=16
    var numneed = 1; //必要條件:數字>=1
    var strneed = 1; //必要條件:英文>=1
    var sblneed = 1; //必要條件:符號>=1

    var numcount = 0;
    var strcount = 0;
    var sblcount = 0;
    var errcount = 0;
    var errwords = 0;

    var rexstr = "/select |update |delete |insert | and | or |/gi"
    var res = pwstr.match(rexstr)
    if (res != null) { errwords = 1; }//關鍵單字

    for (i = 0; i <= pwstr.length; i++) {
        var t = pwstr.charCodeAt(i)
        if (t <= 32 || t >= 127 || t == 39 || t == 34 || t == 37 || t == 38 || t == 47 || t == 59 || t == 60 || t == 62 || t == 92) { errcount++; } //關鍵符號
        else {
            if (t >= 48 && t <= 57) { numcount++; } //數字
            if ((t >= 65 && t <= 90) || (t >= 97 && t <= 122)) { strcount++; } //英文
            if ((t >= 33 && t <= 47) || (t >= 58 && t <= 64) || (t >= 91 && t <= 96) || (t >= 123 && t <= 126)) { sblcount++; } //一般符號
        }
    }

    var errmsg = "";
    if (minneed > pwstr.length) { errmsg += "字數至少要有" + minneed + "個\n"; }
    if (maxneed < pwstr.length) { errmsg += "字數要少於" + maxneed + "個\n"; }
    if (numcount < numneed) { errmsg += "至少要有" + numneed + "個數字\n"; }
    if (strcount < strneed) { errmsg += "至少要有" + strneed + "個英文字母\n"; }
    if (sblcount < sblneed) { errmsg += "至少要有" + sblneed + "個特殊符號\n"; }
    if (errcount > 0) { errmsg += "不得有關鍵符號\n"; }
    if (errwords > 0) { errmsg += "不得有關鍵單字\n"; }

    return errmsg
}


//轉字串 防WAF
function reversectx(str) {

    var dexword = ["凵", "卄", "廾", "卌", "昍", "呃", "吼", "呷", "呿", "哎"];

    var k = 0;
    var res1 = "";
    while (k < str.length && str.length > 0) {
        var chr = str.substring(k, k + 1);
        var chrcode = chr.charCodeAt(0);
        if (chrcode <= 126 && chrcode > 30) {
            var newcode = chrcode - 27;
            res1 += dexword[parseInt(newcode / 10)]
            res1 += dexword[parseInt(newcode % 10)]
        }
        else {
            res1 += chr;
        }
        k++;
    }
    return res1;
}



function fontchange(tmpa) {
    tmpa = "#" + tmpa;
    $("#FON").removeClass("ON");
    $("#FON_S").removeClass("ON");
    $("#FON_B").removeClass("ON");

    $(tmpa).addClass("ON");

    if (tmpa == "#FON_B")
    { $(".content").css('font-size', '120%'); }
    else
    {
        if (tmpa == "#FON_S")
        { $(".content").css('font-size', '80%'); }
        else
        { $(".content").css('font-size', '100%'); }
    }

}


