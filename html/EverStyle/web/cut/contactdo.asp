<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<%
'on error resume next
'發件人的E-MAIL地址

mailtitle ="Ever Style柏泰-聯絡我們信件"

mailcontext = "<html>"
mailcontext = mailcontext & "<head>"
mailcontext = mailcontext & "<meta http-equiv='Content-Type' content='text/html; charset=big5'>"
mailcontext = mailcontext & "</head>"

mailcontext = mailcontext & "	<table width='800' border=1 style='FONT-SIZE: 11pt;FONT-FAMILY:Tahoma,Arial'>"
mailcontext = mailcontext & "	<tr valign=top>"
mailcontext = mailcontext & "	<td width='100'>姓名：</td>"
mailcontext = mailcontext & "	<td>" & trim(request("cname")) &"</td>"
mailcontext = mailcontext & "	</tr>"

mailcontext = mailcontext & "	<tr valign=top>"
mailcontext = mailcontext & "	<td>手機：</td>"
mailcontext = mailcontext & "	<td>" & trim(request("cmob")) &"</td>"
mailcontext = mailcontext & "	</tr>"

mailcontext = mailcontext & "	<tr valign=top>"
mailcontext = mailcontext & "	<td>信箱：</td>"
mailcontext = mailcontext & "	<td>" & trim(request("cemail")) &"</td>"
mailcontext = mailcontext & "	</tr>"

mailcontext = mailcontext & "	<tr valign=top>"
mailcontext = mailcontext & "	<td>主旨：</td>"
mailcontext = mailcontext & "	<td>" & trim(request("ctitle")) &"</td>"
mailcontext = mailcontext & "	</tr>"

cnote = trim(request("cnote"))

 if cnote<>"" then
 cnote= replace(cnote,vbcrlf,"<BR>")
 end if
						
mailcontext = mailcontext & "	<tr valign=top>"
mailcontext = mailcontext & "	<td>內容：</td>"
mailcontext = mailcontext & "	<td>" & cnote &"</td>"
mailcontext = mailcontext & "	</tr>"

mailcontext = mailcontext & "	</table>"
mailcontext = mailcontext & "</body>"
mailcontext = mailcontext & "</html>"


strYouEmail = "may.liaw@netdoing.com.tw;jeff@everstyle.com"
sch = "http://schemas.microsoft.com/cdo/configuration/"
Set cdoConfig = Server.CreateObject("CDO.Configuration")
cdoConfig.Fields.Item(sch & "sendusing") = 2 '## (1) 使用 local SMTP, (2) 為外部 SMTP
cdoConfig.Fields.Item(sch & "smtpserver") = "smtp.gmail.com" 
cdoConfig.Fields.Item(sch & "smtpserverport") = 465 '## SMTP Server Port (預設即為 25)  465  587
cdoConfig.Fields.Item(sch & "smtpauthenticate") = 1 '## cdoBasic 基本驗證
cdoConfig.Fields.Item(sch & "smtpusessl") = true
cdoConfig.Fields.Item(sch & "sendusername") = "everstyle168@gmail.com" '## 帳號
cdoConfig.Fields.Item(sch & "sendpassword") = "gwojfvlxfhlcrbji" '## 密碼
cdoConfig.Fields.Update
Set cdoMessage = Server.CreateObject("CDO.Message")
Set cdoMessage.Configuration = cdoConfig
cdoMessage.From =  "everstyle168@gmail.com"
cdoMessage.To = strYouEmail '## 收件者
'cdoMessage.CC = strYouEmail '## 副本
cdoMessage.Subject = mailtitle
cdoMessage.BodyPart.Charset = "UTF-8"
cdoMessage.HTMLBody = mailcontext '## HTML 網頁格式信件
cdoMessage.Send
Set cdoMessage = Nothing
Set cdoConfig = Nothing

Response.write "<body onload=javascript:alert('已收到此訊息，我們將盡快跟您聯繫！');window.location.href='page-contact.html';>"
Response.End
	
%>
