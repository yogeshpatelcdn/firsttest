<?php if (!defined('BASEPATH')) exit('No direct script access allowed');
/**
 * Author : 
 * Email  : 
 * Timestamp : April-07 06:11PM
 * Copyright : nosave
 * Last updated : 12-06-2014
 *
 */
class search
{
	public $_responce = array();
    /**
	* @method __construct
    * @param null
	* @see private constructor to protect beign inherited
	* @access private
	* @return void
	*/
	public function __construct()
	{
		/// -- Create Database Connection instance --
		$this->_db=env::getInst();
		$this->_appid = generalize::$_appid; 
		$this->_adminemail = generalize::$_adminemail; 
		$this->_generalize = new generalize();
    }
	/**
	* @method login
    * @param null
	* @see public function with POST method
	* @access private
	* @return response message
	* @link URL - http://localhost/nosave/services/user/login
	*/
	public function search_item_filter()
    {
	
			$records_array  = array();
			
            $name	    	= $_REQUEST['name'];
            $type		    = $_REQUEST['type'];
			$color		    = $_REQUEST['color'];
			$year		    = $_REQUEST['year'];
			$brand		    = $_REQUEST['brand'];
			
			$records_array = array();	
//if($current_user_id !="")
				{
				$sql="SELECT uploadImage.*,users.username, users.email, users.profile_picture from uploadImage join users on users.id=uploadImage.item_uploadedBy
						where uploadImage.item_name like '%".$name."%' or 
							  uploadImage.item_brand like '%".$brand."%' or
							   uploadImage.item_year like '%".$year."%' or
							    uploadImage.item_color like '%".$color."%' or
								 uploadImage.item_type like '%".$type."%'";	
				$result = $this->_db->my_query($sql);
				if($this->_db->my_num_rows($result) >= 1)
				{
				$data_array=array();
				while($row=$this->_db->my_fetch_object($result))
				{	
				$current_records_array=array();
				$user_detail=array();
				$user_detail['username'] = $row->username;
				$user_detail['id'] =	$row->item_uploadedBy;
				$user_detail['user_photo'] =	$row->profile_picture;
				$user_detail['email'] =	$row->email;
				$current_records_array['item_uploadedBy']	= $user_detail;
				$current_records_array['item_id'] = $row->item_id;
				$current_records_array['item_name'] = $row->item_name;
				$current_records_array['item_brand'] = $row->item_brand;
				$current_records_array['item_type'] = $row->item_type;
				$current_records_array['item_year'] = $row->item_year;
				$current_records_array['item_color'] = $row->item_color;
				$current_records_array['item_photo'] = $row->item_photo;
				$current_records_array['item_commentsNumber'] = $row->item_commentsNumber;
				$current_records_array['item_likesNumber'] = $row->item_likesNumber;
				$current_records_array['item_shareNumber'] = $row->item_shareNumber;
				$data_array[]=$current_records_array;
				}
				$records_array['status'] = "True";	
				$records_array['message'] = "Data fetch successfully.";
				$records_array['items']	=	$data_array;
				}
				else
				{	
				$records_array['status'] = "False";	
				$records_array['message'] = "No user present with this Search Criteria.";
				}
				}

return $records_array;
			
			
	}
	
	public function follow()
    {
	
			$records_array  = array();
			
            $user_id	    	= $_REQUEST['current_user_id'];
            $following		    = $_REQUEST['following_to'];
			
			$records_array = array();	

				if($user_id !="" && $following !="")
				{
				$sql="Insert into follow (`user_id`, `following_to`) 
                   VALUES ('".$user_id."','".$following."')";	
				$result = $this->_db->my_query($sql);
				if($result)
                    {
                        $records_array['status']    = "True";
                        $records_array['message']   = "User Followed Successfully.";
                    }
					else
					{
						$records_array['status']    = "False";
                        $records_array['message']   = "User Followed Failed.";
					}
					
				}
				else
				{
						$records_array['status']    = "False";
                        $records_array['message']   = "Current UserId & Followingto id required";
				}
				return $records_array;
	}	

	public function unfollow()
	{
		
				$records_array  = array();
				
				$user_id	    	= $_REQUEST['current_user_id'];
				$following		    = $_REQUEST['following_to'];
				
				$records_array = array();	

					if($user_id !="" && $following !="")
					{
					$sql="Delete from follow where `user_id`= '".$user_id."' and  `following_to` = '".$following."'";	
					$result = $this->_db->my_query($sql);
					if($result)
						{
							$records_array['status']    = "True";
							$records_array['message']   = "User UFollowed Successfully.";
						}
						else
						{
							$records_array['status']    = "False";
							$records_array['message']   = "User UFollowed Failed.";
						}
						
					}
					else
					{
							$records_array['status']    = "False";
							$records_array['message']   = "Current UserId & Followingto id required";
					}
					return $records_array;
	}

	public function search_user()
    {
	
			$records_array  = array();
			
           // $username	    	= $_REQUEST['username'];
            $current_user_id    = $_REQUEST['current_user_id'];
			
			
			$records_array = array();	
				if($current_user_id !="")
				{
				$sql="select * from users where ( 
				users.id !='".$current_user_id."' and users.id NOT IN  (select follow.following_to from follow where follow.user_id= '".$current_user_id."' and follow.following_to=users.id)
									)";	
				$result = $this->_db->my_query($sql);
				if($this->_db->my_num_rows($result) >= 1)
				{
				$data_array=array();
				while($row=$this->_db->my_fetch_object($result))
				{	
				$current_records_array=array();
				$user_detail=array();
				$user_detail['username'] = $row->username;
				$user_detail['id'] =	$row->item_uploadedBy;
				$user_detail['user_photo'] =	$row->profile_picture;
				$user_detail['email'] =	$row->email;
				
				$data_array[]=$user_detail;
				}
				$records_array['status'] = "True";	
				$records_array['message'] = "Data fetch successfully.";
				$records_array['items']	=	$data_array;
				}
				else
				{	
				$records_array['status'] = "False";	
				$records_array['message'] = "No user present with this Search Criteria.";
				}
				}
				else
					{
						$records_array['status'] = "False";
						if(!isset($current_user_id))
						{
							$records_array['message'] = "current_user_id cannot be blank.";
						}
						else
						{
							$records_array['message'] = "Problem in current_user_id id.";
						}
						}
						return $records_array;
					}
					
					
					
	public function following_user()
    {
	
			$records_array  = array();
			
           // $username	    	= $_REQUEST['username'];
            $current_user_id    = $_REQUEST['current_user_id'];
			
			
			$records_array = array();	
				if($current_user_id !="")
				{
				$sql="select * from users where ( 
			 users.id  IN  (select follow.following_to from follow where follow.user_id= '".$current_user_id."')
									)";	
				$result = $this->_db->my_query($sql);
				if($this->_db->my_num_rows($result) >= 1)
				{
				$data_array=array();
				while($row=$this->_db->my_fetch_object($result))
				{	
				$current_records_array=array();
				$user_detail=array();
				$user_detail['username'] = $row->username;
				$user_detail['id'] =	$row->item_uploadedBy;
				$user_detail['user_photo'] =	$row->profile_picture;
				$user_detail['email'] =	$row->email;
				
				$data_array[]=$user_detail;
				}
				$records_array['status'] = "True";	
				$records_array['message'] = "Data fetch successfully.";
				$records_array['items']	=	$data_array;
				}
				else
				{	
				$records_array['status'] = "False";	
				$records_array['message'] = "No user present with this Search Criteria.";
				}
				}
				else
					{
						$records_array['status'] = "False";
						if(!isset($current_user_id))
						{
							$records_array['message'] = "current_user_id cannot be blank.";
						}
						else
						{
							$records_array['message'] = "Problem in current_user_id id.";
						}
						}
						return $records_array;
					}	


	public function follower_user()
    {
	
			$records_array  = array();
			
           // $username	    	= $_REQUEST['username'];
            $current_user_id    = $_REQUEST['current_user_id'];
			
			
			$records_array = array();	
				if($current_user_id !="")
				{
				$sql="select * from users where ( 
			 users.id  IN  (select follow.user_id from follow where follow.following_to='".$current_user_id."')
									)";	
				$result = $this->_db->my_query($sql);
				if($this->_db->my_num_rows($result) >= 1)
				{
				$data_array=array();
				while($row=$this->_db->my_fetch_object($result))
				{	
				$current_records_array=array();
				$user_detail=array();
				$user_detail['username'] = $row->username;
				$user_detail['id'] =	$row->item_uploadedBy;
				$user_detail['user_photo'] =	$row->profile_picture;
				$user_detail['email'] =	$row->email;
				
				$data_array[]=$user_detail;
				}
				$records_array['status'] = "True";	
				$records_array['message'] = "Data fetch successfully.";
				$records_array['items']	=	$data_array;
				}
				else
				{	
				$records_array['status'] = "False";	
				$records_array['message'] = "No user present with this Search Criteria.";
				}
				}
				else
					{
						$records_array['status'] = "False";
						if(!isset($current_user_id))
						{
							$records_array['message'] = "current_user_id cannot be blank.";
						}
						else
						{
							$records_array['message'] = "Problem in current_user_id id.";
						}
						}
						return $records_array;
					}								
		/*


select * from users where ( 
			 users.id  IN  (select follow.following_to from follow where follow.user_id= 4)
									)
for following


select * from users where ( 
			 users.id  IN  (select follow.user_id from follow where follow.following_to=2)
									)
									
									for followers



*/	

	
	
}
?>
