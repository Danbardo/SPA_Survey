// Create database
var url="https://.....";
function initDB(){
      try {
          if (!window.openDatabase) {
              alertt("You will be unable to effectively use this application.","Database Unsupported","Okay");
          } else {
              var shortName = 'SurveyDB';
              var version = 1;
              var displayName = 'SurveyDB';
              var maxSize = 5 * 1024 * 1024; // in bytes (50mb)
              db = openDatabase(shortName, version, displayName, maxSize);
              createTables();
			  setInterval(function(){datatoSend();},30*1000);
			  setInterval(function(){checkNot();},3*60*1000);
          }
      } catch(e) {
          alertPop("Please load this page in Safari or Google Chrome. <br><br> If you continue you will not be able to save any surveys.","Database Error");
      }
}
// Create tables in database
function createTables(){
      db.transaction(
         function (transaction) {
            transaction.executeSql('CREATE TABLE IF NOT EXISTS survey (id,uid,uname,created,walanga,aot,uni,postcode,age,family,money,location,entry,sent);',
			 [], dbSuccess, dbError);
         }
      );
}
function dbSuccess(transaction, results){
	notSent();
}
function dbError(transaction, error) {
	console.log(error.message);
}
function addSurvey(s){// This takes an input 'hours', which is the time they selected and saves it into the database
		db.transaction(
         function (transaction) { // -1 means N/A
       transaction.executeSql(s,
			 [], addedSurvey, errorPop('An unexpected error occured while saving your survey.'));
         });
}
function addedSurvey(transaction, results){
	alertPop('Thank you for completing our survey.',"Survey");
	resetForm();
	setTimeout(function(){notSent();},4000);
	datatoSend();
}
function errorPop(msg){
	return function(t,r){
		alertPop(msg,"Unexpected Error");
	}
}
function notSent(){
		db.transaction(
         function (transaction) {
            transaction.executeSql('SELECT * FROM survey WHERE sent=0',
			 [], notSentt, dbError); //then it runs sendData
		 }
		 );
}
function checkNot(){
	nots=true;
	notSent();
}
nots=false;
function notSentt(t,r){
	if(r.rows.length>0){
		_('saved').innerHTML='There are '+r.rows.length+' surveys which have not been backed up.';
		if(nots){
			alertPop('There are '+r.rows.length+' surveys which have not been backed up. <br><br> Please ensure that your device is connected to the internet. <br><br> Surveys are backed up every 30 seconds but can be forced on the Settings page.','Backup Surveys');
		}
		nots=false;
	}else{
		_('saved').innerHTML='All surveys collected have been saved successfully.';
	}
}
var sett=false;
function datatoSend(){
		db.transaction(
         function (transaction) {
            transaction.executeSql('SELECT * FROM survey WHERE sent=0',
			 [], sendData, dbError); //then it runs sendData
		 }
		 );
}
function sendData(transaction,result){ //we put in these parameters because we need the results from datatoSend();
		if(result.rows.length >0){ //so if there is rows more than 0 than run everything below if not do nothing.
			var ent={}; // create an empty object (different type of array)
			for ( var i = 0; i < result.rows.length; i++){ // for i starting from 0 and i always less than 2 do everything inside the brackets and each time you finish add 1 to i. once i is 2 or bigger stop.
					ent['row'+i] = {
						id:result.rows.item(i).id,
						uid:result.rows.item(i).uid,
						uname:result.rows.item(i).uname,
						created:result.rows.item(i).created,
						aot:result.rows.item(i).aot,
						uni:result.rows.item(i).uni,
						postcode:result.rows.item(i).postcode,
						age:result.rows.item(i).age,
						family:result.rows.item(i).family,
						money:result.rows.item(i).money,
						location:result.rows.item(i).location,
						entry:result.rows.item(i).entry
					};
			}
			var data=JSON.stringify(ent);
			$.ajax({
				type: "POST",
				url: url+"/save.php",
				data: "msg="+data,
				success: function (r) {
					console.log(r);
				   if(r=="success"){ //this checks to see if it sent ok to the server and if it did it will delete the rows it sent
					  db.transaction(
						function (transaction) {
						transaction.executeSql('update survey set sent=1', //this is the search it does to make sure it deleted everything ok
						[], dbSuccess, dbError);
						 }
						);
						if(sett){
							alertPop('All surveys collected by this device have been saved.',"Survey Backup Success");
						}
						sett=false;
					}else{
						if(sett){
							alertPop('An error occured while backing up the surveys collected by this device. <br><br>  Please make sure that the device is connected to the internet. <br><br> If this problem persists refresh the page or contact 0416303014.',"Survey Backup Error");
						}
						sett=false;
					}

				},
				error: function () {
						if(sett){
							alertPop('An error occured while backing up the surveys collected by this device. <br><br>  Please make sure that the device is connected to the internet. <br><br>  If this problem persists refresh the page or contact 0416303014.',"Survey Backup Error");
						}
						sett=false;
				}
			});
		}else{
			if(sett){
				alertPop('All surveys collected by this device have been saved.',"Survey Backup Success");
			}
			sett=false;
		}
}
