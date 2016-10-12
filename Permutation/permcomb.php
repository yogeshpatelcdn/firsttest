<html>
<body>
<?php 

//$arr = array(1, 2,3,5,6);

$arr_raw = explode("-", $_POST["name"]);
sort($arr_raw);
$arr_index = array_unique($arr_raw);
$arr = array_values($arr_index)

?><b>Your Sorted Input :  <?php echo "<pre>"; foreach($arr as $result) {
    echo $result."-";
} ; ?> </b> <br>
<b>Output : </b> <br>
<?php

$r = sizeof($arr)-1;//Size of output
if($r>10){
$r=10;
}

$n =sizeof($arr);
//echo $n."---".$r ; 
//echo "<pre>";
//print_r($arr); 



printCombination($arr, $n, $r);

function printCombination($arr,  $n, $r)
{

    // A temporary array to store all combination one by one
    $data = array();

    // Sort array to handle duplicates
    //qsort (arr, n, sizeof(int), compare);

    // Print all combination using temprary array 'data[]'
    combinationUtil($arr, $data, 0, $n-1, 0, $r);
}

function combinationUtil($arr, $data, $start, $end, $index, $r)
{

    // Current combination is ready to be printed, print it
    if ($index === $r)
    {
	
        for ($i=0; $i<$r; $i++)
            //printf("%d " ,data[i]);
			
			echo $data[$i].", ";?><br>
<?php 	
   return;		
        
     
    }

    // replace index with all possible elements. The condition
    // "end-i+1 >= r-index" makes sure that including one element
    // at index will make a combination with remaining elements
    // at remaining positions
    for ( $i=$start; $i<=$end && $end-$i+1 >= $r-$index; $i++)
    {
        $data[$index] = $arr[$i];
        //var_dump($data);
		combinationUtil($arr, $data, $i+1, $end, $index+1, $r);


        // Remove duplicates
        while ($arr[i] == $arr[i+1])
             $i++;
    }
}


?>

</body>
</html> 