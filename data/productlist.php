<?php
    header("content-type:application/json;charset=utf-8");
    require('init.php');

    @$start=$_REQUEST['start'];
    $sql="SELECT pname,pid,price,rating,isIndex,discount,img_l,weight,material FROM t_product LIMIT $start,8";
    $result=mysqli_query($conn,$sql);
    $rows=mysqli_fetch_all($result,MYSQLI_ASSOC);

    echo json_encode($rows);
?>