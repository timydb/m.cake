<?php
header('Content-Type:application/json');
$output = [];
session_start();
@$uid = $_SESSION['uid'];
if(empty($uid)){
    echo "[]";
    return;
}
require('init.php');
$sql = "SELECT t_order.oid,t_order.uid,t_order.phone,t_order.addr,t_order.totalprice,t_order.uname,t_order.order_time,t_orderdetails.pid,t_orderdetails.count,t_orderdetails.price,t_product.pname,t_product.img_l from t_order,t_orderdetails,t_product WHERE t_order.oid = t_orderdetails.oid and t_orderdetails.pid = t_product.pid and t_order.uid='$uid'";
$result = mysqli_query($conn, $sql);
$output['data'] = mysqli_fetch_all($result, MYSQLI_ASSOC);
echo json_encode($output);
?>
