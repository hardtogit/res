function activityAdminAddActivity(param, successFunc, errorFunc) {
    jsonAjax('POST', 'api/admin/activity/add', param, successFunc, errorFunc);
}

function activityAdminDelActivity(id, successFunc, errorFunc) {
    var param = {};
    param.id = id;
    formAjax('POST', 'api/admin/activity/del', param, successFunc, errorFunc);
}

function activityAdminEditActivity(param, successFunc, errorFunc) {
    jsonAjax('POST', 'api/admin/activity/edit', param, successFunc, errorFunc);
}

function activityAdminGetActivity(id, successFunc, errorFunc) {
    var param = {};
    param.id = id;
    formAjax('GET', 'api/admin/activity/get', param, successFunc, errorFunc);
}

function activityAdminListActivity(param, successFunc, errorFunc) {
    formAjax('GET', 'api/admin/activity/list', param, successFunc, errorFunc);
}

function activityAdminSetStatus(id, status, successFunc, errorFunc) {
    var param = {};
    param.id = id;
    param.status = status;
    debugger
    jsonAjax('POST', 'api/admin/activity/status', param, successFunc, errorFunc);
}

function commodityFinalAddCommodityFinal(param, successFunc, errorFunc) {
    jsonAjax('POST', 'api/admin/commodityfinal/add', param, successFunc, errorFunc);
}

function commodityFinalDelCommodityFinal(id, successFunc, errorFunc) {
    var param = {};
    param.id = id;
    formAjax('POST', 'api/admin/commodityfinal/del', param, successFunc, errorFunc);
}

function commodityFinalEditCommodityFinal(param, successFunc, errorFunc) {
    jsonAjax('POST', 'api/admin/commodityfinal/edit', param, successFunc, errorFunc);
}

function commodityFinalGetCommodityFinal(id, successFunc, errorFunc) {
    var param = {};
    param.id = id;
    formAjax('GET', 'api/admin/commodityfinal/get', param, successFunc, errorFunc);
}

function commodityFinalListCommodityFinal(param, successFunc, errorFunc) {
    formAjax('GET', 'api/admin/commodityfinal/list', param, successFunc, errorFunc);
}

function otherGetSerialIdAndNames(param, successFunc, errorFunc) {
    formAjax('GET', 'api/admin/other/serial/list_id_and_name', param, successFunc, errorFunc);
}

function otherGetCommodityIdAndName(serialId, successFunc, errorFunc) {
    var param = {};
    param.serialId = serialId;
    formAjax('GET', 'api/admin/other/commodity/list_id_and_name', param, successFunc, errorFunc);
}

function commodityFinalGetUnbindFinalIdAndName(exceptActivityId, successFunc, errorFunc) {
    var param = {};
    param.exceptActivityId = exceptActivityId;
    formAjax('GET', 'api/admin/commodityfinal/unbind_id_and_name', param, successFunc, errorFunc);
}


function formAjax(method, url, param, successFunc, errorFunc) {
    $.ajax({
        type: method,
        url: "/" + url,
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        data: param,
        dataType: "json",
        success: function (res) {
            let message = res['message'];
            if (message !== 'OK') {
                alert(res.message);
                return;
            }

            if (successFunc) {
                successFunc.call(this, res.data);
            }
        },
        error: function (message) {
            if (errorFunc != null) {
                errorFunc.call(this, message);
            } else {
                alert("请求失败");
            }
        }
    });
}

function jsonAjax(method, url, param, successFunc, errorFunc) {
    $.ajax({
        type: method,
        url: "/" + url,
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(param),
        dataType: "json",
        success: function (res) {
            let message = res['message'];
            if (message !== 'OK') {
                alert(res.message);
                return;
            }

            if (successFunc) {
                successFunc.call(this, res.data);
            }
        },
        error: function (message) {
            if (errorFunc != null) {
                errorFunc.call(this, message);
            } else {
                alert("提交失败");
            }
        }
    });
}