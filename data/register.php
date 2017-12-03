<?php
	header("content-type:application/json;charset=utf-8");
	@$user_name=$_REQUEST['user_name'];
	@$pwd=$_REQUEST['pwd'];
	@$phone=$_REQUEST['phone'];
	@$email=$_REQUEST['email'];
	require('init.php');
	$sql="INSERT INTO t_user VALUES(null,'$user_name','$pwd','$phone','$email')";
	$result=mysqli_query($conn,$sql);
	$output=[];
	if($result===true){
		$output['code']=1;
		$output['msg']='注册成功';
	}else{
		$output['code']=-1;
		$output['msg']='注册失败';
	}
	echo json_encode($output);
?>