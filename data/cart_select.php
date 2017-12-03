<?php
    header("content-type:application/json;charset=utf-8");
    session_start();
    $uid=$_SESSION['uid'];
    if(empty($uid)){
        echo [];
        return;
    }
    require('init.php');
    $sql="SELECT  t_product.pname, t_product.pid, t_product.material,t_product.discount, t_product.price, t_product.img_l,t_cart_detail.weight,t_cart_detail.count,t_cart_detail.id FROM t_product,t_cart_detail WHERE  t_product.pid=t_cart_detail.pid AND t_cart_detail.cid=(SELECT id FROM t_cart WHERE uid=$uid)";
    $result=mysqli_query($conn,$sql);
    $rows=mysqli_fetch_all($result,MYSQLI_ASSOC);
    $sumCount=0;
    foreach($rows as $k=>$v){
         $sumCount+=$v['count'];
    }
    $_SESSION['count']=$sumCount;
    $rows[]=$_SESSION['count'];
    echo json_encode($rows);
?>