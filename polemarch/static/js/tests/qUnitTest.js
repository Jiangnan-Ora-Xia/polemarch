/**
 * Файл вставляемый на страницу при тестировании из phantomjs
 */

///////////////////////////////////////////////
// Вспомагательные функции для тестирования
///////////////////////////////////////////////

/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/

var Base64 = {

	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = Base64._utf8_encode(input);

		while (i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		}

		return output;
	},

	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {

			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}

		output = Base64._utf8_decode(output);

		return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;

		while ( i < utftext.length ) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}

		}

		return string;
	}

}

/**
 * https://stackoverflow.com/a/25456134/7835270
 * @param {type} x
 * @param {type} y
 * @returns {Boolean}
 */
var deepEqual = function (x, y)
{
    if ((typeof x == "object" && x != null) && (typeof y == "object" && y != null))
    {
        if (Object.keys(x).length != Object.keys(y).length)
        {
            console.error("x.keys.length != y.keys.length")
            throw("x.keys.length != y.keys.length")
            return false;
        }

        for (var prop in x)
        {
            if (y.hasOwnProperty(prop))
            {
                if (! deepEqual(x[prop], y[prop]))
                {
                    console.error("x["+prop + "] != y["+prop+"]")
                    throw("x["+prop + "] != y["+prop+"]")
                    return false;
                }
            }
            else
            {
                console.error("x["+prop + "] != undefined")
                throw("x["+prop + "] != undefined")
                return false;
            }
        }

        return true;
    }
    else if (x !== y)
    {
        console.error("x("+x + ") != y("+ y + ")")
        throw("x("+x + ") != y("+ y + ")")
        return false;
    }
    else
    {
        return true;
    }
}


function render(name, callback)
{
    if(callback === undefined)
    {
       callback =  name
       name = "render"
    }

    var def = new $.Deferred();
    var time = 10

    setTimeout(function(name){
        console.log("render " + name)
        setTimeout(function(){

            if(callback)
            {
                callback(name)
            }

            def.resolve()
        }, 10)
    }, time, name, 0)

    return def.promise();
}

function saveReport()
{
    $("body").html('<div id="qunit">'+$("#qunit").html()+'</div>');
    $("body").append('<link rel="stylesheet" href="'+window.pmStaticPath + 'js/tests/phantomjs/qunit/qunit-2.2.1.css">')
    console.log("saveReport")
}

/**
 * Вставляет Qunit и запускает выполнение тестов.
 */
function injectQunit()
{
    $("body").append('<link rel="stylesheet" href="'+window.pmStaticPath + 'js/tests/phantomjs/qunit/qunit-2.2.1.css">')
    $("body").append('<script src="'+ window.pmStaticPath + 'js/tests/phantomjs/qunit/qunit-2.2.1.js"></script>')
    $("body").append('<div id="qunit"></div><div id="qunit-fixture"></div>')

    var intervalId = setInterval(function()
    {
        if(!window.QUnit)
        {
            return;
        }

        console.log("Начинаем тесты от Qunit");
        clearInterval(intervalId)

        //QUnit.config.autostart = false
        //QUnit.config.reorder = false

        QUnit.done(function( details ) {
          console.log( "Total: "+ details.total+ " Failed: "+ details.failed+ " Passed: "+ details.passed+ " Runtime: "+ details.runtime );
        });

        QUnit.testDone(function(details){
            var result = {
                "Module name": details.module,
                "Test name": details.name,
                "Assertions": {
                    "Total": details.total,
                    "Passed": details.passed,
                    "Failed": details.failed
                },
                "Skipped": details.skipped,
                "Runtime": details.runtime
            };

            console.log( JSON.stringify( result, null, 2 ) );

            if(!syncQUnit.nextTest())
            {
                saveReport()
                render("ok-done", window.close)
            }
        })

        qunitAddTests()
        syncQUnit.nextTest()

    }, 500)
}


///////////////////////////////////////////////
// Дополнения для QUnit для последовательного выполнения тестов.
///////////////////////////////////////////////
syncQUnit = {}
syncQUnit.testsArray = []
syncQUnit.addTest = function(name, test)
{
    syncQUnit.testsArray.push({name:name, test:test})
}

syncQUnit.nextTest = function(name, test)
{
    if(!syncQUnit.testsArray.length)
    {
        return false;
    }

    var test = syncQUnit.testsArray.shift()

    $.notify("Test "+test.name+", "+syncQUnit.testsArray.length+" tests remain", "warn");

    QUnit.test(test.name, test.test);
    //syncQUnit.nextTest()
    //QUnit.start()
    return true;
}

///////////////////////////////////////////////
// Функции тестирования
///////////////////////////////////////////////

/**
 * В этой функции должны быть qunit тесты для приложения
 */
function qunitAddTests()
{
    syncQUnit.addTest('trim', function ( assert ) {
        var done = assert.async();
        assert.equal(trim(''), '', 'Пустая строка');
        assert.ok(trim('   ') === '', 'Строка из пробельных символов');
        assert.equal(trim(), '', 'Без параметра');

        assert.equal(trim(' x'), 'x', 'Начальные пробелы');
        assert.equal(trim('x '), 'x', 'Концевые пробелы');
        assert.equal(trim(' x '), 'x', 'Пробелы с обоих концов');
        assert.equal(trim('    x  '), 'x', 'Табы');
        assert.equal(trim('    x   y  '), 'x   y', 'Табы и пробелы внутри строки не трогаем');

        render(done);
    });

    qunitAddTests_users()
    qunitAddTests_hosts()
    qunitAddTests_groups()
    qunitAddTests_inventories()
    qunitAddTests_projects()
    qunitAddTests_templates_task()
    qunitAddTests_templates_modules()
}

/**
 * Тестирование users
 */
function qunitAddTests_users()
{
    syncQUnit.addTest('Открытие списка пользователей', function ( assert )
    {
        var done = assert.async();

        $.when(spajs.open({ menuId:"users"})).done(function()
        {
            assert.ok(true, 'Успешно открыто меню users');
            render(done)
        }).fail(function()
        {
            assert.ok(false, 'Ошибка при открытиии меню users');
            render(done)
        })
    });

    syncQUnit.addTest('Открытие страницы добавления пользователя', function ( assert )
    {
        var done = assert.async();

        // Открытие пункта меню new-user
        $.when(spajs.open({ menuId:"new-user"})).done(function()
        {
            assert.ok(true, 'Успешно открыто меню new-user');
            render(done)
        }).fail(function()
        {
            assert.ok(false, 'Ошибка при открытиии меню new-user');
            render(done)
        })
    });

    var t = new Date();
    t = t.getTime()

    syncQUnit.addTest('Создание пользователя', function ( assert )
    {
        // Предполагается что мы от прошлого теста попали на страницу создания пользователя
        var done = assert.async();

        // Заполнение формы с данными пользователя
        $("#new_user_username").val("test-user-"+t);
        $("#new_user_password").val("test-user-"+t);
        $("#new_user_email").val("test@user.ru");
        $("#new_user_first_name").val("test");
        $("#new_user_last_name").val("user");

        // Отправка формы с данными пользователя
        $.when(pmUsers.addItem()).done(function()
        {
            assert.ok(true, 'Успешно user add Item');
            render(done)
        }).fail(function()
        {
            assert.ok(false, 'Ошибка при user add Item');
            render(done)
        })
    });

    var userId = undefined
    syncQUnit.addTest('Изменение пользователя', function ( assert )
    {
        var done = assert.async();

        // Предполагается что мы от прошлого теста попали на страницу редактирования пользователя
        // с адресом http://192.168.0.12:8080/?user-5
        userId = /user\/([0-9]+)/.exec(window.location.href)[1]

        $("#user_"+userId+"_username").val("test2-user-"+t);
        $("#user_"+userId+"_password").val("test2-user-"+t);
        $("#user_"+userId+"_email").val("test2@user.ru");
        $("#user_"+userId+"_first_name").val("test2-"+t);
        $("#user_"+userId+"_last_name").val("user2-"+t);

        $.when(pmUsers.updateItem(userId)).done(function()
        {
            assert.ok(true, 'Успешно update add Item');
            render(done)
        }).fail(function(){
            assert.ok(false, 'Ошибка при update add Item');
            render(done)
        })
    });

    syncQUnit.addTest('Копирование пользователя', function ( assert )
    {
        var done = assert.async();

        $.when(pmUsers.copyAndEdit(userId)).done(function()
        {
            assert.ok(true, 'Успешно copyAndEdit add Item');
            render(done)
        }).fail(function(){
            assert.ok(false, 'Ошибка при copyAndEdit add Item');
            render(done)
        })
    });

    syncQUnit.addTest('Удаление копии пользователя', function ( assert )
    {
        var done = assert.async();

        // Предполагается что мы от прошлого теста попали на страницу редактирования пользователя
        // с адресом http://192.168.0.12:8080/?user-5
        var userId = /user\/([0-9]+)/.exec(window.location.href)[1]

        // Удаление пользователя.
        $.when(pmUsers.deleteItem(userId, true)).done(function()
        {
            assert.ok(true, 'Успешно delete add Item');
            render(done)
        }).fail(function(){
            assert.ok(false, 'Ошибка при delete add Item');
            render(done)
        })
    });

    syncQUnit.addTest('Удаление пользователя', function ( assert )
    {
        var done = assert.async();

        // Удаление пользователя.
        $.when(pmUsers.deleteItem(userId, true)).done(function()
        {
            assert.ok(true, 'Успешно delete add Item');
            render(done)
        }).fail(function(){
            assert.ok(false, 'Ошибка при delete add Item');
            render(done)
        })
    });
}


/**
 * Тестирование hosts
 */
function qunitAddTests_hosts()
{
    syncQUnit.addTest('Открытие списка хостов', function ( assert )
    {
        var done = assert.async();

        $.when(spajs.open({ menuId:"hosts"})).done(function()
        {
            assert.ok(true, 'Успешно открыто меню hosts');
            render(done)
        }).fail(function()
        {
            assert.ok(false, 'Ошибка при открытиии меню hosts');
            render(done)
        })
    });

    syncQUnit.addTest('Постраничная навигация хостов', function ( assert )
    {
        var done = assert.async();

        $.when(spajs.open({ menuId:"hosts/page/999"})).done(function()
        {
            assert.ok(true, 'Успешно открыто меню hosts');
            render(done)
        }).fail(function()
        {
            assert.ok(false, 'Ошибка при открытиии меню hosts');
            render(done)
        })
    });

    syncQUnit.addTest('Страница создания хоста', function ( assert )
    {
        var done = assert.async();

        // Открытие пункта меню new-host
        $.when(spajs.open({ menuId:"new-host"})).done(function()
        {
            assert.ok(true, 'Успешно открыто меню new-host');
            render(done)
        }).fail(function()
        {
            assert.ok(false, 'Ошибка при открытиии меню new-host');
            render(done)
        })
    });

    var t = new Date();
    t = t.getTime()

    syncQUnit.addTest('Создание хоста', function ( assert )
    {
        // Предполагается что мы от прошлого теста попали на страницу создания хоста
        var done = assert.async();

        // Заполнение формы с данными хоста
        $("#new_host_name").val("test-host-"+t);
        $("#new_host_type").val("HOST");

        $("#new_json_name").val("test1");
        $("#new_json_value").val("val1");
        jsonEditor.jsonEditorAddVar();

        $("#new_json_name").val("test2");
        $("#new_json_value").val("val2");
        jsonEditor.jsonEditorAddVar();


        // Отправка формы с данными хоста
        $.when(pmHosts.addItem()).done(function()
        {
            assert.ok(true, 'Успешно host add Item');
            render(done)
        }).fail(function()
        {
            assert.ok(false, 'Ошибка при user add Item');
            render(done)
        })
    });

    var itemId = undefined
    syncQUnit.addTest('Изменение хоста', function ( assert )
    {
        var done = assert.async();

        // Предполагается что мы от прошлого теста попали на страницу редактирования хоста
        // с адресом http://192.168.0.12:8080/?host-5
        itemId = /host\/([0-9]+)/.exec(window.location.href)[1]

        $("#host_"+itemId+"_name").val("test2-hosts-"+t);

        $("#new_json_name").val("test3");
        $("#new_json_value").val("val3");
        jsonEditor.jsonEditorAddVar();


        $.when(pmHosts.updateItem(itemId)).done(function()
        {
            assert.ok(true, 'Успешно update add Item');
            render(done)
        }).fail(function(){
            assert.ok(false, 'Ошибка при update add Item');
            render(done)
        })
    });

    syncQUnit.addTest('Копирование хоста', function ( assert )
    {
        var done = assert.async();

        $.when(pmHosts.copyAndEdit(itemId)).done(function()
        {
            assert.ok(true, 'Успешно copyAndEdit add Item');
            render(done)
        }).fail(function(){
            assert.ok(false, 'Ошибка при copyAndEdit add Item');
            render(done)
        })
    });

    syncQUnit.addTest('Удаление копии хоста', function ( assert )
    {
        var done = assert.async();

        // Предполагается что мы от прошлого теста попали на страницу редактирования пользователя
        // с адресом http://192.168.0.12:8080/?user-5
        var itemId = /host\/([0-9]+)/.exec(window.location.href)[1]

        // Удаление пользователя.
        $.when(pmHosts.deleteItem(itemId, true)).done(function()
        {
            assert.ok(true, 'Успешно delete add Item');
            render(done)
        }).fail(function(){
            assert.ok(false, 'Ошибка при delete add Item');
            render(done)
        })
    });

    syncQUnit.addTest('Удаление хоста', function ( assert )
    {
        var done = assert.async();

        // Удаление хоста.
        $.when(pmHosts.deleteItem(itemId, true)).done(function()
        {
            assert.ok(true, 'Успешно delete add Item');
            render(done)
        }).fail(function(){
            assert.ok(false, 'Ошибка при delete add Item');
            render(done)
        })
    });
}


/**
 * Тестирование groups
 */
function qunitAddTests_groups()
{
    syncQUnit.addTest('Проверка функции validateHostName', function ( assert ) {
        var done = assert.async();

        assert.ok(!pmGroups.validateHostName(), 'Host')
        assert.ok(!pmGroups.validateRangeName(), 'Range')

        assert.ok(pmGroups.validateHostName("192.168.0.12"), 'Host 192.168.0.12')
        assert.ok(pmGroups.validateHostName("local"), 'Host local')
        assert.ok(pmGroups.validateHostName("loc.ru"), 'Host loc.ru')

        assert.ok(pmGroups.validateRangeName("192.168.0.12"), 'Range 192.168.0.12')
        assert.ok(pmGroups.validateRangeName("local"), 'Range local')
        assert.ok(pmGroups.validateRangeName("loc.ru"), 'Range loc.ru')

        assert.ok(pmGroups.validateRangeName("19[2:7].168.0.12"), 'Range 19[2:7].168.0.12')
        assert.ok(pmGroups.validateRangeName("loc[a:f]l"), 'Range loc[a:f]l')
        assert.ok(pmGroups.validateRangeName("loc.[a:f]u"), 'Range loc.[a:f]u')

        render(done);
    });

    syncQUnit.addTest('Список групп', function ( assert )
    {
        var done = assert.async();

        $.when(spajs.open({ menuId:"groups"})).done(function()
        {
            assert.ok(true, 'Успешно открыто меню groups');
            render(done)
        }).fail(function()
        {
            assert.ok(false, 'Ошибка при открытиии меню groups');
            render(done)
        })
    });

    syncQUnit.addTest('Страница создания группы', function ( assert )
    {
        var done = assert.async();

        // Открытие пункта меню new-host
        $.when(spajs.open({ menuId:"new-group"})).done(function()
        {
            assert.ok(true, 'Успешно открыто меню new-group');
            render(done)
        }).fail(function()
        {
            assert.ok(false, 'Ошибка при открытиии меню new-group');
            render(done)
        })
    });

    var t = new Date();
    t = t.getTime()

    syncQUnit.addTest('Сохранение группы', function ( assert )
    {
        // Предполагается что мы от прошлого теста попали на страницу создания группы
        var done = assert.async();

        // Заполнение формы с данными группы
        $("#new_group_name").val("test-group-"+t);

        $("#new_json_name").val("test1");
        $("#new_json_value").val("val1");
        jsonEditor.jsonEditorAddVar();

        $("#new_json_name").val("test2");
        $("#new_json_value").val("val2");
        jsonEditor.jsonEditorAddVar();

        $("#new_group_children").addClass('selected');

        // Отправка формы с данными группы
        $.when(pmGroups.addItem()).done(function()
        {
            assert.ok(true, 'Успешно group add Item');
            render(done)
        }).fail(function()
        {
            assert.ok(false, 'Ошибка при group add Item');
            render(done)
        })
    });

    syncQUnit.addTest('Обновление группы', function ( assert )
    {
        var done = assert.async();

        // Предполагается что мы от прошлого теста попали на страницу редактирования группы
        // с адресом http://192.168.0.12:8080/?group-5
        var itemId = /group\/([0-9]+)/.exec(window.location.href)[1]

        $("#group_"+itemId+"_name").val("test2-group-"+t);

        $("#new_json_name").val("test3");
        $("#new_json_value").val("val3");
        jsonEditor.jsonEditorAddVar();


        $.when(pmGroups.updateItem(itemId)).done(function()
        {
            assert.ok(true, 'Успешно update add Item');
            render(done)
        }).fail(function(){
            assert.ok(false, 'Ошибка при update add Item');
            render(done)
        })
    });

    syncQUnit.addTest('Открытие страницы создания подгруппы', function ( assert )
    {
        var done = assert.async();

        // Предполагается что мы от прошлого теста попали на страницу редактирования группы
        // с адресом http://192.168.0.12:8080/?group-5
        var itemId = /group\/([0-9]+)/.exec(window.location.href)[1]

        // Открытие пункта меню new-host
        $.when(spajs.open({ menuId:"group/"+itemId+"/new-group"})).done(function()
        {
            assert.ok(true, 'Успешно открыто меню создания подгруппы new-group');
            render(done)
        }).fail(function()
        {
            assert.ok(false, 'Ошибка при открытиии меню создания подгруппы new-group');
            render(done)
        })
    });

    var itemId = undefined
    syncQUnit.addTest('Сохранение подгруппы', function ( assert )
    {
        // Предполагается что мы от прошлого теста попали на страницу создания группы
        var done = assert.async();

        // Заполнение формы с данными группы
        $("#new_group_name").val("test-sub-group-"+t);

        $("#new_json_name").val("test1");
        $("#new_json_value").val("val1");
        jsonEditor.jsonEditorAddVar();

        $("#new_json_name").val("test2");
        $("#new_json_value").val("val2");
        jsonEditor.jsonEditorAddVar();

        var master_group_itemId = /group\/([0-9]+)/.exec(window.location.href)[1]
        itemId = master_group_itemId

        // Отправка формы с данными группы
        $.when(pmGroups.addItem('group', master_group_itemId)).done(function()
        {
            var itemId = /group\/([0-9]+)/.exec(window.location.href)[1]
            if(master_group_itemId != itemId)
            {
                assert.ok(false, 'Ошибка при добавлении подгруппы ' + master_group_itemId +"!="+ itemId);
                render(done)
            }
            else
            {
                assert.ok(true, 'Успешно group sub add Item');
                render(done)
            }

        }).fail(function()
        {
            assert.ok(false, 'Ошибка при group sub add Item');
            render(done)
        })
    });

    syncQUnit.addTest('Проверка добавления невалидных подгрупп', function ( assert )
    {
        var done = assert.async();
        var itemId = /group\/([0-9]+)/.exec(window.location.href)[1]
        $.when(pmGroups.addSubGroups(itemId, [999999])).done(function()
        {
            assert.ok(false, 'Ошибка при добавлении подгруппы 999999 вроде бы нет');
            render(done)
        }).fail(function()
        {
            assert.ok(true, 'Проверка добавления невалидных подгрупп успешна');
            render(done)
        })
    })

    syncQUnit.addTest('Проверка добавления невалидных хостов', function ( assert )
    {
        var done = assert.async();
        var itemId = /group\/([0-9]+)/.exec(window.location.href)[1]
        $.when(pmGroups.addSubHosts(itemId, [999999])).done(function()
        {
            assert.ok(false, 'Ошибка при добавлении хоста 999999 вроде бы нет');
            render(done)
        }).fail(function()
        {
            assert.ok(true, 'Проверка добавления невалидных хостов успешна');
            render(done)
        })
    })

    syncQUnit.addTest('Копирование группы', function ( assert )
    {
        // Предполагается что мы от прошлого теста попали на страницу редактирования группы
        // с адресом http://192.168.0.12:8080/?group-5
        itemId = /group\/([0-9]+)/.exec(window.location.href)[1]

        var done = assert.async();
        $.when(pmGroups.copyAndEdit(itemId)).done(function()
        {
            assert.ok(true, 'Успешно copyAndEdit Item '+itemId);
            render(done)
        }).fail(function(){
            assert.ok(false, 'Ошибка при copyAndEdit Item '+itemId);
            render(done)
        })
    });

    syncQUnit.addTest('Удаление копии группы', function ( assert )
    {
        var done = assert.async();

        // Предполагается что мы от прошлого теста попали на страницу редактирования пользователя
        // с адресом http://192.168.0.12:8080/?user-5
        var itemId = /group\/([0-9]+)/.exec(window.location.href)[1]

        // Удаление пользователя.
        $.when(pmGroups.deleteItem(itemId, true)).done(function()
        {
            assert.ok(true, 'Успешно delete add Item');
            render(done)
        }).fail(function(){
            assert.ok(false, 'Ошибка при delete add Item');
            render(done)
        })
    });

    syncQUnit.addTest('Удаление группы', function ( assert )
    {
        var done = assert.async();

        // Удаление группы.
        $.when(pmGroups.deleteItem(itemId, true)).done(function()
        {
            assert.ok(true, 'Успешно delete add Item');
            render(done)
        }).fail(function(){
            assert.ok(false, 'Ошибка при delete add Item');
            render(done)
        })
    });
}


/**
 * Тестирование inventories
 */
function qunitAddTests_inventories()
{
    syncQUnit.addTest('Список инвенториев', function ( assert )
    {
        var done = assert.async();

        $.when(spajs.open({ menuId:"inventories"})).done(function()
        {
            assert.ok(true, 'Успешно открыто меню inventories');
            render(done)
        }).fail(function()
        {
            assert.ok(false, 'Ошибка при открытиии меню inventories');
            render(done)
        })
    });

    syncQUnit.addTest('Страница нового inventory', function ( assert )
    {
        var done = assert.async();

        // Открытие пункта меню new-inventory
        $.when(spajs.open({ menuId:"new-inventory"})).done(function()
        {
            assert.ok(true, 'Успешно открыто меню new-inventory');
            render(done)
        }).fail(function()
        {
            assert.ok(false, 'Ошибка при открытиии меню new-inventory');
            render(done)
        })
    });

    var t = new Date();
    t = t.getTime()

    syncQUnit.addTest('Сохранение нового inventory', function ( assert )
    {
        // Предполагается что мы от прошлого теста попали на страницу создания inventory
        var done = assert.async();

        // Заполнение формы с данными inventory
        $("#new_inventory_name").val("test-inventory-"+t);

        $("#new_json_name").val("test1");
        $("#new_json_value").val("val1");
        jsonEditor.jsonEditorAddVar();

        $("#new_json_name").val("test2");
        $("#new_json_value").val("val2");
        jsonEditor.jsonEditorAddVar();


        // Отправка формы с данными inventory
        $.when(pmInventories.addItem()).done(function()
        {
            assert.ok(true, 'Успешно inventory add Item');
            render(done)
        }).fail(function()
        {
            assert.ok(false, 'Ошибка при inventory add Item');
            render(done)
        })
    });

    syncQUnit.addTest('Обновление inventory', function ( assert )
    {
        var done = assert.async();

        // Предполагается что мы от прошлого теста попали на страницу редактирования inventory
        // с адресом http://192.168.0.12:8080/?group-5
        var itemId = /inventory\/([0-9]+)/.exec(window.location.href)[1]

        $("#inventory_"+itemId+"_name").val("test2-inventory-"+t);

        $("#new_json_name").val("test3");
        $("#new_json_value").val("val3");
        jsonEditor.jsonEditorAddVar();

        $.when(pmInventories.updateItem(itemId)).done(function()
        {
            assert.ok(true, 'Успешно update add Item');
            render(done)
        }).fail(function(){
            assert.ok(false, 'Ошибка при update add Item');
            render(done)
        })
    });

    syncQUnit.addTest('Проверка добавления невалидных подгрупп к inventory', function ( assert )
    {
        var done = assert.async();
        var itemId = /inventory\/([0-9]+)/.exec(window.location.href)[1]
        $.when(pmInventories.addSubGroups(itemId, [999999])).done(function()
        {
            assert.ok(false, 'Ошибка при добавлении подгруппы 999999 вроде бы нет');
            render(done)
        }).fail(function()
        {
            assert.ok(true, 'Проверка добавления невалидных подгрупп успешна');
            render(done)
        })
    })

    syncQUnit.addTest('Проверка добавления невалидных хостов к inventory', function ( assert )
    {
        var done = assert.async();
        var itemId = /inventory\/([0-9]+)/.exec(window.location.href)[1]
        $.when(pmInventories.addSubHosts(itemId, [999999])).done(function()
        {
            assert.ok(false, 'Ошибка при добавлении хоста 999999 вроде бы нет');
            render(done)
        }).fail(function()
        {
            assert.ok(true, 'Проверка добавления невалидных хостов успешна');
            render(done)
        })
    })

    var itemId = undefined
    syncQUnit.addTest('Копирование группы', function ( assert )
    {
        // Предполагается что мы от прошлого теста попали на страницу редактирования группы
        // с адресом http://192.168.0.12:8080/?group-5
        itemId = /inventory\/([0-9]+)/.exec(window.location.href)[1]

        var done = assert.async();
        $.when(pmInventories.copyAndEdit(itemId)).done(function()
        {
            assert.ok(true, 'Успешно copyAndEdit add Item');
            render(done)
        }).fail(function(){
            assert.ok(false, 'Ошибка при copyAndEdit add Item');
            render(done)
        })
    });

    syncQUnit.addTest('Удаление копии группы', function ( assert )
    {
        var done = assert.async();

        // Предполагается что мы от прошлого теста попали на страницу редактирования пользователя
        // с адресом http://192.168.0.12:8080/?user-5
        var itemId = /inventory\/([0-9]+)/.exec(window.location.href)[1]

        // Удаление пользователя.
        $.when(pmInventories.deleteItem(itemId, true)).done(function()
        {
            assert.ok(true, 'Успешно delete add Item');
            render(done)
        }).fail(function(){
            assert.ok(false, 'Ошибка при delete add Item');
            render(done)
        })
    });

    syncQUnit.addTest('Удаление inventory', function ( assert )
    {
        var done = assert.async();

        // Удаление inventory.
        $.when(pmInventories.deleteItem(itemId, true)).done(function()
        {
            assert.ok(true, 'Успешно delete Item');
            render(done)
        }).fail(function(){
            assert.ok(false, 'Ошибка при delete Item');
            render(done)
        })
    });

    // Инвенторий закодированный в Base64
    var pmInventoriesText = "IyBIb3N0cyAKMS4yLjMuWzE6MjU1XSAKMTI0LjMuNC5bN\
DQ6NTVdIAoxMjQuMy41LlsxOjI1MF0gYW5zaWJsZV9ob3N0PTEwLjIwLjAuMiBhbnNpYmxlX3V\
zZXI9cm9vdCBhbnNpYmxlX3NzaF9wYXNzPWVhZGdiZSBhbnNpYmxlX3NzaF9wcml2YXRlX2tle\
V9maWxlPS9yb290L2YudHh0CjEyNC4zLjUuWzE6MjUxXSBhbnNpYmxlX2hvc3Q9IjEwLjIwLjA\
uMiIgYW5zaWJsZV91c2VyPSdyb290JyBhbnNpYmxlX3NzaF9wYXNzPWVhZGdiZQoxMjQuMy41L\
lsxOjI1Ml0gYW5zaWJsZV9ob3N0PSIxMC5cIjIwXCcuMC4yIiBhbnNpYmxlX3VzZXI9J3Iib1w\
nb3QnIGFuc2libGVfc3NoX3Bhc3M9ZWFkZ2JlCiAgCiMgR2xvYmFsIHZhcnMKW2FsbDp2YXJzX\
QphbnNpYmxlX3VzZXI9Z3JleQphbnNpYmxlX3NzaF9wcml2YXRlX2tleV9maWxlPS90bXAvdG1\
wUlE4ZVRjCmFuc2libGVfc3NoX2V4dHJhX2FyZ3M9LW8gU3RyaWN0SG9zdEtleUNoZWNraW5nP\
W5vIC1vIFVzZXJLbm93bkhvc3RzRmlsZT0vZGV2L251bGwKYW5zaWJsZV9zc2hfcHJpdmF0ZV9\
rZXlfZmlsZT0vcm9vdC9mLnR4dAoKIyBHcm91cHMgCltnaXQ6Y2hpbGRyZW5dCmNpCmdpdC1zZ\
XJ2ZXJzCgoKW2Nsb3VkOmNoaWxkcmVuXQpnaXQKc2VydmljZXMKdGVzdAoKClt0ZXN0XQp0ZXN\
0LnZzdC5sYW4gYW5zaWJsZV91c2VyPWNlbnRvcwp0ZXN0Mi52c3QubGFuIGFuc2libGVfaG9zd\
D0xNzIuMTYuMS4yNgoKW3Rlc3Q6dmFyc10KYW5zaWJsZV9zc2hfcHJpdmF0ZV9rZXlfZmlsZT0\
vcm9vdC9mLnR4dAogCltjaV0KZ2l0LWNpLTEgYW5zaWJsZV9ob3N0PTE3Mi4xNi4xLjEzIGFuc\
2libGVfc3NoX3ByaXZhdGVfa2V5X2ZpbGU9L3Jvb3QvZi50eHQKZ2l0LWNpLTIgYW5zaWJsZV9\
ob3N0PTE3Mi4xNi4xLjE0CgoKW2dpdC1zZXJ2ZXJzXQpnaXQudnN0LmxhbiAKICAKCltzZXJ2a\
WNlc10KY2hhdC52c3Rjb25zdWx0aW5nLm5ldCBhbnNpYmxlX2hvc3Q9MTcyLjE2LjEuMTYKcGl\
wYy52c3QubGFuIApyZWRtaW5lLnZzdC5sYW4gCgoKW29wZW5zdGFja10KZnVlbC52c3QubGFuI\
GFuc2libGVfaG9zdD0xMC4yMC4wLjIgYW5zaWJsZV91c2VyPXJvb3QgYW5zaWJsZV9zc2hfcGF\
zcz1lYWRnYmUKb3MtY29tcHV0ZS0xLnZzdC5sYW4gYW5zaWJsZV9ob3N0PTEwLjIwLjAuOQpvc\
y1jb21wdXRlLTIudnN0LmxhbiBhbnNpYmxlX2hvc3Q9MTAuMjAuMC4xMyBhbnNpYmxlX3NzaF9\
wcml2YXRlX2tleV9maWxlPS9yb290L2YudHh0Cm9zLWNvbnRyb2xsZXItMS52c3QubGFuIGFuc\
2libGVfaG9zdD0xMC4yMC4wLjYKb3MtY29udHJvbGxlci0yLnZzdC5sYW4gYW5zaWJsZV9ob3N\
0PTEwLjIwLjAuOAo="
    pmInventoriesText = Base64.decode(pmInventoriesText)

    /** Оригинал инвентория
     * # Hosts
1.2.3.[1:255]
124.3.4.[44:55]
124.3.5.[1:250] ansible_host=10.20.0.2 ansible_user=root ansible_ssh_pass=eadgbe ansible_ssh_private_key_file=/root/f.txt
124.3.5.[1:251] ansible_host="10.20.0.2" ansible_user='root' ansible_ssh_pass=eadgbe
124.3.5.[1:252] ansible_host="10.\"20\'.0.2" ansible_user='r"o\'ot' ansible_ssh_pass=eadgbe

# Global vars
[all:vars]
ansible_user=grey
ansible_ssh_private_key_file=/tmp/tmpRQ8eTc
ansible_ssh_extra_args=-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null
ansible_ssh_private_key_file=/root/f.txt

# Groups
[git:children]
ci
git-servers


[cloud:children]
git
services
test


[test]
test.vst.lan ansible_user=centos
test2.vst.lan ansible_host=172.16.1.26

[test:vars]
ansible_ssh_private_key_file=/root/f.txt

[ci]
git-ci-1 ansible_host=172.16.1.13 ansible_ssh_private_key_file=/root/f.txt
git-ci-2 ansible_host=172.16.1.14


[git-servers]
git.vst.lan


[services]
chat.vstconsulting.net ansible_host=172.16.1.16
pipc.vst.lan
redmine.vst.lan


[openstack]
fuel.vst.lan ansible_host=10.20.0.2 ansible_user=root ansible_ssh_pass=eadgbe
os-compute-1.vst.lan ansible_host=10.20.0.9
os-compute-2.vst.lan ansible_host=10.20.0.13 ansible_ssh_private_key_file=/root/f.txt
os-controller-1.vst.lan ansible_host=10.20.0.6
os-controller-2.vst.lan ansible_host=10.20.0.8

     */

    syncQUnit.addTest('Открыть inventories/import', function ( assert )
    {
        var done = assert.async();
        $.when(spajs.open({ menuId:"inventories/import"})).done(function()
        {
            assert.ok(true, 'Успешно открыто меню inventories/import');
            render(done)
        }).fail(function()
        {
            assert.ok(false, 'Ошибка при открытиии меню inventories/import');
            render(done)
        })
    });

    var etalon = {
        "hosts": [
          {
            "name": "1.2.3.[1:255]",
            "type": "RANGE",
            "vars": {

            }
          },
          {
            "name": "124.3.4.[44:55]",
            "type": "RANGE",
            "vars": {

            }
          },
          {
            "name": "124.3.5.[1:250]",
            "type": "RANGE",
            "vars": {
              "ansible_host": "10.20.0.2",
              "ansible_user": "root",
              "ansible_ssh_pass": "eadgbe",
              "ansible_ssh_private_key_file": "/root/f.txt"
            }
          },
          {
            "name": "124.3.5.[1:251]",
            "type": "RANGE",
            "vars": {
              "ansible_host": "10.20.0.2",
              "ansible_user": "root",
              "ansible_ssh_pass": "eadgbe"
            }
          },
          {
            "name": "124.3.5.[1:252]",
            "type": "RANGE",
            "vars": {
              "ansible_host": "10.\\\"20\\'.0.2",
              "ansible_user": "r\"o\\'ot",
              "ansible_ssh_pass": "eadgbe"
            }
          }
        ],
        "groups": {
          "git": {
            "vars": {

            },
            "groups": [
              "ci",
              "git-servers"
            ],
            "hosts": [

            ],
            "children": true
          },
          "cloud": {
            "vars": {

            },
            "groups": [
              "git",
              "services",
              "test"
            ],
            "hosts": [

            ],
            "children": true
          },
          "test": {
            "vars": {
              "ansible_ssh_private_key_file": "/root/f.txt"
            },
            "groups": [

            ],
            "hosts": [
              {
                "name": "test.vst.lan",
                "type": "HOST",
                "vars": {
                  "ansible_user": "centos"
                }
              },
              {
                "name": "test2.vst.lan",
                "type": "HOST",
                "vars": {
                  "ansible_host": "172.16.1.26"
                }
              }
            ]
          },
          "ci": {
            "vars": {

            },
            "groups": [

            ],
            "hosts": [
              {
                "name": "git-ci-1",
                "type": "HOST",
                "vars": {
                  "ansible_host": "172.16.1.13",
                  "ansible_ssh_private_key_file": "/root/f.txt"
                }
              },
              {
                "name": "git-ci-2",
                "type": "HOST",
                "vars": {
                  "ansible_host": "172.16.1.14"
                }
              }
            ]
          },
          "git-servers": {
            "vars": {

            },
            "groups": [

            ],
            "hosts": [
              {
                "name": "git.vst.lan",
                "type": "HOST",
                "vars": {

                }
              }
            ]
          },
          "services": {
            "vars": {

            },
            "groups": [

            ],
            "hosts": [
              {
                "name": "chat.vstconsulting.net",
                "type": "HOST",
                "vars": {
                  "ansible_host": "172.16.1.16"
                }
              },
              {
                "name": "pipc.vst.lan",
                "type": "HOST",
                "vars": {

                }
              },
              {
                "name": "redmine.vst.lan",
                "type": "HOST",
                "vars": {

                }
              }
            ]
          },
          "openstack": {
            "vars": {

            },
            "groups": [

            ],
            "hosts": [
              {
                "name": "fuel.vst.lan",
                "type": "HOST",
                "vars": {
                  "ansible_host": "10.20.0.2",
                  "ansible_user": "root",
                  "ansible_ssh_pass": "eadgbe"
                }
              },
              {
                "name": "os-compute-1.vst.lan",
                "type": "HOST",
                "vars": {
                  "ansible_host": "10.20.0.9"
                }
              },
              {
                "name": "os-compute-2.vst.lan",
                "type": "HOST",
                "vars": {
                  "ansible_host": "10.20.0.13",
                  "ansible_ssh_private_key_file": "/root/f.txt"
                }
              },
              {
                "name": "os-controller-1.vst.lan",
                "type": "HOST",
                "vars": {
                  "ansible_host": "10.20.0.6"
                }
              },
              {
                "name": "os-controller-2.vst.lan",
                "type": "HOST",
                "vars": {
                  "ansible_host": "10.20.0.8"
                }
              }
            ]
          }
        },
        "vars": {
          "ansible_user": "grey",
          "ansible_ssh_private_key_file": "/root/f.txt",
          "ansible_ssh_extra_args": "-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"
        }
    }
    var inventory = undefined;

    syncQUnit.addTest('Парсинг inventory', function ( assert )
    {
        var done = assert.async();
        inventory = pmInventories.parseFromText(pmInventoriesText)
        pmInventories.model.importedInventories = []
        pmInventories.model.importedInventories.push({
            inventory:inventory,
            text:pmInventoriesText
        })

        var res = deepEqual(etalon, inventory)
        assert.ok(res, 'Сравнение инвентория распарсенного и оригинального');
        render(done)
    });

    syncQUnit.addTest('Импорт не валидного inventory 1', function ( assert )
    { 
        var done = assert.async();
        $.when(pmInventories.importInventory(inventory)).done(function()
        {
            assert.ok(false, 'Успешно импортирован не валидный инвенторий (а это не правильно)');
            render(done)
        }).fail(function()
        {
            assert.ok(true, 'Ошибка в импорте не валидного инвентория (как и задумано)');
            render(done)
        })
    });

    syncQUnit.addTest('Импорт валидного inventory', function ( assert )
    {
        jsonEditor.jsonEditorRmVar('ansible_ssh_private_key_file', 'inventory') 
        for(var i in inventory.hosts)
        {
            var val = inventory.hosts[i]
            jsonEditor.jsonEditorRmVar('ansible_ssh_private_key_file', 'host'+val.name) 
        }
        for(var i in inventory.groups)
        {
            var val = inventory.groups[i]
            jsonEditor.jsonEditorRmVar('ansible_ssh_private_key_file', "group"+i) 
            
            for(var j in val.hosts)
            {
                var hval = val.hosts[j]
                jsonEditor.jsonEditorRmVar('ansible_ssh_private_key_file', "host"+hval.name) 
            }
        }
         
        var done = assert.async();
        $.when(pmInventories.importInventory(inventory)).done(function()
        {
            assert.ok(true, 'Успешно импортирован инвенторий');
            render(done)
        }).fail(function()
        {
            assert.ok(false, 'Ошибка в импорте инвентория');
            render(done)
        })
    });

    syncQUnit.addTest('Импорт не валидного inventory', function ( assert )
    {
        var done = assert.async();
        inventory.groups["error group"] = {
            "vars": {},
            "groups": [],
            "hosts": [],
            "children": true
        }
 
        $.when(pmInventories.importInventory(inventory)).done(function()
        {
            assert.ok(false, 'Успешно импортирован инвенторий а должна быть ошибка');
            render(done)
        }).fail(function()
        {
            assert.ok(true, 'Ошибка в импорте инвентория как и задумано');
            render(done)
        })

    });

}

/**
 * Тестирование projects
 */
function qunitAddTests_projects()
{
    syncQUnit.addTest('Список проектов', function ( assert )
    {
        var done = assert.async();

        $.when(spajs.open({ menuId:"projects"})).done(function()
        {
            assert.ok(true, 'Успешно открыто меню projects');
            render(done)
        }).fail(function()
        {
            assert.ok(false, 'Ошибка при открытиии меню projects');
            render(done)
        })
    });

    syncQUnit.addTest('Новый проект', function ( assert )
    {
        var done = assert.async();

        // Открытие пункта меню new-project
        $.when(spajs.open({ menuId:"new-project"})).done(function()
        {
            assert.ok(true, 'Успешно открыто меню new-project');
            render(done)
        }).fail(function()
        {
            assert.ok(false, 'Ошибка при открытиии меню new-project');
            render(done)
        })
    });

    var t = new Date();
    t = t.getTime()

    syncQUnit.addTest('Сохранение проекта', function ( assert )
    {
        // Предполагается что мы от прошлого теста попали на страницу создания project
        var done = assert.async();

        // Заполнение формы с данными project
        $("#new_project_name").val("test-project-"+t);
        $("#new_project_repository").val("git://test-project-"+t);

        $("#new_json_name").val("test1");
        $("#new_json_value").val("val1");
        jsonEditor.jsonEditorAddVar();

        $("#new_json_name").val("test2");
        $("#new_json_value").val("val2");
        jsonEditor.jsonEditorAddVar();


        // Отправка формы с данными project
        $.when(pmProjects.addItem()).done(function()
        {
            assert.ok(true, 'Успешно project add Item');
            render(done)
        }).fail(function()
        {
            assert.ok(false, 'Ошибка при project add Item');
            render(done)
        })
    });

    var project_id = undefined
    syncQUnit.addTest('Изменение проекта', function ( assert )
    {
        var done = assert.async();

        // Предполагается что мы от прошлого теста попали на страницу редактирования project
        // с адресом http://192.168.0.12:8080/?group-5
        var itemId = /project\/([0-9]+)/.exec(window.location.href)[1]
        project_id = itemId;

        $("#project_"+itemId+"_name").val("test2-project-"+t);

        $("#new_json_name").val("test3");
        $("#new_json_value").val("val3");
        jsonEditor.jsonEditorAddVar();


        $.when(pmProjects.updateItem(itemId)).done(function()
        {
            assert.ok(true, 'Успешно update add Item');
            render(done)
        }).fail(function(){
            assert.ok(false, 'Ошибка при update add Item');
            render(done)
        })
    });

/*
    syncQUnit.addTest('Проверка добавления невалидных подгрупп к project', function ( assert )
    {
        var done = assert.async();
        var itemId = /project\/([0-9]+)/.exec(window.location.href)[1]
        $.when(pmProjects.addSubGroups(itemId, [999999])).done(function()
        {
            assert.ok(false, 'Ошибка при добавлении подгруппы 999999 вроде бы нет');
            render(done)
        }).fail(function()
        {
            assert.ok(true, 'Проверка добавления невалидных подгрупп успешна');
            render(done)
        })
    })

    syncQUnit.addTest('Проверка добавления невалидных хостов к project', function ( assert )
    {
        var done = assert.async();
        var itemId = /project\/([0-9]+)/.exec(window.location.href)[1]
        $.when(pmProjects.addSubHosts(itemId, [999999])).done(function()
        {
            assert.ok(false, 'Ошибка при добавлении хоста 999999 вроде бы нет');
            render(done)
        }).fail(function()
        {
            assert.ok(true, 'Проверка добавления невалидных хостов успешна');
            render(done)
        })
    })

    syncQUnit.addTest('Проверка добавления невалидных inventory к project', function ( assert )
    {
        var done = assert.async();
        var itemId = /project\/([0-9]+)/.exec(window.location.href)[1]
        $.when(pmProjects.addSubInventories(itemId, [999999])).done(function()
        {
            assert.ok(false, 'Ошибка при добавлении inventory 999999 вроде бы нет');
            render(done)
        }).fail(function()
        {
            assert.ok(true, 'Проверка добавления невалидных inventory успешна');
            render(done)
        })
    })
*/
    syncQUnit.addTest('Страница Run playbook', function ( assert )
    {
        var done = assert.async();
        var itemId = /project\/([0-9]+)/.exec(window.location.href)[1]
        $.when(spajs.open({ menuId:'project/'+itemId+'/playbook/run'})).done(function()
        {
            assert.ok(true, 'Страница открылась');
            render(done)
        }).fail(function()
        {
            assert.ok(false, 'Страница не открылась');
            render(done)
        })
    })

    syncQUnit.addTest('Страница Execute ansible module', function ( assert )
    {
        var done = assert.async();
        var itemId = /project\/([0-9]+)/.exec(window.location.href)[1]
        $.when(spajs.open({ menuId:'project/'+itemId+'/ansible-module/run'})).done(function()
        {
            assert.ok(true, 'Страница открылась');
            render(done)
        }).fail(function()
        {
            assert.ok(false, 'Страница не открылась');
            render(done)
        })
    })

    syncQUnit.addTest('Страница periodic-tasks', function ( assert )
    {
        var done = assert.async();
        var itemId = /project\/([0-9]+)/.exec(window.location.href)[1]
        $.when(spajs.open({ menuId:'project/'+itemId+'/periodic-tasks'})).done(function()
        {
            assert.ok(true, 'Страница открылась');
            render(done)
        }).fail(function()
        {
            assert.ok(false, 'Страница не открылась');
            render(done)
        })
    })
/*
    syncQUnit.addTest('Страница нового inventory для проекта', function ( assert )
    {
        var done = assert.async();

        var itemId = /project\/([0-9]+)/.exec(window.location.href)[1]
        // Открытие пункта меню new-inventory
        $.when(spajs.open({ menuId:'project/'+itemId+"/new-inventory"})).done(function()
        {
            assert.ok(true, 'Успешно открыто меню new-inventory');
            render(done)
        }).fail(function()
        {
            assert.ok(false, 'Ошибка при открытиии меню new-inventory');
            render(done)
        })
    });

    var t = new Date();
    t = t.getTime()

    syncQUnit.addTest('Сохранение нового inventory', function ( assert )
    {
        // Предполагается что мы от прошлого теста попали на страницу создания inventory
        var done = assert.async();

        // Заполнение формы с данными inventory
        $("#new_inventory_name").val("test-inventory-"+t);

        $("#new_json_name").val("test1");
        $("#new_json_value").val("val1");
        jsonEditor.jsonEditorAddVar();

        $("#new_json_name").val("test2");
        $("#new_json_value").val("val2");
        jsonEditor.jsonEditorAddVar();


        var itemId = /project\/([0-9]+)/.exec(window.location.href)[1]
        // Отправка формы с данными inventory
        $.when(pmInventories.addItem('project', itemId)).done(function()
        {
            assert.ok(true, 'Успешно inventory add Item');
            render(done)
        }).fail(function()
        {
            assert.ok(false, 'Ошибка при inventory add Item');
            render(done)
        })
    });
*/
    syncQUnit.addTest('Страница нового inventory', function ( assert )
    {
        var done = assert.async();

        // Открытие пункта меню new-inventory
        $.when(spajs.open({ menuId:"new-inventory"})).done(function()
        {
            assert.ok(true, 'Успешно открыто меню new-inventory');
            render(done)
        }).fail(function()
        {
            assert.ok(false, 'Ошибка при открытиии меню new-inventory');
            render(done)
        })
    });

    var inventory_id = undefined;
    syncQUnit.addTest('Сохранение нового inventory', function ( assert )
    {
        // Предполагается что мы от прошлого теста попали на страницу создания inventory
        var done = assert.async();

        // Заполнение формы с данными inventory
        $("#new_inventory_name").val("test-inventory-"+t);

        $("#new_json_name").val("test1");
        $("#new_json_value").val("val1");
        jsonEditor.jsonEditorAddVar();

        $("#new_json_name").val("test2");
        $("#new_json_value").val("val2");
        jsonEditor.jsonEditorAddVar();


        // Отправка формы с данными inventory
        $.when(pmInventories.addItem()).done(function()
        {
            inventory_id = /inventory\/([0-9]+)/.exec(window.location.href)[1]
            assert.ok(true, 'Успешно inventory add Item');
            render(done)
        }).fail(function()
        {
            assert.ok(false, 'Ошибка при inventory add Item');
            render(done)
        })
    });


    syncQUnit.addTest('Страница Create new periodic task', function ( assert )
    {
        var done = assert.async();
        $.when(spajs.open({ menuId:'project/'+project_id+'/new-periodic-tasks'})).done(function()
        {
            assert.ok(true, 'Страница открылась');
            render(done)
        }).fail(function()
        {
            assert.ok(false, 'Страница не открылась');
            render(done)
        })
    })


    syncQUnit.addTest('Создание periodic task', function ( assert )
    {
        // Предполагается что мы от прошлого теста попали на страницу создания project
        var done = assert.async();

        // Заполнение формы с данными project
        $("#new_periodic-tasks_name").val("test-project-"+t);
        $("#new_periodic-tasks_playbook").val("test-project-"+t);

        $("#new_periodic-tasks_schedule_INTERVAL").val(t);

        $("#new_json_name").val("test1");
        $("#new_json_value").val("val1");
        jsonEditor.jsonEditorAddVar();

        $("#new_json_name").val("test2");
        $("#new_json_value").val("val2");
        jsonEditor.jsonEditorAddVar();

        var itemId = /project\/([0-9]+)/.exec(window.location.href)[1]
        var inventoryId = $("#new_periodic-tasks_inventory option")[2].value

        $.when(pmPeriodicTasks.selectInventory(inventoryId)).done(function()
        {
            $("#new_periodic-tasks_inventory").val(inventoryId)

            // Отправка формы с данными project
            $.when(pmPeriodicTasks.addItem(itemId)).done(function()
            {
                assert.ok(true, 'Успешно project add pmPeriodicTasks');
                render(done)
            }).fail(function()
            {
                assert.ok(false, 'Ошибка при project add pmPeriodicTasks');
                render(done)
            })
        }).fail(function()
        {
            assert.ok(false, 'Ошибка при selectInventory');
        })
    });

    syncQUnit.addTest('Изменение periodic task', function ( assert )
    {
        var itemId = /project\/([0-9]+)/.exec(window.location.href)[1]
        var taskId = /periodic-task\/([0-9]+)/.exec(window.location.href)[1]
        // Предполагается что мы от прошлого теста попали на страницу создания inventory
        var done = assert.async();

        // Заполнение формы с данными inventory
        $("#periodic-tasks_"+taskId+"_name").val("test-task2-"+t);

        $("#new_json_name").val("test1");
        $("#new_json_value").val("val1");
        jsonEditor.jsonEditorAddVar();

        $("#new_json_name").val("test2");
        $("#new_json_value").val("val2");
        jsonEditor.jsonEditorAddVar();


        // Отправка формы с данными inventory
        $.when(pmPeriodicTasks.updateItem(taskId)).done(function()
        {
            assert.ok(true, 'Успешно update Periodic Task');
            render(done)
        }).fail(function()
        {
            assert.ok(false, 'Ошибка при update Periodic Task');
            render(done)
        })
    });

    var taskId = undefined
    syncQUnit.addTest('Копирование Periodic Task', function ( assert )
    {
        // Предполагается что мы от прошлого теста попали на страницу редактирования группы
        // с адресом http://192.168.0.12:8080/?group-5
        taskId = /periodic-task\/([0-9]+)/.exec(window.location.href)[1]

        var done = assert.async();
        $.when(pmPeriodicTasks.copyAndEdit(taskId)).done(function()
        {
            assert.ok(true, 'Успешно copyAndEdit add Item');
            render(done)
        }).fail(function(){
            assert.ok(false, 'Ошибка при copyAndEdit add Item');
            render(done)
        })
    });

    syncQUnit.addTest('Удаление копии Periodic Task', function ( assert )
    {
        var done = assert.async();

        // Предполагается что мы от прошлого теста попали на страницу редактирования пользователя
        // с адресом http://192.168.0.12:8080/?user-5
        var taskId = /periodic-task\/([0-9]+)/.exec(window.location.href)[1]

        // Удаление пользователя.
        $.when(pmPeriodicTasks.deleteItem(taskId, true)).done(function()
        {
            assert.ok(true, 'Успешно delete add Item');
            render(done)
        }).fail(function(){
            assert.ok(false, 'Ошибка при delete add Item');
            render(done)
        })
    });

    syncQUnit.addTest('Удаление periodic task', function ( assert )
    {
        var done = assert.async();

        // Удаление project.
        $.when(pmPeriodicTasks.deleteItem(taskId, true)).done(function()
        {
            assert.ok(true, 'Успешно delete Item');
            render(done)
        }).fail(function(){
            assert.ok(false, 'Ошибка при delete Item');
            render(done)
        })
    });

    syncQUnit.addTest('Страница списка periodic task', function ( assert )
    {
        var done = assert.async();
        var itemId = /project\/([0-9]+)/.exec(window.location.href)[1]
        $.when(spajs.open({ menuId:'project/'+itemId+'/periodic-tasks'})).done(function()
        {
            assert.ok(true, 'Страница открылась');
            render(done)
        }).fail(function()
        {
            assert.ok(false, 'Страница не открылась');
            render(done)
        })
    })

    syncQUnit.addTest('Удаление проекта', function ( assert )
    {
        var done = assert.async();

        // Предполагается что мы от прошлого теста попали на страницу редактирования project
        // с адресом http://192.168.0.12:8080/?project-5
        var itemId = /project\/([0-9]+)/.exec(window.location.href)[1]

        // Удаление project.
        $.when(pmProjects.deleteItem(itemId, true)).done(function()
        {
            assert.ok(true, 'Успешно delete Item');
            render(done)
        }).fail(function(){
            assert.ok(false, 'Ошибка при delete Item');
            render(done)
        })
    });
}

function qunitAddTests_templates_task(){

    syncQUnit.addTest('Список шаблонов', function ( assert )
    {
        var done = assert.async();

        $.when(spajs.open({ menuId:"templates"})).done(function()
        {
            assert.ok(true, 'Успешно открыто меню templates');
            render(done)
        }).fail(function()
        {
            assert.ok(false, 'Ошибка при открытиии меню templates');
            render(done)
        })
    });

    syncQUnit.addTest('Новый template/new-task', function ( assert )
    {
        var done = assert.async();

        // Открытие пункта меню new-project
        $.when(spajs.open({ menuId:"template/new-task"})).done(function()
        {
            assert.ok(true, 'Успешно открыто меню new-project');
            render(done)
        }).fail(function()
        {
            assert.ok(false, 'Ошибка при открытиии меню new-project');
            render(done)
        })
    });

    var t = new Date();
    t = t.getTime()

    syncQUnit.addTest('Сохранение шаблона задачи', function ( assert )
    {
        // Предполагается что мы от прошлого теста попали на страницу создания project
        var done = assert.async();

        // Заполнение формы с данными project
        $("#Templates-name").val("test-template-"+t);

        // Отправка формы с данными project
        $.when(pmTasksTemplates.addItem()).done(function()
        {
            assert.ok(true, 'Успешно template add Item');
            render(done)
        }).fail(function()
        {
            assert.ok(false, 'Ошибка при template add Item');
            render(done)
        })
    });

    syncQUnit.addTest('Изменение шаблона', function ( assert )
    {
        var done = assert.async();

        // Предполагается что мы от прошлого теста попали на страницу редактирования project
        // с адресом http://192.168.0.12:8080/?group-5
        var itemId = /template\/Task\/([0-9]+)/.exec(window.location.href)[1]

        $("#playbook-autocomplete").val("test2-playbook-"+t);

        $("#new_json_name").val("test3");
        $("#new_json_value").val("val3");
        jsonEditor.jsonEditorAddVar();


        $.when(pmTasksTemplates.updateItem(itemId)).done(function()
        {
            assert.ok(true, 'Успешно update add Item');
            render(done)
        }).fail(function(){
            assert.ok(false, 'Ошибка при update add Item');
            render(done)
        })
    });

    var itemId = undefined
    syncQUnit.addTest('Копирование template Task', function ( assert )
    {
        // Предполагается что мы от прошлого теста попали на страницу редактирования группы
        // с адресом http://192.168.0.12:8080/?group-5
        itemId = /template\/Task\/([0-9]+)/.exec(window.location.href)[1]

        var done = assert.async();
        $.when(pmTasksTemplates.copyAndEdit(itemId)).done(function()
        {
            assert.ok(true, 'Успешно copyAndEdit add Item');
            render(done)
        }).fail(function(){
            assert.ok(false, 'Ошибка при copyAndEdit add Item');
            render(done)
        })
    });

    syncQUnit.addTest('Удаление копии template Task', function ( assert )
    {
        var done = assert.async();

        // Предполагается что мы от прошлого теста попали на страницу редактирования пользователя
        // с адресом http://192.168.0.12:8080/?user-5
        var itemId = /template\/Task\/([0-9]+)/.exec(window.location.href)[1]

        // Удаление пользователя.
        $.when(pmTasksTemplates.deleteItem(itemId, true)).done(function()
        {
            assert.ok(true, 'Успешно delete add Item');
            render(done)
        }).fail(function(){
            assert.ok(false, 'Ошибка при delete add Item');
            render(done)
        })
    });

    syncQUnit.addTest('Удаление шаблона', function ( assert )
    {
        var done = assert.async();

        // Удаление project.
        $.when(pmTasksTemplates.deleteItem(itemId, true)).done(function()
        {
            assert.ok(true, 'Успешно delete Item');
            render(done)
        }).fail(function(){
            assert.ok(false, 'Ошибка при delete Item');
            render(done)
        })
    });
}

function qunitAddTests_templates_modules(){

    syncQUnit.addTest('Список шаблонов', function ( assert )
    {
        var done = assert.async();

        $.when(spajs.open({ menuId:"templates"})).done(function()
        {
            assert.ok(true, 'Успешно открыто меню templates');
            render(done)
        }).fail(function()
        {
            assert.ok(false, 'Ошибка при открытиии меню templates');
            render(done)
        })
    });

    syncQUnit.addTest('Новый template/new-module', function ( assert )
    {
        var done = assert.async();

        // Открытие пункта меню new-project
        $.when(spajs.open({ menuId:"template/new-module"})).done(function()
        {
            assert.ok(true, 'Успешно открыто меню new-project');
            render(done)
        }).fail(function()
        {
            assert.ok(false, 'Ошибка при открытиии меню new-project');
            render(done)
        })
    });

    var t = new Date();
    t = t.getTime()

    syncQUnit.addTest('Сохранение шаблона модуля', function ( assert )
    {
        // Предполагается что мы от прошлого теста попали на страницу создания project
        var done = assert.async();

        // Заполнение формы с данными project
        $("#Templates-name").val("test-template-"+t);

        // Отправка формы с данными project
        $.when(pmModuleTemplates.addItem()).done(function()
        {
            assert.ok(true, 'Успешно template add Item');
            render(done)
        }).fail(function()
        {
            assert.ok(false, 'Ошибка при template add Item');
            render(done)
        })
    });

    syncQUnit.addTest('Изменение шаблона модуля', function ( assert )
    {
        var done = assert.async();

        // Предполагается что мы от прошлого теста попали на страницу редактирования project
        // с адресом http://192.168.0.12:8080/?group-5
        var itemId = /template\/Module\/([0-9]+)/.exec(window.location.href)[1]

        $("#module-autocomplete").val("test2-playbook-"+t);

        $("#new_json_name").val("test3");
        $("#new_json_value").val("val3");
        jsonEditor.jsonEditorAddVar();


        $.when(pmModuleTemplates.updateItem(itemId)).done(function()
        {
            assert.ok(true, 'Успешно update add Item');
            render(done)
        }).fail(function(){
            assert.ok(false, 'Ошибка при update add Item');
            render(done)
        })
    });

    var itemId = undefined
    syncQUnit.addTest('Копирование template Module', function ( assert )
    {
        // Предполагается что мы от прошлого теста попали на страницу редактирования группы
        // с адресом http://192.168.0.12:8080/?group-5
        itemId = /template\/Module\/([0-9]+)/.exec(window.location.href)[1]

        var done = assert.async();
        $.when(pmModuleTemplates.copyAndEdit(itemId)).done(function()
        {
            assert.ok(true, 'Успешно copyAndEdit add Item');
            render(done)
        }).fail(function(){
            assert.ok(false, 'Ошибка при copyAndEdit add Item');
            render(done)
        })
    });

    syncQUnit.addTest('Удаление копии template Module', function ( assert )
    {
        var done = assert.async();

        // Предполагается что мы от прошлого теста попали на страницу редактирования пользователя
        // с адресом http://192.168.0.12:8080/?user-5
        var itemId = /template\/Module\/([0-9]+)/.exec(window.location.href)[1]

        // Удаление пользователя.
        $.when(pmModuleTemplates.deleteItem(itemId, true)).done(function()
        {
            assert.ok(true, 'Успешно delete add Item');
            render(done)
        }).fail(function(){
            assert.ok(false, 'Ошибка при delete add Item');
            render(done)
        })
    });

    syncQUnit.addTest('Удаление шаблона', function ( assert )
    {
        var done = assert.async();

        // Удаление project.
        $.when(pmModuleTemplates.deleteItem(itemId, true)).done(function()
        {
            assert.ok(true, 'Успешно delete Item');
            render(done)
        }).fail(function(){
            assert.ok(false, 'Ошибка при delete Item');
            render(done)
        })
    });
}


function qunitAddTests_history()
{
    syncQUnit.addTest('Страница history', function ( assert )
    {
        var done = assert.async();

        $.when(spajs.open({ menuId:"history"})).done(function()
        {
            assert.ok(true, 'Успешно открыто меню history');
            render(done)
        }).fail(function()
        {
            assert.ok(false, 'Ошибка при открытиии меню history');
            render(done)
        })
    });

    syncQUnit.addTest('Страница history', function ( assert )
    {
        var done = assert.async();

        if(!pmHistory.model.itemslist.results.length)
        {
            assert.ok(true, 'Нет истории.');
            render(done)
        }

        $.when(spajs.open({ menuId:"history/"+pmHistory.model.itemslist.results[0].id+"/"})).done(function()
        {
            assert.ok(true, 'Успешно открыта страница history');
            render(done)
        }).fail(function()
        {
            assert.ok(false, 'Ошибка при открытиии страницы '+pmHistory.model.itemslist.results[0].id+' history');
            render(done)
        })
    });

}

    injectQunit()