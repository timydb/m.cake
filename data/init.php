<?php
	$conn=mysqli_connect(SAE_MYSQL_HOST_M,SAE_MYSQL_USER,SAE_MYSQL_PASS,SAE_MYSQL_DB,SAE_MYSQL_PORT);
	$sql="SET NAMES UTF8";
	mysqli_query($conn,$sql);
?>