<?php
    header("content-type:application/json;charset=utf-8");
    @$pid=$_REQUEST['pid'];
    require('init.php');
    $sql="SELECT pid,pname,detail,weight,price,discount,rating,material FROM t_product WHERE pid=$pid";
    $result=mysqli_query($conn,$sql);
    $output['msg']=mysqli_fetch_all($result,MYSQLI_ASSOC);
    $sql="SELECT img FROM t_imgs WHERE pid=$pid";
    $result=mysqli_query($conn,$sql);
    $output['images']=mysqli_fetch_all($result,MYSQLI_ASSOC);
    echo json_encode($output);
?>