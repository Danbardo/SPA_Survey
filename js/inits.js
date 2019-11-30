var db;
var id='n',uname='n';
var dev='n';
var title="Survey";
if(/(android)/i.test(navigator.userAgent)){
	dev='android';
}else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)){
	dev='ios';
}else{
	dev='other';
}
function resize(){
	if($(window).height()>$(window).width()){
		document.body.style.fontSize=Math.floor(16*$(window).height()/937)+"px";
	}else{
		document.body.style.fontSize=Math.floor(15*$(window).width()/937)+"px";
	}
	$(".overlay").css("min-height",$(window).height()+'px');
	$('#main').trigger( "updatelayout" );
}
function cookie(code){
	return window.localStorage.getItem(code);
}
function setCookie(code,val){
	window.localStorage.setItem(code,val);
}
if(cookie('F_userid')==null){
	id=uniq();
	setCookie('F_userid',id);
}else{
	id=cookie('F_userid');
}
function changeSelect(id,val){
	$('#'+id+' option').prop('selected', false)
					   .filter('[value="'+val+'"]')
					   .prop('selected', true);
	$('#'+id+'').selectmenu("refresh", true);
}
function flip(id,val){
	$('#'+id).val(val).slider("refresh");
}

function init(){
	resize();
	if(dev!='android'){
		FastClick.attach(document.body);
	}else{
		$("select").on('vmousedown', function(e) { $(this).focus().click(); });
	}
	$('.ui-panel-dismiss').click(
		function(){$("#left-panel").panel("close");}
	);
	$( "input[type=text],input[type=number],textarea" ).focus(function() {
		setTimeout(function(){$('.popup').popup('reposition', 'positionTo: window');},500);
	});
	$( "input[type=text],input[type=number],textarea" ).blur(function() {
		setTimeout(function(){$('.popup').popup('reposition', 'positionTo: window');},500);
	});
	$(document).on("popupafteropen", function() {
	    setTimeout(function(){$('.popup').popup('reposition', 'positionTo: window')},200);
	});
	initDB();
	if(cookie('F_username')==null){
		openPopup('loginpop');
	}else{
		uname=cookie('F_username');
		_('unamewrap').innerHTML="You are currently logged in as "+uname+".";
	}
}
function login(){
	uname=_('unametxt').value;
	_('unamewrap').innerHTML="You are currently logged in as "+uname+".";
	setCookie("F_username",uname);
	closePopup('loginpop');
	_('unametxt').value='';
}
function uniq() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+S4()+S4());
}
function _(id) {
	return document.getElementById(id);
}
function openPopup(id){
	$('#'+id).popup('open',{transition: 'pop'});
}
function closePopup(id){
	$('#'+id).popup('close',{transition: 'pop'});
}
Date.prototype.yyyymmdd = function() {
	var yyyy = this.getFullYear().toString();
	var mm = (this.getMonth()+1).toString();
	var dd  = this.getDate().toString();
	return yyyy +'-'+ (mm[1]?mm:"0"+mm[0]) + '-'+(dd[1]?dd:"0"+dd[0]);
};
function switchPop(fid,sw){
	closePopup(fid);
	setTimeout(function(){openPopup(sw)},500);
}
function openPage(id){
	$('.apppage').hide();
	$('#'+id).show();
}
function check(id,c){
	if(c==1){
		$("#"+id+'y').prop("checked",true).checkboxradio("refresh");
		$("#"+id+'n').prop("checked",false).checkboxradio("refresh");
	}else{
		$("#"+id+'y').prop("checked",false).checkboxradio("refresh");
		$("#"+id+'n').prop("checked",true).checkboxradio("refresh");
	}
	_(id).innerHTML=c;
}
function resetForm(){
	$("input[type='checkbox']").prop("checked",false).checkboxradio("refresh");
	$(".checks").html('');
	$(".inputs").val('');
}
function otherCheck(id){
	if(_(id).value=='other'){
		$('#'+id+'other').show();
	}else{
		$('#'+id+'other').hide();
	}
}
function checkemail(mail){
	var em = _(mail);
	var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!filter.test(em.value)) {
		// bad email
		return false;
	} else {
		return true;
	}
}
function alertPop(msg,title){
	_('alerth').innerHTML=title;
	_('alertIn').innerHTML=msg;
	openPopup("alertpop");
}
function save(){
	var sql="insert into survey (id,uid,uname,created,aot,uni,family,money,location,entry,postcode,age,sent) VALUES ('"+uniq()+"', '"+id+"', '"+uname+"', datetime('now','localtime')";
	var nocomp=true;
	// Check if at least yes or no was clicked
	$('.checks').each(
		function(i,e){
			if($(e).html()==''){
				nocomp=false;
				console.log(e);
			}else{
				var v=Number($(e).html());
				var s=","+v;
				sql+=s;
			}
		}
	)
	$('.unir').find('input').each(function(i,e){
		var u=0;
		if($(e).prop("checked")){
			u=1;
		}
		var s=","+u;
		sql+=s;
	});
	var p=$('#postcode').val();
	var age=$('#age').val();
	if(p.length<1||age.length<1){
		nocomp=false;
	}
	if(!nocomp){
		alertPop("Please complete the survey.","Action Required");
		return false;
	}
	sql+=",'"+p+"','"+age+"',0)";
	addSurvey(sql);
}
