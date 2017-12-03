<?php
header('Content-Type:application/json');
$output = [];
@$phone = $_REQUEST['phone'];
@$uname = $_REQUEST['uname'];
@$addr = $_REQUEST['addr'];
@$totalprice = $_REQUEST['totalprice'];
@$cartDetail = $_REQUEST['cartDetail'];
$order_time = time()*1000;
session_start();
$uid=$_SESSION['uid'];

if(empty($uid) || empty($uname) || empty($phone) || empty($addr) || empty($totalprice) || empty($cartDetail)){
    echo "[]";
    return;
}
require('init.php');
$sql = "insert into t_order values(null,'$uid','$phone','$uname','$order_time','$addr','$totalprice')";
$result = mysqli_query($conn, $sql);
$arr = [];
if($result){
    $oid = mysqli_insert_id($conn);
    //json数据转换为json数组
    $cart = json_decode($cartDetail);
    foreach ($cart as &$one ) {
        $sql = "insert into t_orderdetails values(null,'$oid','$one->pid','$one->count','$one->weight','$one->price')";
        $result = mysqli_query($conn, $sql);
        $sql = "DELETE FROM t_cart_detail WHERE id=$one->id";
        $result = mysqli_query($conn,$sql);
    }

    $arr['msg'] = 'succ';
    $arr['reason'] = "订单生成成功";
    $arr['oid'] = $oid;
}else{
    $arr['msg'] = 'error';
    $arr['reason'] = "订单生成失败";
}
$output[] = $arr;
echo json_encode($output);
?>
