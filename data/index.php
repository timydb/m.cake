<?php
    header('content-type:application/json;charset=utf-8');
    require('init.php');
    $sql="SELECT pname,pid,price,rating,isIndex,img_l FROM t_product WHERE isIndex<=3";
    $result=mysqli_query($conn,$sql);
    $rows=mysqli_fetch_all($result,MYSQLI_ASSOC);
    echo json_encode($rows);
?>