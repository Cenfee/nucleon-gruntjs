function login()
{
	var userName = document.getElementById("main-name").value;
	var password = document.getElementById("main-password").value;
	
	if( userName == "" || userName == null )
	{
		alert("用户名不能为空");
		return false;
	}
	
	if( password == "" || password == null )
	{
		alert("密码不能为空");
		return false;
	}

	var url = "http://report.stbl.cc/shSystem/s/shSystem/login.php"
	$.ajax({
    url: url,    //请求的url地址
    async: true, //请求是否异步，默认为异步，这也是ajax重要特性
    data: {account:userName,password:password},    //参数值
    type: "POST",   //请求方式
    beforeSend: function() {
        //请求前的处理
    },
    success: function(data) {
        //请求成功时处理

		//json字符串转为json对象
		var jsonData = eval('(' + data + ')');
		if( jsonData.result == 1 )//登录成功
		{
			if(jsonData.userId)
			{
				//保存用户账号
				$.cookie("account",userName,{path:'/',expires:7});
				
				//设置cookie保存用户信息
				$.cookie("userId",jsonData.userId,{path:'/'});
				var   userId = $.cookie('userId');
				//window.open("finance_list.html");
				//window.location.href="./finance_list.html";
				window.location.href="http://report.stbl.cc/shSystem/s/shSystem/toWX.php?userId="+userId;
			}
			else
			{
				alert("用户不存在！");
			}
		}
		else
		{
			//登录失败
			alert(jsonData.msg);
		}
    },
    complete: function() {
        //请求完成的处理);
    },
    error: function(e) {
        //请求出错处理
		alert("登录出错！");
    }
	});
			
}

//设置用户账号
function setAccount()
{
	var account = $.cookie('account');
	if( account )
	{
		document.getElementById("main-name").value = account;
	}
}

setAccount();

var loginBtn = document.getElementById("bottom-login")
loginBtn.onclick = login

