<?php
    header('content-type:application/json;charset=utf-8');
    @$pid=$_REQUEST['pid'];
    @$count=$_REQUEST['count'];
    @$weight=$_REQUEST['weight'];
    session_start();
    $uid=$_SESSION['uid'];
    if(empty($pid) || empty($count) || empty($weight) || empty($uid)){
        echo "[]";
        return;
    }
    require('init.php');
    $sql="SELECT * FROM t_cart WHERE uid=$uid";
    $result=mysqli_query($conn,$sql);
    $row=mysqli_fetch_assoc($result);
    if($row===null){
    	$sql="INSERT INTO t_cart VALUES(null,$uid)";
    	$result=mysqli_query($conn,$sql);
    	$cid=mysqli_insert_id($conn);
   	}else{
   		$cid=$row['id'];
   	}
    $sql = "SELECT id FROM t_cart_detail WHERE cid=$cid AND pid=$pid AND weight=$weight";
    $result = mysqli_query($conn,$sql);
    $row = mysqli_fetch_assoc($result);
    if($row){
      if($count == -1)//之前曾经购买过该商品，则更新购买数量加1
      {
        $sql = "UPDATE t_cart_detail SET count=count+1 WHERE cid=$cid AND pid=$pid AND weight=$weight";
      }elseif($count==-2){
        $sql = "UPDATE t_cart_detail SET count=count-1 WHERE cid=$cid AND pid=$pid AND weight=$weight";
      }elseif($count==-3){
        $sql="DELETE FROM t_cart_detail WHERE cid=$cid AND pid=$pid AND weight=$weight";
      }
      else
      {
        $sql = "UPDATE t_cart_detail SET count='$count' WHERE cid=$cid AND pid=$pid AND weight=$weight";
      }
      mysqli_query($conn,$sql);
      $output['code'] = 2;
      $output['msg'] = 'succ';
    }else {     //之前从未购买过该商品，则添加购买记录，购买数量为count值
      $sql = "INSERT INTO t_cart_detail VALUES(NULL,$cid,$pid,$count,$weight)";
      mysqli_query($conn,$sql);
      $output['code'] = 1;
      $output['msg'] = 'succ';
    }
    echo json_encode($output);
?>