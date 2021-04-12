String.prototype.format = function (args) {
    var result = this;
    if (arguments.length < 1) {
        return result;
    }

    var data = arguments; // 如果模板参数是数组
    if (arguments.length == 1 && typeof (args) == "object") {
        // 如果模板参数是对象
        data = args;
    }
    for (var key in data) {
        var value = data[key];
        if (undefined != value) {
            result = result.replaceAll("\{" + key + "\}", value);
        }
    }
    return result;
}

formatDateTime = function (value) {
    if (value == null) {
        return "";
    }
    var date = new Date(value);
    var y = date.getFullYear(),
        m = date.getMonth() + 1,
        d = date.getDate(),
        h = date.getHours(),
        i = date.getMinutes(),
        s = date.getSeconds();
    if (m < 10) {
        m = '0' + m;
    }
    if (d < 10) {
        d = '0' + d;
    }
    if (h < 10) {
        h = '0' + h;
    }
    if (i < 10) {
        i = '0' + i;
    }
    if (s < 10) {
        s = '0' + s;
    }
    return y + '-' + m + '-' + d + ' ' + h + ':' + i + ':' + s;
}

formatDate = function (value) {
    if (value == null) {
        return "";
    }
    var date = new Date(value);
    var y = date.getFullYear(),
        m = date.getMonth() + 1,
        d = date.getDate()
    if (m < 10) {
        m = '0' + m;
    }
    if (d < 10) {
        d = '0' + d;
    }
    return y + '-' + m + '-' + d;
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}


function populateForm(formId, data) {
    for (var attr in data) {
        var formField = $("#" + attr);
        if (!formField[0]) {
            formField = $("#" + formId).find("input[name=" + attr + "]");
        }
        if (formField) {
			var tag = formField.attr("type");
            if (tag == "radio" || tag == "checkbox") {
                for (var i = 0; i < formField.length; i++) {
                    if (data[attr] != null) {
                        if ($(formField.get(i)).attr("value") == data[attr].toString()) {
                            $(formField.get(i)).prop("checked", true);
                        }
                    }
                }
            } else if (formField.length == 1 &&
                formField.get(0).nodeName.toLowerCase() == "select") {
                if (data[attr]) {
                    formField.find("option[value=" + data[attr] + "]").prop('selected', true);
                } else {
                    formField.find("option:first").prop("selected", true);
                }
            } else {
                formField.val(data[attr]);
				if(tag =='hidden') {
					$('img.' + attr).attr('src', data[attr]);
				}
            }
        }
    }
}

function serializeObject(form) {
    var o = {};
    var a = $(form).serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
}

function isDateTimeFormat(timeStr) {
    var reg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/
    var regExp = new RegExp(reg);
    return regExp.test(timeStr);
}