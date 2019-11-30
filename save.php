<?

header('Access-Control-Allow-Methods: GET, POST');

if(isset($_POST['msg'])){

	$data=$_POST['msg'];
	$json=json_decode($data, true);

	$counting = count($json);
	$err=false;
	for ($i = 0; $i < $counting; $i++){
		$id=$json['row'.$i]['id'];
		$uid=$json['row'.$i]['uid'];
		$uname=$json['row'.$i]['uname'];
		$created=$json['row'.$i]['created'];
		$postcode=$json['row'.$i]['age'];
		$age=$json['row'.$i]['age'];
		$aot=$json['row'.$i]['aot'];
		$uni=$json['row'.$i]['uni'];
		$family=$json['row'.$i]['family'];
		$money=$json['row'.$i]['money'];
		$entry=$json['row'.$i]['entry'];
		$location=$json['row'.$i]['location'];
		$sql="INSERT INTO wm_fest SET id=$id, uid=$uid, uname=$uname, created=$created,postcode=$postcode, age=$age, uni=$uni, aot=$aot, family=$family, money=$money, entry=$entry, location=$location";

		// Call to DB

	}
	if($err){
		echo 'error';
	}else{
		echo 'success';
	}
	exit();
}else{
	exit();
}


?>
